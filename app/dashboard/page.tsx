"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, Heart, CreditCard, TrendingUp, Globe, Calendar, DollarSign, Package } from "lucide-react"
import Link from "next/link"
import { LiveChat } from "@/components/chat/live-chat"
import type { Order } from "@/lib/models/domain"

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push("/auth/signin?redirect=/dashboard")
      return
    }

    fetchOrders()
  }, [user, router])

  const fetchOrders = async () => {
    try {
      const response = await fetch(`/api/orders?userId=${user?.id}`)
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return null
  }

  const stats = {
    totalOrders: orders.length,
    completedOrders: orders.filter((o) => o.status === "completed").length,
    totalSpent: orders.filter((o) => o.status === "completed").reduce((sum, o) => sum + o.totalAmount, 0),
    domainsOwned: orders.filter((o) => o.status === "completed").reduce((sum, o) => sum + o.domains.length, 0),
  }

  const recentOrders = orders.slice(0, 5)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user.name}!</h1>
          <p className="text-lg text-gray-600">Manage your domains and track your investments</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">{stats.completedOrders} completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Domains Owned</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.domainsOwned}</div>
              <p className="text-xs text-muted-foreground">Active domains</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalSpent.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Lifetime investment</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalOrders > 0 ? Math.round((stats.completedOrders / stats.totalOrders) * 100) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">Order completion</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Orders
                <Button variant="outline" size="sm" asChild>
                  <Link href="/orders">View All</Link>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">Loading orders...</div>
              ) : recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium">{order.domains.map((d) => d.domainName).join(", ")}</div>
                        <div className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${order.totalAmount.toLocaleString()}</div>
                        <Badge
                          variant={
                            order.status === "completed"
                              ? "default"
                              : order.status === "pending"
                                ? "secondary"
                                : order.status === "failed"
                                  ? "destructive"
                                  : "outline"
                          }
                        >
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No orders yet</p>
                  <Button className="mt-4" asChild>
                    <Link href="/domains">Browse Domains</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full justify-start bg-transparent" variant="outline" asChild>
                <Link href="/domains">
                  <Globe className="h-4 w-4 mr-2" />
                  Browse Domains
                </Link>
              </Button>

              <Button className="w-full justify-start bg-transparent" variant="outline" asChild>
                <Link href="/wishlist">
                  <Heart className="h-4 w-4 mr-2" />
                  View Wishlist
                </Link>
              </Button>

              <Button className="w-full justify-start bg-transparent" variant="outline" asChild>
                <Link href="/orders">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Order History
                </Link>
              </Button>

              <Button className="w-full justify-start bg-transparent" variant="outline" asChild>
                <Link href="/contact">
                  <Calendar className="h-4 w-4 mr-2" />
                  Contact Support
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Account Overview */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Account Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Account Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span>{user.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span>{user.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account Type:</span>
                    <Badge variant="outline">{user.role}</Badge>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Investment Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Domains:</span>
                    <span>{stats.domainsOwned}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Invested:</span>
                    <span>${stats.totalSpent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average per Domain:</span>
                    <span>
                      $
                      {stats.domainsOwned > 0
                        ? Math.round(stats.totalSpent / stats.domainsOwned).toLocaleString()
                        : "0"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
      <LiveChat />
    </div>
  )
}
