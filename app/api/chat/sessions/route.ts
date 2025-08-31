// api/chat/sessions/route.ts
import { NextRequest, NextResponse } from "next/server"
import { ChatSession } from "@/lib/models/chat"
import UserModel from "@/lib/models/User"
import { connectDB } from "@/lib/db"
import jwt from "jsonwebtoken"
import { getAuthToken } from "@/lib/token"

export async function POST(request: NextRequest) {
  try {
    console.log("📤 POST sessions request received")
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
    
    // Only customers can create sessions
    if (user.role !== "customer") {
      console.log("❌ User is not a customer")
      return NextResponse.json({ error: "Only customers can create chat sessions" }, { status: 403 })
    }
    
    // Check if user already has an active session
    const existingSession = await ChatSession.findOne({ 
      userId: user._id, 
      status: { $in: ["active", "waiting"] }
    })
    
    if (existingSession) {
      console.log("✅ Found existing session:", existingSession._id)
      return NextResponse.json({ session: existingSession })
    }
    
    // Create new session
    console.log("🆕 Creating new session...")
    const session = new ChatSession({
      userId: user._id,
      userName: user.name,
      userEmail: user.email || "unknown@example.com",
      status: "waiting"
    })
    
    await session.save()
    console.log("✅ Session created:", session._id)
    
    return NextResponse.json({ session })
  } catch (error) {
    console.error("❌ Error creating session:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}