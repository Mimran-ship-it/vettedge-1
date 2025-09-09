"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import axios from "axios"
import { X } from "lucide-react"


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

type MetricKey =
  | "domainRank"
  | "referringDomains"
  | "avgAuthorityDR"
  | "domainAuthority"
  | "trustFlow"
  | "citationFlow"
  | "monthlyTraffic"
  | "year"
  | "age"

export default function NewDomainPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [loading, setLoading] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)
  const [images, setImages] = useState<string[]>([])

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    Actualprice:"",
    registrar: "",
    type: "aged",
    tags: "",
    image: images,
    isAvailable: true,
    isHot: false,
    metrics: {
      domainRank: "",
      referringDomains: "",
      authorityLinks: "",
      avgAuthorityDR: "",
      domainAuthority: "",
      trustFlow: "",
      citationFlow: "",
      monthlyTraffic: "",
      year: "",
      age: "",
      language: "English",
    },
  })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setImageUploading(true)
    const uploaded: string[] = []

    for (const file of Array.from(files)) {
      const data = new FormData()
      data.append("file", file)
      data.append("upload_preset", "domain")
      data.append("folder", "domains")

      try {
        const res = await axios.post("https://api.cloudinary.com/v1_1/dcday5wio/upload", data)
        uploaded.push(res.data.secure_url)
      } catch {
        toast({
          title: "Upload failed",
          description: "Could not upload image to Cloudinary",
          variant: "destructive",
        })
      }
    }

    setImages((prev) => [...prev, ...uploaded])
    setImageUploading(false)
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
  
    try {
      const domainData = {
        ...formData,
        images,
        price: parseFloat(formData.price),
        Actualprice: parseFloat(formData.Actualprice),
        tags: formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
        isSold: false,
        metrics: {
          domainRank: parseInt(formData.metrics.domainRank),
          referringDomains: parseInt(formData.metrics.referringDomains),
          authorityLinks: formData.metrics.authorityLinks
            .split(",")
            .map((link) => link.trim())
            .filter(Boolean),
          avgAuthorityDR: parseInt(formData.metrics.avgAuthorityDR),
          domainAuthority: parseInt(formData.metrics.domainAuthority),
          trustFlow: parseInt(formData.metrics.trustFlow),
          citationFlow: parseInt(formData.metrics.citationFlow),
          monthlyTraffic:
            formData.type === "aged"
              ? null
              : parseInt(formData.metrics.monthlyTraffic),
          year: parseInt(formData.metrics.year),
          age: parseInt(formData.metrics.age),
          language: formData.metrics.language,
        },
      }
  
      const response = await fetch("/api/domains", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(domainData),
      })
  
      if (response.ok) {
        toast({ title: "Success", description: "Domain created successfully" })
  
        // 🔔 Notify all users
       const check= await fetch("/api/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ domain: domainData }), 
        })
  console.log('check',check)
        router.push("/admin/domains")
      } else throw new Error()
    } catch {
      toast({
        title: "Error",
        description: "Failed to create domain",
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
                {/* === Basic Info === */}
                <Card>
                  <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <InputGroup label="Domain Name *" id="name" value={formData.name} onChange={(v) => setFormData({ ...formData, name: v })} required />
                    <TextareaGroup label="Description *" id="description" value={formData.description} onChange={(v) => setFormData({ ...formData, description: v })} required />

                    <div className="grid grid-cols-2 gap-4">
                      <InputGroup label="Price ($) *" id="price" type="number" value={formData.price} onChange={(v) => setFormData({ ...formData, price: v })} required />
                      <InputGroup label="Actual Price ($) *" id="Actualprice" type="number" value={formData.Actualprice} onChange={(v) => setFormData({ ...formData, Actualprice: v })} required />
                      <InputGroup label="Registrar *" id="registrar" value={formData.registrar} onChange={(v) => setFormData({ ...formData, registrar: v })} required />
                    </div>

                    <div className="space-y-2">
                      <Label>Domain Type *</Label>
                      <Select value={formData.type} onValueChange={(val) => setFormData({ ...formData, type: val })}>
                        <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="aged">Aged Domain</SelectItem>
                          <SelectItem value="traffic">Traffic Domain</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <InputGroup label="Tags (comma separated)" id="tags" value={formData.tags} onChange={(v) => setFormData({ ...formData, tags: v })} />

                    <div className="flex items-center space-x-2">
                      <Switch checked={formData.isAvailable} onCheckedChange={(val) => setFormData({ ...formData, isAvailable: val })} />
                      <Label>Available for purchase</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch checked={formData.isHot} onCheckedChange={(val) => setFormData({ ...formData, isHot: val })} />
                      <Label>Is Hot deal</Label>
                    </div>

                    <div className="space-y-2">
                      <Label>Upload Images</Label>
                      <Input multiple type="file" accept="image/*" onChange={handleImageUpload} />
                      {imageUploading && <p className="text-sm text-muted-foreground">Uploading...</p>}
                      <div className="flex flex-wrap gap-2">
  {images.map((img, i) => (
    <div key={i} className="relative group">
      <img
        src={img}
        alt={`Uploaded ${i}`}
        className="w-20 h-20 object-cover border rounded-md"
      />
      <button
        type="button"
        onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
        title="Remove Image"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  ))}
</div>

                    </div>
                  </CardContent>
                </Card>

                {/* === SEO Metrics === */}
                <Card>
                  <CardHeader><CardTitle>SEO Metrics</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        ["Domain Rank", "domainRank"],
                        ["Authority DR", "avgAuthorityDR"],
                        ["Referring Domains", "referringDomains"],
                        ["Overall Score", "domainAuthority"],
                        ["Trust Flow", "trustFlow"],
                        ["Citation Flow", "citationFlow"],
                        ["Monthly Traffic", "monthlyTraffic"],
                        ["Registration Year", "year"],
                        ["Age", "age"],
                      ].map(([label, key]) => (
                        <InputGroup
                          required
                          key={key}
                          label={label}
                          id={key}
                          type="number"
                          value={formData.metrics[key as MetricKey]}
                          onChange={(v) => setFormData({
                            ...formData,
                            metrics: { ...formData.metrics, [key as MetricKey]: v },
                          })}
                          disabled={formData.type === "aged" && key === "monthlyTraffic"}
                        />
                      ))}
                    </div>

                    <TextareaGroup
                      label="Authority Links (comma separated)"
                      id="authorityLinks"
                      value={formData.metrics.authorityLinks}
                      onChange={(v) =>
                        setFormData({
                          ...formData,
                          metrics: { ...formData.metrics, authorityLinks: v },
                        })
                      }
                    />

                    <div className="space-y-2">
                      <Label>Language</Label>
                      <Select value={formData.metrics.language} onValueChange={(val) =>
                        setFormData({
                          ...formData,
                          metrics: { ...formData.metrics, language: val },
                        })
                      }>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {["English", "Spanish", "French", "German", "Other"].map((lang) => (
                            <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                          ))}
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

// Reusable Components
const InputGroup = ({
  label,
  id,
  value,
  onChange,
  type = "text",
  required = false,
  disabled = false,
}: {
  label: string
  id: string
  value: string
  onChange: (val: string) => void
  type?: string
  required?: boolean
  disabled?: boolean
}) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <Input
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      type={type}
      required={required}
      disabled={disabled}
    />
  </div>
)

const TextareaGroup = ({
  label,
  id,
  value,
  onChange,
  required = false,
}: {
  label: string
  id: string
  value: string
  onChange: (val: string) => void
  required?: boolean
}) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <Textarea
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={3}
      required={required}
    />
  </div>
)
