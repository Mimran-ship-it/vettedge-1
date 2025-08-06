"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

export default function NewDomainPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    tld: ".com",
    category: "",
    tags: "",
    isAvailable: true,
    featured: false,
    metrics: {
      domainRank: "",
      referringDomains: "",
      authorityLinks: "",
      avgAuthorityDR: "",
      monthlyTraffic: "",
      year: "",
      language: "English",
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const domainData = {
        ...formData,
        price: Number.parseFloat(formData.price),
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        isSold: false,
        metrics: {
          ...formData.metrics,
          domainRank: Number.parseInt(formData.metrics.domainRank),
          referringDomains: Number.parseInt(formData.metrics.referringDomains),
          authorityLinks: Number.parseInt(formData.metrics.authorityLinks),
          avgAuthorityDR: Number.parseInt(formData.metrics.avgAuthorityDR),
          monthlyTraffic: Number.parseInt(formData.metrics.monthlyTraffic),
          year: Number.parseInt(formData.metrics.year),
        },
      }

      const response = await fetch("/api/domains", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(domainData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Domain created successfully",
        })
        router.push("/admin/domains")
      } else {
        throw new Error("Failed to create domain")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create domain",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
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
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin/domains">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Domains
                  </Link>
                </Button>
                <h2 className="text-3xl font-bold tracking-tight">Add New Domain</h2>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Domain Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="example.com"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Describe the domain and its potential..."
                        rows={4}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Price ($) *</Label>
                        <Input
                          id="price"
                          type="number"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          placeholder="2500"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tld">TLD *</Label>
                        <Select
                          value={formData.tld}
                          onValueChange={(value) => setFormData({ ...formData, tld: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value=".com">.com</SelectItem>
                            <SelectItem value=".net">.net</SelectItem>
                            <SelectItem value=".org">.org</SelectItem>
                            <SelectItem value=".io">.io</SelectItem>
                            <SelectItem value=".co">.co</SelectItem>
                            <SelectItem value=".ai">.ai</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Input
                        id="category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        placeholder="Technology, Health, Finance, etc."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags (comma separated)</Label>
                      <Input
                        id="tags"
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        placeholder="startup, tech, business"
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isAvailable"
                        checked={formData.isAvailable}
                        onCheckedChange={(checked) => setFormData({ ...formData, isAvailable: checked })}
                      />
                      <Label htmlFor="isAvailable">Available for purchase</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="featured"
                        checked={formData.featured}
                        onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                      />
                      <Label htmlFor="featured">Featured domain</Label>
                    </div>
                  </CardContent>
                </Card>

                {/* SEO Metrics */}
                <Card>
                  <CardHeader>
                    <CardTitle>SEO Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="domainRank">Domain Rank</Label>
                        <Input
                          id="domainRank"
                          type="number"
                          value={formData.metrics.domainRank}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              metrics: { ...formData.metrics, domainRank: e.target.value },
                            })
                          }
                          placeholder="45"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="avgAuthorityDR">Authority DR</Label>
                        <Input
                          id="avgAuthorityDR"
                          type="number"
                          value={formData.metrics.avgAuthorityDR}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              metrics: { ...formData.metrics, avgAuthorityDR: e.target.value },
                            })
                          }
                          placeholder="65"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="referringDomains">Referring Domains</Label>
                        <Input
                          id="referringDomains"
                          type="number"
                          value={formData.metrics.referringDomains}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              metrics: { ...formData.metrics, referringDomains: e.target.value },
                            })
                          }
                          placeholder="1250"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="authorityLinks">Authority Links</Label>
                        <Input
                          id="authorityLinks"
                          type="number"
                          value={formData.metrics.authorityLinks}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              metrics: { ...formData.metrics, authorityLinks: e.target.value },
                            })
                          }
                          placeholder="890"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="monthlyTraffic">Monthly Traffic</Label>
                        <Input
                          id="monthlyTraffic"
                          type="number"
                          value={formData.metrics.monthlyTraffic}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              metrics: { ...formData.metrics, monthlyTraffic: e.target.value },
                            })
                          }
                          placeholder="15000"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="year">Registration Year</Label>
                        <Input
                          id="year"
                          type="number"
                          value={formData.metrics.year}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              metrics: { ...formData.metrics, year: e.target.value },
                            })
                          }
                          placeholder="2018"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select
                        value={formData.metrics.language}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            metrics: { ...formData.metrics, language: value },
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="Spanish">Spanish</SelectItem>
                          <SelectItem value="French">French</SelectItem>
                          <SelectItem value="German">German</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" asChild>
                  <Link href="/admin/domains">Cancel</Link>
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Create Domain
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
