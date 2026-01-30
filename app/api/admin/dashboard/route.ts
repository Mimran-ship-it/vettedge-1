import { NextRequest, NextResponse } from "next/server"
import { verifyJwt } from "@/lib/jwt"
import UserModel from "@/lib/models/User"
import Domain from "@/lib/models/domain"
import Order from "@/lib/models/order" // Import the Order model
import mongoose from "mongoose"

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

    console.log("Starting to fetch dashboard data...")
    
    // Get current month start and end dates
    const currentDate = new Date()
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
    
    // Get previous month start and end dates for growth calculation
    const startOfLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    const endOfLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0)

    const [
      domains,
      users,
      orderStats,
      chatStats,
      recentOrders,
      monthlyRevenue,
      lastMonthRevenue
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
      
      // Order statistics
      (async () => {
        try {
          console.log("Fetching order stats...")
          const stats = await Order.aggregate([
            {
              $group: {
                _id: null,
                totalOrders: { $sum: 1 },
                CompletedOrders: {
                  $sum: { $cond: [{ $eq: ["$paymentStatus", "Completed"] }, 1, 0] }
                },
                pendingOrders: {
                  $sum: { $cond: [{ $eq: ["$paymentStatus", "pending"] }, 1, 0] }
                },
                totalRevenue: {
                  $sum: {
                    $cond: [
                      { $eq: ["$paymentStatus", "Completed"] },
                      "$totalAmount",
                      0
                    ]
                  }
                }
              }
            }
          ])
          console.log("Order stats:", stats)
          return stats[0] || { totalOrders: 0, CompletedOrders: 0, pendingOrders: 0, totalRevenue: 0 }
        } catch (error) {
          console.error("Error fetching order stats:", error)
          return { totalOrders: 0, CompletedOrders: 0, pendingOrders: 0, totalRevenue: 0 }
        }
      })(),
      
      // Chat statistics - temporarily disabled
      Promise.resolve([{ totalSessions: 0, activeSessions: 0, waitingSessions: 0, totalUnreadMessages: 0 }]),
      
      // Recent orders
      (async () => {
        try {
          console.log("Fetching recent orders...")
          const orders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .select('customerEmail items totalAmount paymentStatus createdAt')
            .lean()
          console.log("Recent orders:", orders)
          return orders
        } catch (error) {
          console.error("Error fetching recent orders:", error)
          return []
        }
      })(),
      
      // Monthly revenue (current month)
      (async () => {
        try {
          console.log("Fetching monthly revenue...")
          const result = await Order.aggregate([
            {
              $match: {
                paymentStatus: "Completed",
                createdAt: { $gte: startOfMonth, $lte: endOfMonth }
              }
            },
            {
              $group: {
                _id: null,
                monthlyRevenue: { $sum: "$totalAmount" }
              }
            }
          ])
          console.log("Monthly revenue:", result)
          return result[0]?.monthlyRevenue || 0
        } catch (error) {
          console.error("Error fetching monthly revenue:", error)
          return 0
        }
      })(),
      
      // Last month revenue (for growth calculation)
      (async () => {
        try {
          console.log("Fetching last month revenue...")
          const result = await Order.aggregate([
            {
              $match: {
                paymentStatus: "Completed",
                createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
              }
            },
            {
              $group: {
                _id: null,
                lastMonthRevenue: { $sum: "$totalAmount" }
              }
            }
          ])
          console.log("Last month revenue:", result)
          return result[0]?.lastMonthRevenue || 0
        } catch (error) {
          console.error("Error fetching last month revenue:", error)
          return 0
        }
      })()
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

    // Calculate growth percentage
    let growthPercentage = 0
    if (lastMonthRevenue > 0) {
      growthPercentage = Math.round(((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100)
    } else if (monthlyRevenue > 0) {
      growthPercentage = 100 // If there was no revenue last month but there is this month
    }

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
        total: orderStats.totalRevenue,
        monthly: monthlyRevenue,
        growthPercentage
      },
      orders: {
        total: orderStats.totalOrders,
        Completed: orderStats.CompletedOrders,
        pending: orderStats.pendingOrders
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