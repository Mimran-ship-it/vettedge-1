"use client"
import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search, MoreHorizontal, Eye, DollarSign, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Order {
  _id: string
  sessionId: string
  customerEmail: string
  items: {
    name: string
    price: number
    quantity: number
    _id: string
  }[]
  totalAmount: number
  paymentStatus: "complete" | "pending" | "cancelled" | "failed"
  createdAt: string
  updatedAt: string
}

export default function AdminOrdersPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [user, router])

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders")
      if (response.ok) {
        const data = await response.json()
        setOrders(data.orders)
        setFilteredOrders(data.orders)
      } else {
        throw new Error("Failed to fetch orders")
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let filtered = orders
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (order) =>
          order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.items.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }
    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.paymentStatus === statusFilter)
    }
    setFilteredOrders(filtered)
  }, [searchQuery, statusFilter, orders])

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus: newStatus }),
      })
      if (response.ok) {
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, paymentStatus: newStatus as any } : order
        ))
        toast({
          title: "Success",
          description: `Order status updated to ${newStatus}`,
        })
      } else {
        throw new Error("Failed to update order status")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "complete":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      complete: "default",
      pending: "secondary",
      cancelled: "destructive",
      failed: "destructive",
    } as const
    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " at " + date.toLocaleTimeString()
  }

  if (!user || user.role !== "admin") return null

  return (
    <SidebarProvider>
      <div className="flex min-h-screen min-w-screen">
        <AdminSidebar />
        <SidebarInset>
          <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <SidebarTrigger />
                <h2 className="text-3xl font-bold tracking-tight">Order Management</h2>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Stat Cards */}
              {[
                { 
                  title: "Total Orders", 
                  count: orders.length, 
                  icon: DollarSign,
                  color: "text-muted-foreground" 
                },
                { 
                  title: "Completed", 
                  count: orders.filter((o) => o.paymentStatus === "complete").length, 
                  icon: CheckCircle,
                  color: "text-green-600" 
                },
                { 
                  title: "Pending", 
                  count: orders.filter((o) => o.paymentStatus === "pending").length, 
                  icon: Clock,
                  color: "text-yellow-600" 
                },
                { 
                  title: "Total Revenue", 
                  count: orders
                    .filter((o) => o.paymentStatus === "complete")
                    .reduce((sum, o) => sum + o.totalAmount, 0), 
                  icon: DollarSign,
                  color: "text-blue-600",
                  isCurrency: true
                },
              ].map(({ title, count, icon: Icon, color, isCurrency }, idx) => (
                <Card key={idx}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{title}</CardTitle>
                    <Icon className={`h-4 w-4 ${color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {isCurrency ? `$${count.toLocaleString()}` : count.toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search orders by customer email or domain..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-input bg-background rounded-md text-sm"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="complete">Complete</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Orders ({filteredOrders.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="w-full overflow-x-auto">
                  {loading ? (
                    <div className="min-w-[800px] w-full space-y-2 p-4">
                      {[...Array(5)].map((_, index) => (
                        <div key={index} className="grid grid-cols-7 gap-4 bg-muted rounded-md p-4 animate-pulse">
                          {Array.from({ length: 7 }).map((_, i) => (
                            <div key={i} className="h-4 bg-gray-300 rounded w-full" />
                          ))}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      {/* Desktop Table */}
                      <div className="hidden md:block min-w-[800px] w-full">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[20%] max-w-xs truncate">Customer</TableHead>
                              <TableHead className="w-[20%] max-w-xs truncate">Domains</TableHead>
                              <TableHead className="w-[10%]">Amount</TableHead>
                              <TableHead className="w-[10%]">Status</TableHead>
                              <TableHead className="w-[15%]">Session ID</TableHead>
                              <TableHead className="w-[15%]">Date</TableHead>
                              <TableHead className="w-[10%]">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredOrders.map((order) => (
                              <TableRow key={order._id}>
                                <TableCell className="max-w-xs truncate">
                                  <div className="font-medium truncate">{order.customerEmail}</div>
                                </TableCell>
                                <TableCell className="max-w-xs truncate">
                                  <div>
                                    {order.items.map((item, index) => (
                                      <div key={item._id} className="font-medium truncate">
                                        {item.name} {index < order.items.length - 1 ? ',' : ''}
                                      </div>
                                    ))}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="font-medium">${order.totalAmount.toLocaleString()}</div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center space-x-2">
                                    {getStatusIcon(order.paymentStatus)}
                                    {getStatusBadge(order.paymentStatus)}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="text-sm">
                                    <div className="text-xs text-muted-foreground truncate">
                                      {order.sessionId.slice(-8)}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="text-sm">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                    <div className="text-xs text-muted-foreground">
                                      {new Date(order.createdAt).toLocaleTimeString()}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button 
                                        variant="ghost" 
                                        size="sm"
                                        onClick={() => setSelectedOrder(order)}
                                      >
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-3xl">
                                      <DialogHeader>
                                        <DialogTitle className="text-xl">Order Details</DialogTitle>
                                      </DialogHeader>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                          <div>
                                            <h3 className="text-sm font-medium text-muted-foreground">Order ID</h3>
                                            <p className="text-sm">{order._id}</p>
                                          </div>
                                          <div>
                                            <h3 className="text-sm font-medium text-muted-foreground">Session ID</h3>
                                            <p className="text-sm">{order.sessionId.slice(-8)}</p>
                                          </div>
                                          <div>
                                            <h3 className="text-sm font-medium text-muted-foreground">Customer Email</h3>
                                            <p className="text-sm">{order.customerEmail}</p>
                                          </div>
                                          <div>
                                            <h3 className="text-sm font-medium text-muted-foreground">Payment Status</h3>
                                            <div className="flex items-center space-x-2 mt-1">
                                              {getStatusIcon(order.paymentStatus)}
                                              {getStatusBadge(order.paymentStatus)}
                                            </div>
                                          </div>
                                          <div>
                                            <h3 className="text-sm font-medium text-muted-foreground">Order Date</h3>
                                            <p className="text-sm">{formatDate(order.createdAt)}</p>
                                          </div>
                                          <div>
                                            <h3 className="text-sm font-medium text-muted-foreground">Last Updated</h3>
                                            <p className="text-sm">{formatDate(order.updatedAt)}</p>
                                          </div>
                                        </div>
                                        <div className="space-y-4">
                                          <div>
                                            <h3 className="text-sm font-medium text-muted-foreground mb-2">Order Items</h3>
                                            <div className="space-y-3">
                                              {order.items.map((item) => (
                                                <div key={item._id} className="flex justify-between items-center p-3 border rounded-md">
                                                  <div>
                                                    <p className="font-medium">{item.name}</p>
                                                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                                  </div>
                                                  <p className="font-medium">${item.price.toLocaleString()}</p>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                          <div className="flex justify-between items-center pt-4 border-t">
                                            <h3 className="text-sm font-medium">Total Amount</h3>
                                            <p className="text-lg font-bold">${order.totalAmount.toLocaleString()}</p>
                                          </div>
                                        </div>
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                      {/* Mobile Cards */}
                      <div className="block md:hidden p-4 space-y-4">
                        {filteredOrders.map((order) => (
                          <Card key={order._id}>
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-lg truncate">
                                  {order.items.length > 1 
                                    ? `${order.items[0].name} +${order.items.length - 1} more` 
                                    : order.items[0].name}
                                </CardTitle>
                                {getStatusBadge(order.paymentStatus)}
                              </div>
                              <p className="text-sm text-muted-foreground truncate">{order.customerEmail}</p>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Amount:</span>
                                <span className="text-sm font-medium">${order.totalAmount.toLocaleString()}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Session ID:</span>
                                <span className="text-sm text-muted-foreground truncate">
                                  {order.sessionId.slice(-8)}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Date:</span>
                                <span className="text-sm text-muted-foreground">
                                  {new Date(order.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="mt-2">
                                <span className="text-sm font-medium">Domains:</span>
                                <div className="mt-1 space-y-1">
                                  {order.items.map((item) => (
                                    <div key={item._id} className="text-sm text-muted-foreground truncate">
                                      {item.name} - ${item.price.toLocaleString()}
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="flex justify-end pt-2">
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => setSelectedOrder(order)}
                                    >
                                      <Eye className="h-4 w-4 mr-1" />
                                      View Details
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-3xl">
                                    <DialogHeader>
                                      <DialogTitle className="text-xl">Order Details</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                      <div className="space-y-4">
                                        <div>
                                          <h3 className="text-sm font-medium text-muted-foreground">Order ID</h3>
                                          <p className="text-sm">{order._id}</p>
                                        </div>
                                        <div>
                                          <h3 className="text-sm font-medium text-muted-foreground">Session ID</h3>
                                          <p className="text-sm">{order.sessionId}</p>
                                        </div>
                                        <div>
                                          <h3 className="text-sm font-medium text-muted-foreground">Customer Email</h3>
                                          <p className="text-sm">{order.customerEmail}</p>
                                        </div>
                                        <div>
                                          <h3 className="text-sm font-medium text-muted-foreground">Payment Status</h3>
                                          <div className="flex items-center space-x-2 mt-1">
                                            {getStatusIcon(order.paymentStatus)}
                                            {getStatusBadge(order.paymentStatus)}
                                          </div>
                                        </div>
                                        <div>
                                          <h3 className="text-sm font-medium text-muted-foreground">Order Date</h3>
                                          <p className="text-sm">{formatDate(order.createdAt)}</p>
                                        </div>
                                        <div>
                                          <h3 className="text-sm font-medium text-muted-foreground">Last Updated</h3>
                                          <p className="text-sm">{formatDate(order.updatedAt)}</p>
                                        </div>
                                      </div>
                                      <div className="space-y-4">
                                        <div>
                                          <h3 className="text-sm font-medium text-muted-foreground mb-2">Order Items</h3>
                                          <div className="space-y-3">
                                            {order.items.map((item) => (
                                              <div key={item._id} className="flex justify-between items-center p-3 border rounded-md">
                                                <div>
                                                  <p className="font-medium">{item.name}</p>
                                                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                                </div>
                                                <p className="font-medium">${item.price.toLocaleString()}</p>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                        <div className="flex justify-between items-center pt-4 border-t">
                                          <h3 className="text-sm font-medium">Total Amount</h3>
                                          <p className="text-lg font-bold">${order.totalAmount.toLocaleString()}</p>
                                        </div>
                                      </div>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
