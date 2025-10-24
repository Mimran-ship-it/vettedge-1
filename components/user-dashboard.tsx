"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Globe, Users, DollarSign, TrendingUp, Plus, MessageSquare, Clock, CheckCircle, AlertCircle, Star, Heart, ShoppingCart } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/hooks/use-auth"
import { ArrowLeft } from "lucide-react"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"

interface Order {
  _id: string
  sessionId: string
  customerEmail: string
  items: Array<{
    name: string
    price: number
    quantity: number
    _id: string
  }>
  totalAmount: number
  paymentStatus: string
  domainTransfer: "pending" | "completed" // Added domainTransfer field
  billingInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  createdAt: string
  updatedAt: string
  __v: number
}

export function UserDashboard() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(true) // Track auth loading state
  const { toast } = useToast()
  const { user } = useAuth()
  
  useEffect(() => {
    // Check if auth state is loaded
    if (user !== undefined) {
      setAuthLoading(false)
      fetchOrders()
    }
  }, [user]) // Add user as dependency
  
  const fetchOrders = async () => {
    // Don't fetch if user is not available
    if (!user) {
      setLoading(false)
      return
    }
    
    try {
      setLoading(true)
      // Fetch orders data
      const ordersResponse = await fetch("/api/orders")
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json()
        // Filter orders by user email
        const userOrders = user?.email 
          ? (ordersData.orders || []).filter((order: Order) => order.customerEmail === user.email)
          : [];
        setOrders(userOrders)
      } else {
        throw new Error("Failed to fetch orders data")
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to fetch orders data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }
  
  // Add a function to handle retry
  const handleRetry = () => {
    fetchOrders()
  }
  
  // Calculate order statistics from fetched orders
  const orderStats = {
    total: orders.length,
    completed: orders.filter(order => order.paymentStatus === 'COMPLETED').length,
    pending: orders.filter(order => order.paymentStatus === 'pending').length,
    domainTransferCompleted: orders.filter(order => order.domainTransfer === 'completed').length,
    domainTransferPending: orders.filter(order => order.domainTransfer === 'pending').length,
  }
  
  // Calculate total spending from orders
  const totalSpending = orders.reduce((sum, order) => sum + order.totalAmount, 0)
  
  // Create recent purchases from orders
  const recentPurchases = orders.map(order => ({
    id: order._id,
    domain: order.items[0]?.name,
    price: order.totalAmount,
    date: order.createdAt,
    status: order.paymentStatus,
    domainTransfer: order.domainTransfer,
  }))
  
  // Show loading state if either auth or orders are loading
  if (loading || authLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="h-6 w-6 text-gray-700" />
            </button>
            <Skeleton className="h-10 w-32" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        {/* Stats Cards Skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
  
  // Check if user is authenticated
  if (!user) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="h-6 w-6 text-gray-700" />
          </button>
          <h2 className="text-3xl font-bold tracking-tight">Authentication Required</h2>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center space-y-4 py-4">
              <h3 className="text-xl font-semibold">Please sign in to view your dashboard</h3>
              <p className="text-muted-foreground text-center max-w-md">
                You need to be signed in to view your orders and account information.
              </p>
              <Button asChild size="lg">
                <Link href="/signin">
                  Sign In
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
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
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }
  
  const getDomainTransferIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />
    }
  }
  
  const getDomainTransferBadge = (status: string) => {
    return (
      <Badge variant={status === "completed" ? "default" : "secondary"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }
  
  return (
    <div className="flex min-h-screen">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <div className="flex flex-col space-y-1">
            <h2 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name || 'User'}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">{user?.email}</p>
          </div>
        </div>
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderStats.total}</div>
            <p className="text-xs text-muted-foreground">
              {orderStats.completed-orderStats.domainTransferPending} completed, {orderStats.domainTransferPending} pending
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spending</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalSpending)}</div>
            <p className="text-xs text-muted-foreground">
              Across all orders
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Domain Transfers</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderStats.domainTransferCompleted}</div>
            <p className="text-xs text-muted-foreground">
              {orderStats.domainTransferPending} pending transfers
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderStats.completed}</div>
            <p className="text-xs text-muted-foreground">Successfully purchased</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-7">
          <CardHeader>
            <CardTitle>Recent Purchases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPurchases.length > 0 ? (
                recentPurchases.map((purchase) => (
                  <div key={purchase.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-2 mb-2 sm:mb-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium leading-none">{purchase.domain}</p>
                        {getStatusIcon(purchase.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{formatDate(purchase.date)}</p>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">Domain Transfer:</span>
                        {getDomainTransferIcon(purchase.domainTransfer)}
                        {getDomainTransferBadge(purchase.domainTransfer)}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">${purchase.price}</p>
                      <p className="text-sm text-muted-foreground capitalize">{purchase.status}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No orders yet</h3>
                  <p className="text-gray-500 mb-6">You haven't placed any orders yet. Start exploring our domain marketplace.</p>
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Button asChild>
                      <Link href="/domains">
                        <Globe className="h-4 w-4 mr-2" />
                        Browse Domains
                      </Link>
                    </Button>
                    <Button variant="outline" onClick={handleRetry}>
                      Refresh Orders
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Browse Domains CTA */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center space-y-4 py-4">
            <h3 className="text-xl font-semibold">Looking for more domains?</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Browse our marketplace to find premium domains that match your needs.
            </p>
            <Button asChild size="lg">
              <Link href="/domains">
                <Globe className="h-4 w-4 mr-2" />
                Browse All Domains
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}