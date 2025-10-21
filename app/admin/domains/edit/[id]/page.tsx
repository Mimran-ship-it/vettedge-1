"use client"
import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import axios from "axios"
import { X, Upload, Replace, Trash2 } from "lucide-react"

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
  | "authorityLinksCount"
  | "score"

export default function EditDomainPage() {
  const router = useRouter()
  const params = useParams()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [uploadMode, setUploadMode] = useState<"add" | "replace">("add")
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    Actualprice: "",
    registrar: "",
    type: "aged",
    tags: "",
    isAvailable: true,
    isHot: false,
    isSold: false, // Added isSold field
    metrics: {
      domainRank: "",
      referringDomains: "",
      authorityLinks: "",
      authorityLinksCount: "",
      avgAuthorityDR: "",
      domainAuthority: "",
      score: "",
      trustFlow: "",
      citationFlow: "",
      monthlyTraffic: "",
      year: "",
      age: "",
      language: "English",
    },
  })

  useEffect(() => {
    const fetchDomain = async () => {
      try {
        const res = await fetch(`/api/domains/${params?.id}`)
        if (!res.ok) throw new Error()
        const data = await res.json()
        setFormData({
          name: data.name || "",
          description: data.description || "",
          price: data.price?.toString() || "",
          Actualprice: data.Actualprice?.toString() || "",
          registrar: data.registrar || "",
          type: data.type || "aged",
          tags: data.tags?.join(", ") || "",
          isAvailable: data.isAvailable ?? true,
          isHot: data.isHot ?? false,
          isSold: data.isSold ?? false, // Added isSold field
          metrics: {
            domainRank: data.metrics?.domainRank?.toString() || "",
            referringDomains: data.metrics?.referringDomains?.toString() || "",
            authorityLinks: data.metrics?.authorityLinks?.join(", ") || "",
            authorityLinksCount: data.metrics?.authorityLinksCount?.toString() || "",
            avgAuthorityDR: data.metrics?.avgAuthorityDR?.toString() || "",
            domainAuthority: data.metrics?.domainAuthority?.toString() || "",
            score: data.metrics?.score?.toString() || "",
            trustFlow: data.metrics?.trustFlow?.toString() || "",
            citationFlow: data.metrics?.citationFlow?.toString() || "",
            monthlyTraffic: data.metrics?.monthlyTraffic?.toString() || "",
            year: data.metrics?.year?.toString() || "",
            age: data.metrics?.age?.toString() || "",
            language: data.metrics?.language || "English",
          },
        })
        // Initialize images state with the domain's images
        setImages(data.image || [])
      } catch {
        toast({ title: "Error", description: "Failed to fetch domain", variant: "destructive" })
      }
    }
    fetchDomain()
  }, [params?.id, toast])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files?.length) return
    
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
    
    if (uploadMode === "replace") {
      setImages(uploaded)
      toast({
        title: "Images Replaced",
        description: "All images have been replaced with new uploads",
      })
    } else {
      setImages((prev) => [...prev, ...uploaded])
      toast({
        title: "Images Added",
        description: "New images have been added to existing ones",
      })
    }
    
    setImageUploading(false)
    // Reset the file input
    e.target.value = ""
  }

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== index))
    toast({
      title: "Image Removed",
      description: "Image has been removed from the domain",
    })
  }

  const handleClearAllImages = () => {
    setImages([])
    toast({
      title: "All Images Removed",
      description: "All images have been removed from the domain",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Create a copy of form data to include images
      const updatedData = {
        ...formData,
        // Include the images array in the payload
        image: images, // Changed from 'images' to 'image' to match backend field name
        price: parseFloat(formData.price),
        Actualprice: formData.Actualprice === "" ? null : parseFloat(formData.Actualprice),
        tags: formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
        metrics: {
          domainRank: parseInt(formData.metrics.domainRank),
          referringDomains: parseInt(formData.metrics.referringDomains),
          authorityLinks: formData.metrics.authorityLinks
            .split(",")
            .map((link) => link.trim())
            .filter(Boolean),
          authorityLinksCount: parseInt(formData.metrics.authorityLinksCount) || 0,
          avgAuthorityDR: parseInt(formData.metrics.avgAuthorityDR),
          domainAuthority: parseInt(formData.metrics.domainAuthority),
          score: parseInt(formData.metrics.score),
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
      
      console.log("Submitting data:", updatedData) // For debugging
      
      const res = await fetch(`/api/domains/${params?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      })
      
      if (res.ok) {
        toast({ title: "Success", description: "Domain updated successfully" })
        router.push("/admin/domains")
      } else {
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to update domain")
      }
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message || "Failed to update domain",
        variant: "destructive" 
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
                <h2 className="text-3xl font-bold tracking-tight">Edit Domain</h2>
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
                      <InputGroup label="Actual Price ($)" id="Actualprice" type="number" value={formData.Actualprice} onChange={(v) => setFormData({ ...formData, Actualprice: v })}  />
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
                    <div className="flex items-center space-x-2">
                      <Switch checked={formData.isSold} onCheckedChange={(val) => setFormData({ ...formData, isSold: val })} />
                      <Label>Is Sold</Label>
                    </div>
                    
                    {/* === Image Upload Section === */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Domain Images</Label>
                        
                        {/* Upload Mode Selector */}
                        <div className="flex space-x-2 mb-2">
                          <Button
                            type="button"
                            variant={uploadMode === "add" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setUploadMode("add")}
                            className="flex items-center"
                          >
                            <Upload className="h-4 w-4 mr-1" />
                            Add Images
                          </Button>
                          <Button
                            type="button"
                            variant={uploadMode === "replace" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setUploadMode("replace")}
                            className="flex items-center"
                          >
                            <Replace className="h-4 w-4 mr-1" />
                            Replace All
                          </Button>
                        </div>
                        
                        {/* File Input */}
                        <Input
                          multiple
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={imageUploading}
                        />
                        
                        {imageUploading && (
                          <p className="text-sm text-muted-foreground">Uploading images...</p>
                        )}
                        
                        {/* Image Previews */}
                        {images.length > 0 && (
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">Current Images ({images.length})</span>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleClearAllImages}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Clear All
                              </Button>
                            </div>
                            
                            <div className="flex flex-wrap gap-2">
                              {images.map((img, i) => (
                                <div key={i} className="relative group">
                                  <img
                                    src={img}
                                    alt={`Domain image ${i + 1}`}
                                    className="w-20 h-20 object-cover border rounded-md"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveImage(i)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                                    title="Remove Image"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {images.length === 0 && (
                          <p className="text-sm text-muted-foreground">No images uploaded yet</p>
                        )}
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
                       // ["Authority DR", "avgAuthorityDR"],
                        ["Referring Domains", "referringDomains"],
                        ["Domain Authority", "domainAuthority"], 
                        ["Overall Score", "score"],
                        ["Trust Flow", "trustFlow"],
                        ["Citation Flow", "citationFlow"],
                        ["Authority Links Count", "authorityLinksCount"],
                        ["Monthly Traffic", "monthlyTraffic"],
                        ["Registration Year", "year"],
                        ["Age", "age"],
                      ].map(([label, key]) => (
                        <InputGroup
                          required={key !== "authorityLinksCount"}
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
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Update Domain
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