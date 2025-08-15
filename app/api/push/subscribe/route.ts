import { NextRequest, NextResponse } from "next/server"
import UserModel from "@/lib/models/User"
import { connectDB } from "@/lib/db"
import jwt from "jsonwebtoken"

export async function POST(request: NextRequest) {
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

    const subscription = await request.json()

    // Store subscription in user document or separate collection
    await UserModel.findByIdAndUpdate(user._id, {
      pushSubscription: subscription
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving push subscription:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
