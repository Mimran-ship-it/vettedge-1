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
import { Plus, Search, MoreHorizontal, Edit, Trash2, Eye, Filter, Globe } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import type { Domain } from "@/lib/models/domain"

export default function AdminDomainsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [domains, setDomains] = useState<Domain[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredDomains, setFilteredDomains] = useState<Domain[]>([])

  useEffect(() => {
    if (!user) {
      router.push("/auth/signin?redirect=/admin/domains")
      return
    }

    if (user.role !== "admin") {
      router.push("/")
      return
    }

    fetchDomains()
  }, [user, router])

  const fetchDomains = async () => {
    try {
      const response = await fetch("/api/domains")
      if (response.ok) {
        const data = await response.json()
        setDomains(data)
        setFilteredDomains(data)
      }
    } catch (error) {
      console.error("Error fetching domains:", error)
      toast({
        title: "Error",
        description: "Failed to fetch domains",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const filtered = domains.filter(
      (domain) =>
        domain.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        domain.description.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    setFilteredDomains(filtered)
  }, [searchQuery, domains])

  const handleDeleteDomain = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return

    try {
      const response = await fetch(`/api/domains/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setDomains(domains.filter((d) => d.id !== id))
        toast({
          title: "Success",
          description: `${name} has been deleted`,
        })
      } else {
        throw new Error("Failed to delete domain")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete domain",
        variant: "destructive",
      })
    }
  }

  if (!user || user.role !== "admin") {
    return null
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <SidebarInset>
          <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
              <div className="flex items-center space-x-2">
                <SidebarTrigger />
                <h2 className="text-3xl font-bold tracking-tight">Domain Management</h2>
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
                  <div className="text-2xl font-bold">{domains.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Available</CardTitle>
                  <Globe className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{domains.filter((d) => d.isAvailable && !d.isSold).length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sold</CardTitle>
                  <Globe className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{domains.filter((d) => d.isSold).length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Featured</CardTitle>
                  <Globe className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{domains.filter((d) => d.featured).length}</div>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search domains..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Domains Table */}
            <Card>
              <CardHeader>
                <CardTitle>Domains ({filteredDomains.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Loading domains...</div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Domain</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Metrics</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDomains.map((domain) => (
                        <TableRow key={domain.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{domain.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {domain.description.substring(0, 50)}...
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">${domain.price.toLocaleString()}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              {domain.isSold ? (
                                <Badge variant="destructive">Sold</Badge>
                              ) : domain.isAvailable ? (
                                <Badge variant="default">Available</Badge>
                              ) : (
                                <Badge variant="secondary">Unavailable</Badge>
                              )}
                              {domain.featured && <Badge variant="outline">Featured</Badge>}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>DR: {domain.metrics.avgAuthorityDR}</div>
                              <div>Traffic: {domain.metrics.monthlyTraffic.toLocaleString()}</div>
                            </div>
                          </TableCell>
                          <TableCell>{new Date(domain.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link href={`/domains/${domain.id}`}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    View
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link href={`/admin/domains/${domain.id}/edit`}>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteDomain(domain.id!, domain.name)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
