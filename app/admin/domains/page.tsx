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
import type { Domain } from "@/types/domain"

export default function AdminDomainsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [domains, setDomains] = useState<Domain[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredDomains, setFilteredDomains] = useState<Domain[]>([])

  useEffect(() => {
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
        setDomains(domains.filter((d) => d._id !== id))
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
                <h2 className="text-3xl font-bold tracking-tight">Domain Management</h2>
              </div>
              <Button asChild>
                <Link href="/admin/domains/new">
                  <Plus className="h-4 w-4 mr-2" /> Add Domain
                </Link>
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Stat Cards */}
              {[
                { title: "Total Domains", count: domains.length, color: "text-muted-foreground" },
                { title: "Available", count: domains.filter((d) => d.isAvailable && !d.isSold).length, color: "text-green-600" },
                { title: "Sold", count: domains.filter((d) => d.isSold).length, color: "text-red-600" },
                { title: "Hot", count: domains.filter((d) => d.isHot).length, color: "text-blue-600" },
              ].map(({ title, count, color }, idx) => (
                <Card key={idx}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{title}</CardTitle>
                    <Globe className={`h-4 w-4 ${color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{count}</div>
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
                      placeholder="Search domains..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" /> Filter
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Domains ({filteredDomains.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="w-full overflow-x-auto">
                  {loading ? (
                    <div className="min-w-[800px] w-full space-y-2 p-4">
                      {[...Array(5)].map((_, index) => (
                        <div key={index} className="grid grid-cols-6 gap-4 bg-muted  p-4 animate-pulse">
                          {Array.from({ length: 6 }).map((_, i) => (
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
                              <TableHead className="w-[25%]">Domain</TableHead>
                              <TableHead className="w-[12%]">Price</TableHead>
                              <TableHead className="w-[18%]">Status</TableHead>
                              <TableHead className="w-[20%]">Metrics</TableHead>
                              <TableHead className="w-[15%]">Created</TableHead>
                              <TableHead className="w-[10%] text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredDomains.map((domain) => (
                              <TableRow key={domain._id}>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">{domain.name}</div>
                                    <div className="text-sm text-muted-foreground">
                                      {domain.description.substring(0, 30)}...
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="font-medium">${domain.price.toLocaleString()}</div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex flex-wrap gap-1">
                                    {domain.isSold ? (
                                      <Badge variant="destructive">Sold</Badge>
                                    ) : domain.isAvailable ? (
                                      <Badge variant="default">Available</Badge>
                                    ) : (
                                      <Badge variant="secondary">Unavailable</Badge>
                                    )}
                                    {domain.isHot && <Badge variant="outline">Hot</Badge>}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="text-sm">
                                    <div>DR: {domain.metrics.domainRank}</div>
                         {domain.metrics?.monthlyTraffic&& <div>Traffic: {domain.metrics?.monthlyTraffic.toLocaleString()}</div>}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {new Date(domain.createdAt).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="text-right">
                                  <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      className="h-8 w-8 p-0"
                                      onClick={(e) => e.stopPropagation()}
                                      onMouseDown={(e) => e.preventDefault()} // prevents scroll jump on click
                                    >
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>

                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem  onSelect={(e) => {
    e.preventDefault() // stops Radix from closing abruptly
    router.push(`/domains/${domain._id}`)
  }}>
                                      
                                          <Eye className="h-4 w-4 mr-2" /> View
                                     
                                      </DropdownMenuItem>
                                      <DropdownMenuItem  onSelect={(e) => {
    e.preventDefault() // stops Radix from closing abruptly
    router.push(`/admin/domains/edit/${domain._id}`)
  }}>
                                          <Edit className="h-4 w-4 mr-2" /> Edit
                                        </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => handleDeleteDomain(domain._id!, domain.name)}
                                        className="text-red-600"
                                      >
                                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>

                      {/* Mobile Cards */}
                      <div className="block md:hidden p-4 space-y-4">
                        {filteredDomains.map((domain) => (
                          <Card key={domain._id}>
                            <CardHeader>
                              <CardTitle className="text-lg">{domain.name}</CardTitle>
                              <p className="text-sm text-muted-foreground">
                                {domain.description.substring(0, 60)}...
                              </p>
                            </CardHeader>
                            <CardContent className="space-y-2">
                              <div className="text-sm font-medium">
                                Price: ${domain.price.toLocaleString()}
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {domain.isSold ? (
                                  <Badge variant="destructive">Sold</Badge>
                                ) : domain.isAvailable ? (
                                  <Badge variant="default">Available</Badge>
                                ) : (
                                  <Badge variant="secondary">Unavailable</Badge>
                                )}
                                {domain.isHot && <Badge variant="outline">Hot</Badge>}
                              </div>
                              <div className="text-sm">
                                <div>DR: {domain.metrics.domainRank}</div>
                           { domain.metrics?.monthlyTraffic&&    <div>Traffic: {domain.metrics?.monthlyTraffic.toLocaleString()}</div>}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Created: {new Date(domain.createdAt).toLocaleDateString()}
                              </div>
                              <div className="flex justify-end gap-2 pt-2">
                                <Link href={`/domains/${domain._id}`}>
                                  <Button size="sm" variant="outline">
                                    <Eye className="h-4 w-4 mr-1" /> View
                                  </Button>
                                </Link>
                                <Link href={`/admin/domains/edit/${domain._id}`}>
                                  <Button size="sm" variant="secondary">
                                    <Edit className="h-4 w-4 mr-1" /> Edit
                                  </Button>
                                </Link>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDeleteDomain(domain._id!, domain.name)}
                                >
                                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                                </Button>
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