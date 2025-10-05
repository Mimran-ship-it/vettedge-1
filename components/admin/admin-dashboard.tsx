"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Globe, Users, DollarSign, TrendingUp, Plus, MessageSquare, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

interface DashboardData {
  domains: {
    total: number
    available: number
    sold: number
    hot: number
  }
  users: {
    total: number
    customers: number
    admins: number
    activeToday: number
  }
  revenue: {
    total: number
    monthly: number
    growthPercentage: number
  }
  orders: {
    total: number
    completed: number
    pending: number
  }
  chat: {
    totalSessions: number
    activeSessions: number
    waitingSessions: number
    unreadMessages: number
  }
  recentSales: Array<{
    id: string
    domain: string
    price: number
    customer: string
    date: string
    status: string
  }>
}

export function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/admin/dashboard")
      if (response.ok) {
        const data = await response.json()
        
        // Transform recentSales data to match the expected interface
        const transformedRecentSales = data.recentSales.map((sale: any) => ({
          id: sale._id,
          domain: sale.items[0]?.name || "Unknown Domain",
          price: sale.totalAmount,
          customer: sale.customerEmail,
          date: sale.createdAt,
          status: sale.paymentStatus === "complete" ? "completed" : 
                 sale.paymentStatus === "pending" ? "pending" : 
                 sale.paymentStatus
        }))
        
        setDashboardData({
          ...data,
          recentSales: transformedRecentSales
        })
      } else {
        throw new Error("Failed to fetch dashboard data")
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      toast({
        title: "Error",
        description: "Failed to fetch dashboard data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex-1  space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div className="flex items-center space-x-2">
            <SidebarTrigger />
            <Skeleton className="h-10 w-32" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        {/* Stats Cards Skeleton */}
        <div className="grid gap-4  md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
        {/* Content Skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <div className="text-right space-y-2">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(4)].map((_, index) => (
                <Skeleton key={index} className="h-10 w-full" />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!dashboardData) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div className="flex items-center space-x-2">
            <SidebarTrigger />
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          </div>
        </div>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Failed to load dashboard data</p>
          <Button onClick={fetchDashboardData} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
      case 'complete': // Added to handle API response
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div className="flex items-center space-x-2">
          <SidebarTrigger />
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button asChild>
            <Link href="/admin/domains/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Domain
            </Link>
          </Button>
        </div>
      </div>
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Domains</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.domains.total.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.domains.available} available, {dashboardData.domains.sold} sold
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.users.customers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.users.activeToday} active today
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(dashboardData.revenue.total)}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(dashboardData.revenue.monthly)} this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Chats</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.chat.waitingSessions}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.chat.unreadMessages} unread messages
            </p>
          </CardContent>
        </Card>
      </div>
      {/* Additional Stats Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hot Domains</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{dashboardData.domains.hot}</div>
            <p className="text-xs text-muted-foreground">Featured domains</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.orders.total}</div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.orders.completed} completed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{dashboardData.chat.activeSessions}</div>
            <p className="text-xs text-muted-foreground">Live chat sessions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{dashboardData.users.admins}</div>
            <p className="text-xs text-muted-foreground">System administrators</p>
          </CardContent>
        </Card>
      </div>
      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.recentSales.length > 0 ? (
                dashboardData.recentSales.map((sale) => (
                  <div key={sale.id} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium leading-none">{sale.domain}</p>
                        {getStatusIcon(sale.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{sale.customer}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">${sale.price}</p>
                      <p className="text-sm text-muted-foreground">{formatDate(sale.date)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">No recent sales</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start bg-transparent" variant="outline" asChild>
              <Link href="/admin/domains">
                <Globe className="h-4 w-4 mr-2" />
                Manage Domains
              </Link>
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline" asChild>
              <Link href="/admin/customers">
                <Users className="h-4 w-4 mr-2" />
                View Customers
              </Link>
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline" asChild>
              <Link href="/admin/chat">
                <MessageSquare className="h-4 w-4 mr-2" />
                Live Chat Support
              </Link>
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline" asChild>
              <Link href="/admin/orders">
                <CheckCircle className="h-4 w-4 mr-2" />
                View Orders
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}