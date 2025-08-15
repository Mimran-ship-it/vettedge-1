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

    let sessions
    if (user.role === "admin") {
      // Admin can see all sessions
      sessions = await ChatSession.find()
        .sort({ lastMessageAt: -1 })
        .populate("userId", "name email")
    } else {
      // Customer can only see their own sessions
      sessions = await ChatSession.find({ userId: user._id })
        .sort({ lastMessageAt: -1 })
    }

    return NextResponse.json({ sessions })
  } catch (error) {
    console.error("Error fetching chat sessions:", error)
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

    // Check if user already has an active session
    let session = await ChatSession.findOne({ 
      userId: user._id, 
      status: { $in: ["active", "waiting"] }
    })

    if (!session) {
      // Create new session
      session = new ChatSession({
        userId: user._id,
        userName: user.name,
        userEmail: user.email,
        status: "waiting"
      })
      await session.save()
    }

    return NextResponse.json({ session })
  } catch (error) {
    console.error("Error creating chat session:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
