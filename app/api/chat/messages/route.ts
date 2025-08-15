import { NextRequest, NextResponse } from "next/server"
import { ChatSession, ChatMessage } from "@/lib/models/chat"
import UserModel from "@/lib/models/User"
import { connectDB } from "@/lib/db"
import jwt from "jsonwebtoken"

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    const user = await UserModel.findById(decoded.userId)
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("sessionId")
    
    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 })
    }

    // Verify user has access to this session
    const session = await ChatSession.findById(sessionId)
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    if (user.role !== "admin" && session.userId.toString() !== user._id.toString()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const messages = await ChatMessage.find({ sessionId })
      .sort({ createdAt: 1 })
      .populate("senderId", "name role")

    // Mark messages as read if user is admin
    if (user.role === "admin") {
      await ChatMessage.updateMany(
        { sessionId, senderRole: "customer", isRead: false },
        { isRead: true }
      )
      await ChatSession.findByIdAndUpdate(sessionId, { unreadCount: 0 })
    }

    return NextResponse.json({ messages })
  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const token = request.headers.get("authorization")?.replace("Bearer ", "")
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    const user = await UserModel.findById(decoded.userId)
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const { sessionId, content, messageType = "text" } = await request.json()

    if (!sessionId || !content) {
      return NextResponse.json({ error: "Session ID and content required" }, { status: 400 })
    }

    // Verify session exists and user has access
    const session = await ChatSession.findById(sessionId)
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    if (user.role !== "admin" && session.userId.toString() !== user._id.toString()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Create new message
    const message = new ChatMessage({
      sessionId,
      senderId: user._id,
      senderName: user.name,
      senderRole: user.role,
      content,
      messageType,
      isRead: user.role === "admin" // Admin messages are automatically read
    })

    await message.save()

    // Update session
    const updateData: any = {
      lastMessageAt: new Date(),
      status: "active"
    }

    // If customer is sending message, increment unread count for admin
    if (user.role === "customer") {
      updateData.$inc = { unreadCount: 1 }
    }

    await ChatSession.findByIdAndUpdate(sessionId, updateData)

    const populatedMessage = await ChatMessage.findById(message._id)
      .populate("senderId", "name role")

    return NextResponse.json({ message: populatedMessage })
  } catch (error) {
    console.error("Error sending message:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
