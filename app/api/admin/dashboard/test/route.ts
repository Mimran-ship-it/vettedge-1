import { NextRequest, NextResponse } from "next/server"
import { verifyJwt } from "@/lib/jwt"
import UserModel from "@/lib/models/User"
import Domain from "@/lib/models/domain"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyJwt(token)
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("Test dashboard - starting data fetch...")

    // Test basic domain and user queries
    const [domains, users] = await Promise.all([
      Domain.countDocuments().catch(() => 0),
      UserModel.countDocuments().catch(() => 0)
    ])

    console.log("Test dashboard - basic counts:", { domains, users })

    const testData = {
      domains: {
        total: domains,
        available: 0,
        sold: 0,
        hot: 0
      },
      users: {
        total: users,
        customers: 0,
        admins: 0,
        activeToday: 0
      },
      revenue: {
        total: 0,
        monthly: 0,
        growthPercentage: 0
      },
      orders: {
        total: 0,
        completed: 0,
        pending: 0
      },
      chat: {
        totalSessions: 0,
        activeSessions: 0,
        waitingSessions: 0,
        unreadMessages: 0
      },
      recentSales: []
    }

    console.log("Test dashboard - returning data:", testData)
    return NextResponse.json(testData)
  } catch (error) {
    console.error("Test dashboard error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

