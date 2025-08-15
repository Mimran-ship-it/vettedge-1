import { Server as NetServer } from "http"
import { NextApiRequest, NextApiResponse } from "next"
import { Server as ServerIO } from "socket.io"
import { ChatSession, ChatMessage } from "@/lib/models/chat"
import UserModel from "@/lib/models/User"
import { connectDB } from "@/lib/db"
import jwt from "jsonwebtoken"

export type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: NetServer & {
      io: ServerIO
    }
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}

const SocketHandler = (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (res.socket.server.io) {
    console.log("Socket is already running")
  } else {
    console.log("Socket is initializing")
    const io = new ServerIO(res.socket.server)
    res.socket.server.io = io

    io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token
        if (!token) {
          return next(new Error("Authentication error"))
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
        await connectDB()
        const user = await UserModel.findById(decoded.userId)
        
        if (!user) {
          return next(new Error("User not found"))
        }

        socket.userId = user._id.toString()
        socket.userRole = user.role
        socket.userName = user.name
        next()
      } catch (err) {
        next(new Error("Authentication error"))
      }
    })

    io.on("connection", (socket) => {
      console.log(`User connected: ${socket.userName} (${socket.userRole})`)

      // Join user to their personal room
      socket.join(`user:${socket.userId}`)
      
      // Join admins to admin room
      if (socket.userRole === "admin") {
        socket.join("admins")
      }

      // Handle joining a chat session
      socket.on("join-session", async (sessionId: string) => {
        try {
          await connectDB()
          const session = await ChatSession.findById(sessionId)
          
          if (!session) {
            socket.emit("error", "Session not found")
            return
          }

          // Check if user has access to this session
          if (socket.userRole !== "admin" && session.userId.toString() !== socket.userId) {
            socket.emit("error", "Unauthorized")
            return
          }

          socket.join(`session:${sessionId}`)
          socket.currentSession = sessionId
          
          // If admin joins, mark messages as read
          if (socket.userRole === "admin") {
            await ChatMessage.updateMany(
              { sessionId, senderRole: "customer", isRead: false },
              { isRead: true }
            )
            await ChatSession.findByIdAndUpdate(sessionId, { unreadCount: 0 })
            
            // Notify other admins about read status
            socket.to("admins").emit("messages-read", { sessionId })
          }

        } catch (error) {
          console.error("Error joining session:", error)
          socket.emit("error", "Failed to join session")
        }
      })

      // Handle sending messages
      socket.on("send-message", async (data: { sessionId: string; content: string; messageType?: string }) => {
        try {
          await connectDB()
          const { sessionId, content, messageType = "text" } = data

          const session = await ChatSession.findById(sessionId)
          if (!session) {
            socket.emit("error", "Session not found")
            return
          }

          // Check access
          if (socket.userRole !== "admin" && session.userId.toString() !== socket.userId) {
            socket.emit("error", "Unauthorized")
            return
          }

          // Create message
          const message = new ChatMessage({
            sessionId,
            senderId: socket.userId,
            senderName: socket.userName,
            senderRole: socket.userRole,
            content,
            messageType,
            isRead: socket.userRole === "admin"
          })

          await message.save()

          // Update session
          const updateData: any = {
            lastMessageAt: new Date(),
            status: "active"
          }

          if (socket.userRole === "customer") {
            updateData.$inc = { unreadCount: 1 }
          }

          await ChatSession.findByIdAndUpdate(sessionId, updateData)

          const populatedMessage = await ChatMessage.findById(message._id)
            .populate("senderId", "name role")

          // Emit to session participants
          io.to(`session:${sessionId}`).emit("new-message", populatedMessage)

          // If customer sent message, notify all admins
          if (socket.userRole === "customer") {
            socket.to("admins").emit("new-customer-message", {
              sessionId,
              message: populatedMessage,
              session: await ChatSession.findById(sessionId)
            })
          }

        } catch (error) {
          console.error("Error sending message:", error)
          socket.emit("error", "Failed to send message")
        }
      })

      // Handle session status updates (admin only)
      socket.on("update-session-status", async (data: { sessionId: string; status: string }) => {
        if (socket.userRole !== "admin") {
          socket.emit("error", "Admin access required")
          return
        }

        try {
          await connectDB()
          const { sessionId, status } = data

          const session = await ChatSession.findByIdAndUpdate(
            sessionId,
            { status },
            { new: true }
          )

          if (session) {
            io.to(`session:${sessionId}`).emit("session-status-updated", { sessionId, status })
            io.to("admins").emit("session-updated", session)
          }
        } catch (error) {
          console.error("Error updating session status:", error)
          socket.emit("error", "Failed to update session status")
        }
      })

      // Handle typing indicators
      socket.on("typing", (data: { sessionId: string; isTyping: boolean }) => {
        socket.to(`session:${data.sessionId}`).emit("user-typing", {
          userId: socket.userId,
          userName: socket.userName,
          isTyping: data.isTyping
        })
      })

      socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.userName}`)
      })
    })
  }
  res.end()
}

export default SocketHandler
