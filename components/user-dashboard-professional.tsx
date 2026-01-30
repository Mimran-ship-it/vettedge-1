"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Globe, Users, DollarSign, TrendingUp, Plus, MessageSquare, Clock, CheckCircle, AlertCircle, Star, Heart, ShoppingCart } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/hooks/use-auth"
import { ArrowLeft } from "lucide-react"

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

export function UserDashboardProfessional() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [authLoading, setAuthLoading] = useState(true)
  const { toast } = useToast()
  const { user } = useAuth()
  
  useEffect(() => {
    if (user !== undefined) {
      setAuthLoading(false)
      fetchOrders()
    }
  }, [user])
  
  const fetchOrders = async () => {
    if (!user) {
      setLoading(false)
      return
    }
    
    try {
      setLoading(true)
      const ordersResponse = await fetch("/api/orders")
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json()
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
  
  const handleRetry = () => {
    fetchOrders()
  }
  
  const orderStats = {
    total: orders.length,
    completed: orders.filter(order => order.paymentStatus === 'COMPLETED').length,
    pending: orders.filter(order => order.paymentStatus === 'pending').length,
    domainTransferCompleted: orders.filter(order => order.domainTransfer === 'completed').length,
    domainTransferPending: orders.filter(order => order.domainTransfer === 'pending').length,
  }
  
  const totalSpending = orders.reduce((sum, order) => sum + order.totalAmount, 0)
  
  const recentPurchases = orders.map(order => ({
    id: order._id,
    domain: order.items[0]?.name,
    price: order.totalAmount,
    date: order.createdAt,
    status: order.paymentStatus,
    domainTransfer: order.domainTransfer,
  }))
  
  if (loading || authLoading) {
    return (
      <div className="space-y-6">
        {/* Welcome Skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        
        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-10 w-20 mb-2" />
              <Skeleton className="h-3 w-32" />
            </div>
          ))}
        </div>
        
        {/* Table Skeleton */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="space-y-3">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex items-center justify-between p-4 border-b border-slate-800">
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
        </div>
      </div>
    )
  }
  
  if (!user) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-slate-800 transition-colors rounded-lg"
          >
            <ArrowLeft className="h-5 w-5 text-slate-400" />
          </button>
          <h2 className="text-2xl font-semibold text-white">Authentication Required</h2>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8">
          <div className="flex flex-col items-center justify-center space-y-4 py-4">
            <h3 className="text-xl font-semibold text-white">Please sign in to view your dashboard</h3>
            <p className="text-slate-400 text-center max-w-md">
              You need to be signed in to view your orders and account information.
            </p>
            <Button asChild size="lg" className="bg-slate-700 hover:bg-slate-600">
              <Link href="/signin">
                Sign In
              </Link>
            </Button>
          </div>
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
        return <CheckCircle className="h-4 w-4 text-emerald-500" />
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-slate-500" />
    }
  }
  
  const getDomainTransferIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-emerald-500" />
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-500" />
      default:
        return <AlertCircle className="h-4 w-4 text-slate-500" />
    }
  }
  
  const getDomainTransferBadge = (status: string) => {
    return (
      <Badge variant={status === "completed" ? "default" : "secondary"} className={
        status === "completed" 
          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
      }>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold text-white font-inter">Welcome back, {user?.name || 'User'}</h2>
          <p className="text-sm text-slate-400 font-inter">{user?.email}</p>
        </div>
      </div>
      
      {/* Professional Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-slate-800 rounded-lg">
              <ShoppingCart className="h-5 w-5 text-slate-400" />
            </div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Orders</span>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-bold text-white font-inter">{orderStats.total}</div>
            <p className="text-sm text-slate-400">
              {orderStats.total - orderStats.domainTransferPending} completed, {orderStats.domainTransferPending} pending
            </p>
          </div>
        </div>
        
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-slate-800 rounded-lg">
              <DollarSign className="h-5 w-5 text-slate-400" />
            </div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Spending</span>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-bold text-white font-inter">{formatCurrency(totalSpending)}</div>
            <p className="text-sm text-slate-400">Across all orders</p>
          </div>
        </div>
        
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-slate-800 rounded-lg">
              <Globe className="h-5 w-5 text-slate-400" />
            </div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Transfers</span>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-bold text-white font-inter">{orderStats.domainTransferCompleted}</div>
            <p className="text-sm text-slate-400">{orderStats.domainTransferPending} pending transfers</p>
          </div>
        </div>
        
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-slate-800 rounded-lg">
              <CheckCircle className="h-5 w-5 text-emerald-500" />
            </div>
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Transactions</span>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-bold text-white font-inter">{orderStats.total}</div>
            <p className="text-sm text-slate-400">Successfully purchased</p>
          </div>
        </div>
      </div>
      
      {/* Recent Purchases - Responsive Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-white mb-6">Recent Purchases</h3>
        
        {recentPurchases.length > 0 ? (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Domain</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Date</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Transfer</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-slate-400">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentPurchases.map((purchase) => (
                      <tr key={purchase.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-white">{purchase.domain}</span>
                            {getStatusIcon(purchase.status)}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm text-slate-400">{formatDate(purchase.date)}</td>
                        <td className="py-4 px-4">
                          <span className={`text-sm font-medium capitalize ${
                            purchase.status === 'COMPLETED' ? 'text-emerald-400' : 'text-amber-400'
                          }`}>
                            {purchase.status.toLowerCase()}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            {getDomainTransferIcon(purchase.domainTransfer)}
                            {getDomainTransferBadge(purchase.domainTransfer)}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="text-sm font-medium text-white">${purchase.price}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Mobile List View */}
            <div className="md:hidden space-y-4">
              {recentPurchases.map((purchase) => (
                <div key={purchase.id} className="border-b border-slate-800 pb-4 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-white">{purchase.domain}</span>
                      {getStatusIcon(purchase.status)}
                    </div>
                    <div className="text-sm font-medium text-white">${purchase.price}</div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-400 mb-2">
                    <span>{formatDate(purchase.date)}</span>
                    <span className={`capitalize ${
                      purchase.status === 'COMPLETED' ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {purchase.status.toLowerCase()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-slate-500">Domain Transfer:</span>
                    {getDomainTransferIcon(purchase.domainTransfer)}
                    {getDomainTransferBadge(purchase.domainTransfer)}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <ShoppingCart className="h-16 w-16 text-slate-600 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-white mb-3">No orders yet</h3>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              You haven't placed any orders yet. Start exploring our domain marketplace to find premium domains.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild className="bg-slate-700 hover:bg-slate-600">
                <Link href="/domains">
                  <Globe className="h-4 w-4 mr-2" />
                  Browse Domains
                </Link>
              </Button>
              <Button variant="outline" onClick={handleRetry} className="border-slate-700 text-slate-300 hover:bg-slate-800">
                Refresh Orders
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {/* Browse Domains CTA */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-sm">
        <div className="flex flex-col items-center justify-center space-y-4 py-4">
          <h3 className="text-xl font-semibold text-white">Looking for more domains?</h3>
          <p className="text-slate-400 text-center max-w-md">
            Browse our marketplace to find premium domains that match your needs.
          </p>
          <Button asChild size="lg" className="bg-slate-700 hover:bg-slate-600">
            <Link href="/domains">
              <Globe className="h-4 w-4 mr-2" />
              Browse All Domains
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
