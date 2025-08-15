import { NextRequest, NextResponse } from "next/server"
import { ChatSession } from "@/lib/models/chat"
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
    
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    }

    const totalSessions = await ChatSession.countDocuments()
    const activeSessions = await ChatSession.countDocuments({ status: "active" })
    const waitingSessions = await ChatSession.countDocuments({ status: "waiting" })
    const totalUnreadMessages = await ChatSession.aggregate([
      { $group: { _id: null, total: { $sum: "$unreadCount" } } }
    ])

    const stats = {
      totalSessions,
      activeSessions,
      waitingSessions,
      totalUnreadMessages: totalUnreadMessages[0]?.total || 0
    }

    return NextResponse.json({ stats })
  } catch (error) {
    console.error("Error fetching chat stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
