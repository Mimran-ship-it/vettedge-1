// api/chat/messages/route.ts
import { NextRequest, NextResponse } from "next/server"
import { ChatSession, ChatMessage } from "@/lib/models/chat"
import UserModel from "@/lib/models/User"
import { connectDB } from "@/lib/db"
import jwt from "jsonwebtoken"
import { getAuthToken } from "@/lib/token"

export async function GET(request: NextRequest) {
  try {
    console.log("📥 GET messages request received")
    await connectDB()
    
    const token = getAuthToken(request)
    if (!token) {
      console.log("❌ No token found in request")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    console.log("✅ Token found, verifying...")
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    const user = await UserModel.findById(decoded.userId)
    
    if (!user) {
      console.log("❌ User not found")
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    
    console.log("✅ User authenticated:", user.name)
    
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get("sessionId")
    
    if (!sessionId) {
      console.log("❌ No session ID provided")
      return NextResponse.json({ error: "Session ID required" }, { status: 400 })
    }
    
    console.log("🔍 Looking for session:", sessionId)
    // Verify user has access to this session
    const session = await ChatSession.findById(sessionId)
    if (!session) {
      console.log("❌ Session not found")
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }
    
    if (user.role !== "admin" && session.userId.toString() !== user._id.toString()) {
      console.log("❌ Access denied")
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }
    
    console.log("✅ Access granted, fetching messages...")
    const messages = await ChatMessage.find({ sessionId })
      .sort({ createdAt: 1 })
      .populate("senderId", "name role")
    
    console.log(`✅ Found ${messages.length} messages`)
    
    // Mark messages as read if user is admin
    if (user.role === "admin") {
      console.log("📝 Marking messages as read...")
      await ChatMessage.updateMany(
        { sessionId, senderRole: "customer", isRead: false },
        { isRead: true }
      )
      await ChatSession.findByIdAndUpdate(sessionId, { unreadCount: 0 })
      console.log("✅ Messages marked as read")
    }
    
    return NextResponse.json({ messages })
  } catch (error) {
    console.error("❌ Error fetching messages:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("📤 POST messages request received")
    await connectDB()
    
    const token = getAuthToken(request)
    if (!token) {
      console.log("❌ No token found in request")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    console.log("✅ Token found, verifying...")
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    const user = await UserModel.findById(decoded.userId)
    
    if (!user) {
      console.log("❌ User not found")
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    
    console.log("✅ User authenticated:", user.name)
    
    const { sessionId, content, messageType = "text" } = await request.json()
    
    if (!sessionId || !content) {
      console.log("❌ Missing session ID or content")
      return NextResponse.json({ error: "Session ID and content required" }, { status: 400 })
    }
    
    console.log("🔍 Looking for session:", sessionId)
    // Verify session exists and user has access
    const session = await ChatSession.findById(sessionId)
    if (!session) {
      console.log("❌ Session not found")
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }
    
    if (user.role !== "admin" && session.userId.toString() !== user._id.toString()) {
      console.log("❌ Access denied")
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }
    
    console.log("✅ Access granted, creating message...")
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
    console.log("✅ Message saved:", message._id)
    
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
    console.log("✅ Session updated")
    
    const populatedMessage = await ChatMessage.findById(message._id)
      .populate("senderId", "name role")
    
    return NextResponse.json({ message: populatedMessage })
  } catch (error) {
    console.error("❌ Error sending message:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}