"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Trash2, Eye, Mail, Phone, Calendar, Search, Filter, RefreshCw } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"

import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"

interface Contact {
  _id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  status: "new" | "read" | "replied" | "resolved"
  createdAt: string
  updatedAt: string
}

interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  })
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const fetchContacts = async (page = 1, search = "", status = "all") => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...(search && { search }),
        ...(status !== "all" && { status })
      })

      const response = await fetch(`/api/contact?${params}`)
      const data = await response.json()

      if (response.ok) {
        setContacts(data.contacts)
        setPagination(data.pagination)
      } else {
        toast.error(data.error || "Failed to fetch contacts")
      }
    } catch (error) {
      toast.error("Failed to fetch contacts")
      console.error("Error fetching contacts:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateContactStatus = async (contactId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/contact/${contactId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: newStatus })
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Contact status updated successfully")
        fetchContacts(pagination.page, searchTerm, statusFilter)
        if (selectedContact && selectedContact._id === contactId) {
          setSelectedContact({ ...selectedContact, status: newStatus as any })
        }
      } else {
        toast.error(data.error || "Failed to update contact")
      }
    } catch (error) {
      toast.error("Failed to update contact")
      console.error("Error updating contact:", error)
    }
  }

  const deleteContact = async (contactId: string) => {
    if (!confirm("Are you sure you want to delete this contact?")) return

    try {
      const response = await fetch(`/api/contact/${contactId}`, {
        method: "DELETE"
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Contact deleted successfully")
        fetchContacts(pagination.page, searchTerm, statusFilter)
        setIsDialogOpen(false)
      } else {
        toast.error(data.error || "Failed to delete contact")
      }
    } catch (error) {
      toast.error("Failed to delete contact")
      console.error("Error deleting contact:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-700"
      case "read":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-700"
      case "replied":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700"
      case "resolved":
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
    }
  }

  const handleSearch = () => {
    fetchContacts(1, searchTerm, statusFilter)
  }

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status)
    fetchContacts(1, searchTerm, status)
  }

  const handlePageChange = (newPage: number) => {
    fetchContacts(newPage, searchTerm, statusFilter)
  }

  useEffect(() => {
    fetchContacts()
  }, [])

  return (
    <SidebarProvider>
      <div className="flex min-h-screen min-w-screen">
        <AdminSidebar />
        <SidebarInset className="flex-1 w-full">
          <div className="w-full space-y-4 p-4 md:p-8 pt-6">
            {/* Header */}
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center space-x-2">
                <SidebarTrigger />
                <h2 className="text-3xl font-bold tracking-tight text-foreground">Contact Management</h2>
              </div>
              <Button
                onClick={() => fetchContacts(pagination.page, searchTerm, statusFilter)}
                variant="outline"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
              <Card className="w-full">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Contacts</p>
                      <p className="text-2xl font-bold text-foreground">{pagination.total}</p>
                    </div>
                    <Mail className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card className="w-full">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">New</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {contacts.filter(c => c.status === "new").length}
                      </p>
                    </div>
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                  </div>
                </CardContent>
              </Card>
              <Card className="w-full">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {contacts.filter(c => c.status === "read" || c.status === "replied").length}
                      </p>
                    </div>
                    <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
                  </div>
                </CardContent>
              </Card>
              <Card className="w-full">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                      <p className="text-2xl font-bold text-green-600">
                        {contacts.filter(c => c.status === "resolved").length}
                      </p>
                    </div>
                    <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card className="w-full">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Search by name, email, or subject..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                        onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={handleStatusFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <Filter className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="read">Read</SelectItem>
                      <SelectItem value="replied">Replied</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleSearch}>Search</Button>
                </div>
              </CardContent>
            </Card>

            {/* Contacts List */}
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-foreground">Contact Submissions ({pagination.total})</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
                    <span className="ml-2 text-muted-foreground">Loading contacts...</span>
                  </div>
                ) : contacts.length === 0 ? (
                  <div className="text-center py-8">
                    <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No contacts found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {contacts.map((contact) => (
                      <div
                        key={contact._id}
                        className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-foreground">{contact.name}</h3>
                              <Badge className={getStatusColor(contact.status)}>
                                {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground mb-2">
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                {contact.email}
                              </div>
                              {contact.phone && (
                                <div className="flex items-center gap-2">
                                  <Phone className="w-4 h-4" />
                                  {contact.phone}
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {format(new Date(contact.createdAt), "MMM dd, yyyy 'at' HH:mm")}
                              </div>
                            </div>
                            <p className="font-medium text-foreground mb-1">{contact.subject}</p>
                            <p className="text-muted-foreground text-sm line-clamp-2">
                              {contact.message.length > 100
                                ? `${contact.message.substring(0, 100)}...`
                                : contact.message}
                            </p>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Dialog
                              open={isDialogOpen && selectedContact?._id === contact._id}
                              onOpenChange={setIsDialogOpen}
                            >
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedContact(contact)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl dark:bg-card">
                                <DialogHeader>
                                  <DialogTitle className="text-foreground">Contact Details</DialogTitle>
                                </DialogHeader>
                                {selectedContact && (
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <Label className="text-sm font-medium text-foreground">Name</Label>
                                        <p className="text-sm text-muted-foreground mt-1">{selectedContact.name}</p>
                                      </div>
                                      <div>
                                        <Label className="text-sm font-medium text-foreground">Email</Label>
                                        <p className="text-sm text-muted-foreground mt-1">{selectedContact.email}</p>
                                      </div>
                                      {selectedContact.phone && (
                                        <div>
                                          <Label className="text-sm font-medium text-foreground">Phone</Label>
                                          <p className="text-sm text-muted-foreground mt-1">{selectedContact.phone}</p>
                                        </div>
                                      )}
                                      <div>
                                        <Label className="text-sm font-medium text-foreground">Status</Label>
                                        <Select
                                          value={selectedContact.status}
                                          onValueChange={(value) =>
                                            updateContactStatus(selectedContact._id, value)
                                          }
                                        >
                                          <SelectTrigger className="w-full mt-1">
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="new">New</SelectItem>
                                            <SelectItem value="read">Read</SelectItem>
                                            <SelectItem value="replied">Replied</SelectItem>
                                            <SelectItem value="resolved">Resolved</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium text-foreground">Subject</Label>
                                      <p className="text-sm text-muted-foreground mt-1">{selectedContact.subject}</p>
                                    </div>
                                    <div>
                                      <Label className="text-sm font-medium text-foreground">Message</Label>
                                      <Textarea
                                        value={selectedContact.message}
                                        readOnly
                                        className="mt-1 min-h-32 dark:bg-input dark:text-foreground"
                                      />
                                    </div>
                                    <div className="flex justify-between items-center pt-4 border-t border-border">
                                      <div className="text-sm text-muted-foreground">
                                        Submitted:{" "}
                                        {format(
                                          new Date(selectedContact.createdAt),
                                          "MMM dd, yyyy 'at' HH:mm"
                                        )}
                                      </div>
                                      <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => deleteContact(selectedContact._id)}
                                      >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-6">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pagination.page === 1}
                      onClick={() => handlePageChange(pagination.page - 1)}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {pagination.page} of {pagination.pages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pagination.page === pagination.pages}
                      onClick={() => handlePageChange(pagination.page + 1)}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}