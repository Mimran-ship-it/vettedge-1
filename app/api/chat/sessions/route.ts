// api/chat/sessions/route.ts
import { NextRequest, NextResponse } from "next/server"
import { ChatSession } from "@/lib/models/chat"
import UserModel from "@/lib/models/User"
import { connectDB } from "@/lib/db"
import jwt from "jsonwebtoken"
import { getAuthToken } from "@/lib/token"

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const token = getAuthToken(request)
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    const user = await UserModel.findById(decoded.userId)
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    
    // Only customers can create sessions
    if (user.role !== "customer") {
      return NextResponse.json({ error: "Only customers can create chat sessions" }, { status: 403 })
    }
    
    // Check if user already has an active session
    const existingSession = await ChatSession.findOne({ 
      userId: user._id, 
      status: { $in: ["active", "waiting"] }
    })
    
    if (existingSession) {
      return NextResponse.json({ session: existingSession })
    }
    
    // Create new session
    const session = new ChatSession({
      userId: user._id,
      userName: user.name,
      userEmail: user.email || "unknown@example.com",
      status: "waiting"
    })
    
    await session.save()
    
    return NextResponse.json({ session })
  } catch (error) {
    console.error("Error creating session:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}