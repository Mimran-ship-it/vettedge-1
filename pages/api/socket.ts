import { NextApiRequest, NextApiResponse } from "next"
import { Server as NetServer } from "http"
import { Server as SocketIOServer, Socket } from "socket.io"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/db"
import UserModel from "@/lib/models/User"
import { ChatSession, ChatMessage } from "@/lib/models/chat"

// Extend Socket interface to include custom properties
interface CustomSocket extends Socket {
  userId?: string 
  userRole?: string
  userName?: string
  currentSession?: string
}

export type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: NetServer & {
      io: SocketIOServer
    }
  }
}

const SocketHandler = async (req: NextApiRequest, res: NextApiResponseServerIO) => {
  if (res.socket.server.io) {
    console.log("Socket is already running")
    res.end()
    return
  } else {
    console.log("Socket is initializing")
    const io = new SocketIOServer(res.socket.server, {
      path: "/api/socket",
      addTrailingSlash: false,
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    })

    // Authentication middleware
    io.use(async (socket: CustomSocket, next: (err?: Error) => void) => {
      try {
        const token = socket.handshake.auth.token
        if (!token) {
          return next(new Error("Authentication error"))
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as any
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
        console.error("Socket auth error:", err)
        next(new Error("Authentication error"))
      }
    })

    io.on("connection", (socket: CustomSocket) => {
      console.log(`User connected: ${socket.userId} (${socket.userName})`)
      
      // Join user to their personal room
      socket.join(`user:${socket.userId}`)
      
      // Join admins to admin room
      if (socket.userRole === "admin") {
        socket.join("admins")
      }

      // Join session
      socket.on("join_session", async (sessionId: string) => {
        try {
          await connectDB()
          const session = await ChatSession.findById(sessionId)
          
          if (!session) {
            socket.emit("error", { message: "Session not found" })
            return
          }

          // Check if user has access to this session
          if (socket.userRole !== "admin" && session.userId.toString() !== socket.userId) {
            socket.emit("error", { message: "Access denied" })
            return
          }

          socket.currentSession = sessionId
          socket.join(`session:${sessionId}`)
          
          console.log(`User ${socket.userName} joined session ${sessionId}`)
          socket.emit("session_joined", { sessionId })
        } catch (error) {
          console.error("Join session error:", error)
          socket.emit("error", { message: "Failed to join session" })
        }
      })

      // Send message
      socket.on("send_message", async (data: { sessionId?: string; content: string }) => {
        try {
          console.log("Received send_message event:", data, "from user:", socket.userName)
          await connectDB()
          
          let session
          if (data.sessionId) {
            session = await ChatSession.findById(data.sessionId)
          } else {
            // Find or create session for this user
            session = await ChatSession.findOne({ 
              userId: socket.userId, 
              status: { $in: ["active", "waiting"] }
            })
            
            if (!session) {
              console.log("Creating new session for user:", socket.userName)
              session = new ChatSession({
                userId: socket.userId,
                userName: socket.userName,
                userEmail: "unknown@example.com",
                status: "waiting"
              })
              await session.save()
            }
          }
          
          if (!session) {
            console.error("No session found or created")
            socket.emit("error", { message: "Session not found" })
            return
          }

          // Check access
          if (socket.userRole !== "admin" && session.userId.toString() !== socket.userId) {
            console.error("Access denied for user:", socket.userName)
            socket.emit("error", { message: "Access denied" })
            return
          }

          // Create message
          const message = new ChatMessage({
            sessionId: session._id,
            senderId: socket.userId,
            senderName: socket.userName,
            senderRole: socket.userRole,
            content: data.content,
            messageType: "text",
            isRead: false
          })

          await message.save()

          console.log("Message saved:", message._id)

          // Update session
          await ChatSession.findByIdAndUpdate(session._id, {
            lastMessageAt: new Date(),
            $inc: { unreadCount: socket.userRole === "admin" ? 0 : 1 }
          })

          console.log("Emitting new_message to session room:", `session:${session._id}`)

          // Emit to session room (this will reach all participants including sender)
          io.to(`session:${session._id}`).emit("new_message", {
            _id: message._id,
            sessionId: session._id,
            senderId: socket.userId,
            senderName: socket.userName,
            senderRole: socket.userRole,
            content: data.content,
            messageType: "text",
            isRead: false,
            createdAt: message.createdAt
          })

          // Notify admins if customer sent message
          if (socket.userRole === "customer") {
            io.to("admins").emit("new_customer_message", {
              sessionId: data.sessionId,
              customerName: socket.userName,
              content: data.content
            })
          }

        } catch (error) {
          console.error("Send message error:", error)
          socket.emit("error", { message: "Failed to send message" })
        }
      })

      // Typing indicator
      socket.on("typing", (data: { sessionId: string; isTyping: boolean }) => {
        socket.to(`session:${data.sessionId}`).emit("user_typing", {
          userId: socket.userId,
          userName: socket.userName,
          isTyping: data.isTyping
        })
      })

      // Update session status (admin only)
      socket.on("update_session_status", async (data: { sessionId: string; status: string }) => {
        if (socket.userRole !== "admin") {
          socket.emit("error", { message: "Access denied" })
          return
        }

        try {
          await connectDB()
          const session = await ChatSession.findByIdAndUpdate(
            data.sessionId,
            { status: data.status },
            { new: true }
          )

          if (session) {
            io.to(`session:${data.sessionId}`).emit("session_status_updated", {
              sessionId: data.sessionId,
              status: data.status
            })
          }
        } catch (error) {
          console.error("Update session status error:", error)
          socket.emit("error", { message: "Failed to update session status" })
        }
      })

      socket.on("disconnect", () => {
        console.log(`User disconnected: ${socket.userId} (${socket.userName})`)
      })
    })

    res.socket.server.io = io
  }

  res.end()
}

export default SocketHandler

export const config = {
  api: {
    bodyParser: false,
  },
}
