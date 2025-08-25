import { NextRequest, NextResponse } from "next/server"
import { verifyJwt } from "@/lib/jwt"
import UserModel from "@/lib/models/User"
import Domain from "@/lib/models/domain"
// orderService temporarily disabled due to connection issues
// Database connection is handled by Mongoose models automatically
// ChatSession temporarily disabled due to connection issues
// Order model is not needed here since we're using the orderService

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

    // Mongoose models handle their own connections, so we don't need to call connectDB() here

    // Fetch all data in parallel for better performance
    console.log("Starting to fetch dashboard data...")
    
    const [
      domains,
      users,
      orderStats,
      chatStats,
      recentOrders
    ] = await Promise.all([
      // Domain statistics
      (async () => {
        try {
          console.log("Fetching domain stats...")
          const stats = await Domain.aggregate([
            {
              $group: {
                _id: null,
                totalDomains: { $sum: 1 },
                availableDomains: {
                  $sum: { $cond: [{ $and: [{ $eq: ["$isAvailable", true] }, { $ne: ["$isSold", true] }] }, 1, 0] }
                },
                soldDomains: {
                  $sum: { $cond: [{ $eq: ["$isSold", true] }, 1, 0] }
                },
                hotDomains: {
                  $sum: { $cond: [{ $eq: ["$isHot", true] }, 1, 0] }
                }
              }
            }
          ])
          console.log("Domain stats:", stats)
          return stats
        } catch (error) {
          console.error("Error fetching domain stats:", error)
          return [{ totalDomains: 0, availableDomains: 0, soldDomains: 0, hotDomains: 0 }]
        }
      })(),
      
      // User statistics
      (async () => {
        try {
          console.log("Fetching user stats...")
          const stats = await UserModel.aggregate([
            {
              $group: {
                _id: null,
                totalUsers: { $sum: 1 },
                adminUsers: {
                  $sum: { $cond: [{ $eq: ["$role", "admin"] }, 1, 0] }
                },
                customerUsers: {
                  $sum: { $cond: [{ $eq: ["$role", "customer"] }, 1, 0] }
                },
                activeToday: {
                  $sum: {
                    $cond: [
                      {
                        $gte: [
                          "$lastLogin",
                          new Date(new Date().setHours(0, 0, 0, 0))
                        ]
                      },
                      1,
                      0
                    ]
                  }
                }
              }
            }
          ])
          console.log("User stats:", stats)
          return stats
        } catch (error) {
          console.error("Error fetching user stats:", error)
          return [{ totalUsers: 0, adminUsers: 0, customerUsers: 0, activeToday: 0 }]
        }
      })(),

      // Order statistics - temporarily disabled due to connection issues
      Promise.resolve({ totalOrders: 0, totalRevenue: 0, completedOrders: 0, pendingOrders: 0 }),

      // Chat statistics - temporarily disabled due to connection issues
      Promise.resolve([{ totalSessions: 0, activeSessions: 0, waitingSessions: 0, totalUnreadMessages: 0 }]),

      // Recent orders for recent sales - temporarily disabled due to connection issues
      Promise.resolve([])
    ])

    // Extract the first result from aggregation arrays
    const domainStats = domains[0] || {
      totalDomains: 0,
      availableDomains: 0,
      soldDomains: 0,
      hotDomains: 0
    }

    const userStats = users[0] || {
      totalUsers: 0,
      adminUsers: 0,
      customerUsers: 0,
      activeToday: 0
    }

    const chatStatsResult = chatStats[0] || {
      totalSessions: 0,
      activeSessions: 0,
      waitingSessions: 0,
      totalUnreadMessages: 0
    }

    // Calculate monthly revenue (current month)
    const currentMonth = new Date()
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)

    // Monthly revenue calculation - temporarily disabled due to connection issues
    const monthlyRevenue = 0

    // Calculate growth percentage (mock for now - you can implement real growth calculation)
    const growthPercentage = 12 // This should be calculated based on previous month data

    const dashboardData = {
      domains: {
        total: domainStats.totalDomains,
        available: domainStats.availableDomains,
        sold: domainStats.soldDomains,
        hot: domainStats.hotDomains
      },
      users: {
        total: userStats.totalUsers,
        customers: userStats.customerUsers,
        admins: userStats.adminUsers,
        activeToday: userStats.activeToday
      },
      revenue: {
        total: orderStats.totalRevenue || 0,
        monthly: monthlyRevenue,
        growthPercentage
      },
      orders: {
        total: orderStats.totalOrders || 0,
        completed: orderStats.completedOrders || 0,
        pending: orderStats.pendingOrders || 0
      },
      chat: {
        totalSessions: chatStatsResult.totalSessions,
        activeSessions: chatStatsResult.activeSessions,
        waitingSessions: chatStatsResult.waitingSessions,
        unreadMessages: chatStatsResult.totalUnreadMessages
      },
      recentSales: recentOrders
    }

    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
