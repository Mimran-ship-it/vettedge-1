// app/api/user/dashboard/route.ts
import { NextRequest, NextResponse } from "next/server"
import { verifyJwt } from "@/lib/jwt"
import UserModel from "@/lib/models/User"
import Domain from "@/lib/models/domain"
import Order from "@/lib/models/order"
import mongoose from "mongoose"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    const decoded = verifyJwt(token)
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    console.log("Starting to fetch user dashboard data for user:", decoded.userId)
    
    // Get current month start and end dates
    const currentDate = new Date()
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
    
    // Get previous month start and end dates for growth calculation
    const startOfLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    const endOfLastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0)
    
    const [
      user,
      userOrders,
      monthlySpending,
      lastMonthSpending,
      userDomains,
      hotDomains
    ] = await Promise.all([
      // Get user details
      (async () => {
        try {
          console.log("Fetching user details...")
          const user = await UserModel.findById(decoded.userId)
          console.log("User details:", user)
          return user
        } catch (error) {
          console.error("Error fetching user details:", error)
          return null
        }
      })(),
      
      // Get user's orders
      (async () => {
        try {
          console.log("Fetching user orders...")
          const orders = await Order.find({ userId: decoded.userId })
            .sort({ createdAt: -1 })
            .limit(10)
            .select('domainName totalAmount paymentStatus createdAt')
            .lean()
          console.log("User orders:", orders)
          return orders
        } catch (error) {
          console.error("Error fetching user orders:", error)
          return []
        }
      })(),
      
      // Monthly spending (current month)
      (async () => {
        try {
          console.log("Fetching monthly spending...")
          const result = await Order.aggregate([
            {
              $match: {
                userId: new mongoose.Types.ObjectId(decoded.userId),
                paymentStatus: "complete",
                createdAt: { $gte: startOfMonth, $lte: endOfMonth }
              }
            },
            {
              $group: {
                _id: null,
                monthlySpending: { $sum: "$totalAmount" }
              }
            }
          ])
          console.log("Monthly spending:", result)
          return result[0]?.monthlySpending || 0
        } catch (error) {
          console.error("Error fetching monthly spending:", error)
          return 0
        }
      })(),
      
      // Last month spending (for growth calculation)
      (async () => {
        try {
          console.log("Fetching last month spending...")
          const result = await Order.aggregate([
            {
              $match: {
                userId: new mongoose.Types.ObjectId(decoded.userId),
                paymentStatus: "complete",
                createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
              }
            },
            {
              $group: {
                _id: null,
                lastMonthSpending: { $sum: "$totalAmount" }
              }
            }
          ])
          console.log("Last month spending:", result)
          return result[0]?.lastMonthSpending || 0
        } catch (error) {
          console.error("Error fetching last month spending:", error)
          return 0
        }
      })(),
      
      // Get user's domains
      (async () => {
        try {
          console.log("Fetching user domains...")
          const domains = await Domain.find({ userId: decoded.userId })
            .select('name isAvailable isSold isHot')
            .lean()
          console.log("User domains:", domains)
          return domains
        } catch (error) {
          console.error("Error fetching user domains:", error)
          return []
        }
      })(),
      
      // Get hot domains (for recommendations)
      (async () => {
        try {
          console.log("Fetching hot domains...")
          const domains = await Domain.find({ isHot: true, isAvailable: true, isSold: false })
            .select('name price category')
            .limit(5)
            .lean()
          console.log("Hot domains:", domains)
          return domains
        } catch (error) {
          console.error("Error fetching hot domains:", error)
          return []
        }
      })()
    ])
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    
    // Calculate user-specific statistics
    const totalDomains = userDomains.length
    const purchasedDomains = userDomains.filter(domain => domain.isSold).length
    const wishlistDomains = userDomains.filter(domain => !domain.isSold && domain.isAvailable).length
    
    const totalOrders = userOrders.length
    const completedOrders = userOrders.filter(order => order.paymentStatus === "complete").length
    const pendingOrders = userOrders.filter(order => order.paymentStatus === "pending").length
    
    const totalSpending = userOrders
      .filter(order => order.paymentStatus === "complete")
      .reduce((sum, order) => sum + order.totalAmount, 0)
    
    // Calculate spending growth percentage
    let spendingGrowthPercentage = 0
    if (lastMonthSpending > 0) {
      spendingGrowthPercentage = Math.round(((monthlySpending - lastMonthSpending) / lastMonthSpending) * 100)
    } else if (monthlySpending > 0) {
      spendingGrowthPercentage = 100 // If there was no spending last month but there is this month
    }
    
    // Format recent purchases for the user
    const recentPurchases = userOrders.map(order => ({
      id: order._id.toString(),
      domain: order.domainName,
      price: order.totalAmount,
      date: order.createdAt.toISOString(),
      status: order.paymentStatus
    }))
    
    // Format recommended domains
    const recommendedDomains = hotDomains.map(domain => ({
      id: domain._id.toString(),
      domain: domain.name,
      price: domain.price || 0,
      category: domain.category || "General"
    }))
    
    const userDashboardData = {
      domains: {
        total: totalDomains,
        purchased: purchasedDomains,
        wishlist: wishlistDomains,
        hot: hotDomains.length
      },
      orders: {
        total: totalOrders,
        completed: completedOrders,
        pending: pendingOrders
      },
      spending: {
        total: totalSpending,
        monthly: monthlySpending,
        growthPercentage: spendingGrowthPercentage
      },
      chat: {
        unreadMessages: 0 // Not implemented yet
      },
      recentPurchases,
      recommendedDomains
    }
    
    return NextResponse.json(userDashboardData)
  } catch (error) {
    console.error("Error fetching user dashboard data:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}