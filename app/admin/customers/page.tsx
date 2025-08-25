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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, Eye, User, Calendar, Mail, Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface User {
  _id: string
  name: string
  email: string
  role: "admin" | "customer"
  createdAt: string
  lastLogin?: string
}

export default function AdminCustomersPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])

  useEffect(() => {
    fetchUsers()
  }, [user, router])

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users")
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
        setFilteredUsers(data)
      } else {
        throw new Error("Failed to fetch users")
      }
    } catch (error) {
      console.error("Error fetching users:", error)
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredUsers(filtered)
  }, [searchQuery, users])

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
                <h2 className="text-3xl font-bold tracking-tight">Customer Management</h2>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Stat Cards */}
              {[
                { 
                  title: "Total Users", 
                  count: users.length, 
                  icon: User,
                  color: "text-muted-foreground" 
                },
                { 
                  title: "Customers", 
                  count: users.filter((u) => u.role === "customer").length, 
                  icon: User,
                  color: "text-blue-600" 
                },
                { 
                  title: "Admins", 
                  count: users.filter((u) => u.role === "admin").length, 
                  icon: Shield,
                  color: "text-green-600" 
                },
                { 
                  title: "Active Today", 
                  count: users.filter((u) => {
                    if (!u.lastLogin) return false
                    const today = new Date()
                    const lastLogin = new Date(u.lastLogin)
                    return lastLogin.toDateString() === today.toDateString()
                  }).length, 
                  icon: Calendar,
                  color: "text-orange-600" 
                },
              ].map(({ title, count, icon: Icon, color }, idx) => (
                <Card key={idx}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{title}</CardTitle>
                    <Icon className={`h-4 w-4 ${color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{count}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users by name, email, or role..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Users ({filteredUsers.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="w-full overflow-x-auto">
                  {loading ? (
                    <div className="min-w-[800px] w-full space-y-2 p-4">
                      {[...Array(5)].map((_, index) => (
                        <div key={index} className="grid grid-cols-5 gap-4 bg-muted rounded-md p-4 animate-pulse">
                          {Array.from({ length: 5 }).map((_, i) => (
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
                              <TableHead className="w-[25%]">User</TableHead>
                              <TableHead className="w-[25%]">Email</TableHead>
                              <TableHead className="w-[15%]">Role</TableHead>
                              <TableHead className="w-[20%]">Last Login</TableHead>
                              <TableHead className="w-[15%]">Joined</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredUsers.map((user) => (
                              <TableRow key={user._id}>
                                <TableCell>
                                  <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                                      <User className="h-4 w-4" />
                                    </div>
                                    <div>
                                      <div className="font-medium">{user.name}</div>
                                      <div className="text-sm text-muted-foreground">ID: {user._id.slice(-8)}</div>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center space-x-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">{user.email}</span>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge 
                                    variant={user.role === "admin" ? "default" : "secondary"}
                                    className="flex items-center space-x-1"
                                  >
                                    {user.role === "admin" ? <Shield className="h-3 w-3" /> : <User className="h-3 w-3" />}
                                    <span className="capitalize">{user.role}</span>
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  {user.lastLogin ? (
                                    <div className="text-sm">
                                      {new Date(user.lastLogin).toLocaleDateString()}
                                      <div className="text-xs text-muted-foreground">
                                        {new Date(user.lastLogin).toLocaleTimeString()}
                                      </div>
                                    </div>
                                  ) : (
                                    <span className="text-sm text-muted-foreground">Never</span>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <div className="text-sm">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                    <div className="text-xs text-muted-foreground">
                                      {new Date(user.createdAt).toLocaleTimeString()}
                                    </div>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      {/* Mobile Cards */}
                      <div className="block md:hidden p-4 space-y-4">
                        {filteredUsers.map((user) => (
                          <Card key={user._id}>
                            <CardHeader>
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                                  <User className="h-5 w-5" />
                                </div>
                                <div>
                                  <CardTitle className="text-lg">{user.name}</CardTitle>
                                  <p className="text-sm text-muted-foreground">{user.email}</p>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Role:</span>
                                <Badge 
                                  variant={user.role === "admin" ? "default" : "secondary"}
                                  className="flex items-center space-x-1"
                                >
                                  {user.role === "admin" ? <Shield className="h-3 w-3" /> : <User className="h-3 w-3" />}
                                  <span className="capitalize">{user.role}</span>
                                </Badge>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Last Login:</span>
                                <span className="text-sm text-muted-foreground">
                                  {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Never"}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Joined:</span>
                                <span className="text-sm text-muted-foreground">
                                  {new Date(user.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="text-xs text-muted-foreground pt-2">
                                ID: {user._id}
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
