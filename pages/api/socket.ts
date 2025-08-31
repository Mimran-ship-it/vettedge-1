import type { NextApiRequest, NextApiResponse } from "next"
import jwt from "jsonwebtoken"
import Pusher from "pusher"
import { connectDB } from "@/lib/db"
import UserModel from "@/lib/models/User"
import { ChatSession, ChatMessage } from "@/lib/models/chat"
import { getSocketToken } from "@/lib/token"

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
})

// Middleware to authenticate via JWT in request header/body
async function authenticate(req: NextApiRequest) {
  const authHeader = req.headers.authorization
  if (!authHeader) throw new Error("No token provided")

  const token = authHeader.replace("Bearer ", "")
  const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as any

  await connectDB()
  const user = await UserModel.findById(decoded.userId)
  if (!user) throw new Error("User not found")

  return user
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = await authenticate(req)

    // --- Handle sending a message ---
    if (req.method === "POST") {
      const { sessionId, content } = req.body

      await connectDB()
      let session

      if (sessionId) {
        session = await ChatSession.findById(sessionId)
      } else {
        // find or create active session for customer
        session = await ChatSession.findOne({
          userId: user._id,
          status: { $in: ["active", "waiting"] }
        })

        if (!session) {
          session = new ChatSession({
            userId: user._id,
            userName: user.name,
            userEmail: user.email || "unknown@example.com",
            status: "waiting",
          })
          await session.save()
        }
      }

      if (!session) {
        return res.status(404).json({ error: "Session not found" })
      }

      if (user.role !== "admin" && session.userId.toString() !== user._id.toString()) {
        return res.status(403).json({ error: "Access denied" })
      }

      // Save message
      const message = new ChatMessage({
        sessionId: session._id,
        senderId: user._id,
        senderName: user.name,
        senderRole: user.role,
        content,
        messageType: "text",
        isRead: false,
      })
      await message.save()

      await ChatSession.findByIdAndUpdate(session._id, {
        lastMessageAt: new Date(),
        $inc: { unreadCount: user.role === "admin" ? 0 : 1 }
      })

      // 🔔 Broadcast message via Pusher
      await pusher.trigger(`session-${session._id}`, "new_message", {
        _id: message._id,
        sessionId: session._id,
        senderId: user._id,
        senderName: user.name,
        senderRole: user.role,
        content,
        messageType: "text",
        isRead: false,
        createdAt: message.createdAt,
      })

      // Notify admins if customer sent message
      if (user.role === "customer") {
        await pusher.trigger("admins", "new_customer_message", {
          sessionId: session._id,
          customerName: user.name,
          content,
        })
      }

      return res.status(200).json({ success: true, message })
    }

    // --- Handle session status updates (admin only) ---
    if (req.method === "PUT") {
      if (user.role !== "admin") {
        return res.status(403).json({ error: "Access denied" })
      }

      const { sessionId, status } = req.body
      const session = await ChatSession.findByIdAndUpdate(
        sessionId,
        { status },
        { new: true }
      )

      if (session) {
        await pusher.trigger(`session-${sessionId}`, "session_status_updated", {
          sessionId,
          status,
        })
      }

      return res.status(200).json({ success: true, session })
    }

    return res.status(405).json({ error: "Method not allowed" })
  } catch (error: any) {
    console.error("Chat API error:", error)
    return res.status(401).json({ error: error.message || "Authentication error" })
  }
}
