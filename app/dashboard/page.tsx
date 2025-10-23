"use client"

import dynamic from 'next/dynamic'

import { SidebarProvider } from "@/components/ui/sidebar"
import { ShoppingCart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, DollarSign, TrendingUp, Plus, CheckCircle, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/hooks/use-auth"
import { useEffect, useState } from "react"

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
  domainTransfer: "pending" | "completed"
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

const UserDashboard = dynamic(() => import('@/components/user-dashboard').then(mod => mod.UserDashboard), {
  ssr: false,
})

export default function DashboardPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(true)
  const { toast } = useToast()
  const { user, loading: userLoading } = useAuth()

  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/login")
      return
    }
    
    if (user) {
      fetchOrders()
    }
  }, [user, userLoading])

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders")
      if (!response.ok) throw new Error("Failed to fetch orders")
      const data = await response.json()
      setOrders(data.orders || [])
    } catch (error) {
      console.error("Error fetching orders:", error)
      toast({
        title: "Error",
        description: "Failed to load your orders. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setAuthLoading(false)
    }
  }

  if (authLoading || userLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  const totalSpent = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
  const activeOrders = orders.filter(order => order.paymentStatus === 'paid').length
  const pendingOrders = orders.filter(order => order.paymentStatus === 'pending').length

  return (
    <SidebarProvider>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
          <Button onClick={() => router.push("/domains")}>
            <Plus className="mr-2 h-4 w-4" />
            New Order
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalSpent.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeOrders}</div>
              <p className="text-xs text-muted-foreground">+19% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingOrders}</div>
              <p className="text-xs text-muted-foreground">+2 since last hour</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Now</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+573</div>
              <p className="text-xs text-muted-foreground">+201 since last hour</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Recent Orders</h3>
            <Button variant="outline" size="sm" onClick={() => router.push("/dashboard/orders")}>
              View All
            </Button>
          </div>
          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="space-y-4 p-6">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : orders.length > 0 ? (
                <div className="divide-y">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order._id} className="flex items-center justify-between p-4 hover:bg-muted/50">
                      <div className="space-y-1">
                        <p className="font-medium">Order #{order._id.slice(-6).toUpperCase()}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge
                          variant={order.paymentStatus === 'paid' ? 'default' : 'outline'}
                          className={order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : ''}
                        >
                          {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                        </Badge>
                        <p className="font-medium">${order.totalAmount.toFixed(2)}</p>
                        <Button variant="ghost" size="sm" onClick={() => router.push(`/dashboard/orders/${order._id}`)}>
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <ShoppingCart className="mb-4 h-12 w-12 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No orders yet</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    You haven't placed any orders yet. Start shopping to see your orders here.
                  </p>
                  <Button onClick={() => router.push("/domains")}>
                    Browse Domains
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </SidebarProvider>
  )
}