// app/admin/sessions/[id]/route.ts
import { NextRequest, NextResponse } from "next/server"
import { ChatSession } from "@/lib/models/chat"
import UserModel from "@/lib/models/User"
import { connectDB } from "@/lib/db"
import jwt from "jsonwebtoken"
import { getAuthToken } from "@/lib/token"

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB()
    
    const token = getAuthToken(request)
    if (!token) {
      console.error("Unauthorized: No token provided")
      return NextResponse.json({ error: "Unauthorized: No token provided" }, { status: 401 })
    }
    
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    } catch (jwtError) {
      console.error("JWT verification error:", jwtError)
      return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 })
    }
    
    const user = await UserModel.findById(decoded.userId).lean().exec()
    
    if (!user) {
      console.error(`User not found for ID: ${decoded.userId}`)
      return NextResponse.json({ error: "Unauthorized: User not found" }, { status: 401 })
    }
    
    if (user.role !== "admin") {
      console.error(`Forbidden: User ${user.name} is not an admin`)
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 })
    }
    
    const { status } = await request.json()
    const sessionId = params.id
    
    if (!["active", "closed", "waiting"].includes(status)) {
      console.error(`Invalid status provided: ${status}`)
      return NextResponse.json({ error: "Bad Request: Invalid status" }, { status: 400 })
    }
    
    const session = await ChatSession.findByIdAndUpdate(
      sessionId,
      { status },
      { new: true }
    ).lean().exec()
    
    if (!session) {
      console.error(`Session not found: ${sessionId}`)
      return NextResponse.json({ error: "Not Found: Session not found" }, { status: 404 })
    }
    
    console.log(`Session ${sessionId} status updated to ${status} by admin ${user.name}`)
    return NextResponse.json({ session })
  } catch (error) {
    console.error("Error updating session:", error)
    return NextResponse.json({ 
      error: "Internal Server Error",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}