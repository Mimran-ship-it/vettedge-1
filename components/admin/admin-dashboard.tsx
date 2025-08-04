"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Globe, Users, DollarSign, TrendingUp, Plus, MessageSquare } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import Link from "next/link"

export function AdminDashboard() {
  // Mock data - in real app, this would come from API
  const stats = {
    totalDomains: 1247,
    availableDomains: 892,
    soldDomains: 355,
    totalCustomers: 2156,
    totalRevenue: 487650,
    monthlyRevenue: 45230,
    pendingChats: 3,
  }

  const recentSales = [
    { id: "1", domain: "techstartup.com", price: 2500, customer: "John Doe", date: "2024-01-15" },
    { id: "2", domain: "digitalmarketing.net", price: 1800, customer: "Jane Smith", date: "2024-01-14" },
    { id: "3", domain: "healthwellness.com", price: 4500, customer: "Mike Johnson", date: "2024-01-13" },
  ]

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
            <div className="text-2xl font-bold">{stats.totalDomains.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {stats.availableDomains} available, {stats.soldDomains} sold
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">${stats.monthlyRevenue.toLocaleString()} this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Chats</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingChats}</div>
            <p className="text-xs text-muted-foreground">Requires immediate attention</p>
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
              {recentSales.map((sale) => (
                <div key={sale.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{sale.domain}</p>
                    <p className="text-sm text-muted-foreground">{sale.customer}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">${sale.price.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">{sale.date}</p>
                  </div>
                </div>
              ))}
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
              <Link href="/admin/analytics">
                <TrendingUp className="h-4 w-4 mr-2" />
                View Analytics
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
