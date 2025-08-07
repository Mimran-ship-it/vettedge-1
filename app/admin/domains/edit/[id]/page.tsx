"use client"

import React, { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import axios from "axios"

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
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Save } from "lucide-react"

const EditDomainPage = () => {
    const params = useParams()
    const id = params?.id as string
    console.log('id is',id)
  const router = useRouter()
  const { toast } = useToast()

  const [loading, setLoading] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)

  const [formData, setFormData] = useState<any | null>(null)

  useEffect(() => {
    const fetchDomain = async () => {
      try {
        const res = await fetch(`/api/domains/${id}`)
        const data = await res.json()
        setFormData({
            ...data,
            price: data.price.toString(),
            tags: data.tags.join(", "),
            images: data.image || [], // ← Add this
            isHot: data.isHot ?? false, 
            metrics: {
              ...data.metrics,
              domainRank: data.metrics.domainRank?.toString() || "",
              referringDomains: data.metrics.referringDomains?.toString() || "",
              authorityLinks: data.metrics.authorityLinks?.toString() || "",
              avgAuthorityDR: data.metrics.avgAuthorityDR?.toString() || "",
              domainAuthority: data.metrics.domainAuthority?.toString() || "",
              trustFlow: data.metrics.trustFlow?.toString() || "",
              citationFlow: data.metrics.citationFlow?.toString() || "",
              monthlyTraffic: data.metrics.monthlyTraffic?.toString() || "",
              year: data.metrics.year?.toString() || "",
              age: data.metrics.age?.toString() || "",
            },
          })
          
      } catch {
        toast({
          title: "Error",
          description: "Failed to fetch domain data"
        })
      }
    }

    if (id) fetchDomain()
  }, [id])

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
      } catch (err) {
        toast({
          title: "Upload failed",
          description: "Could not upload image to Cloudinary",
          variant: "destructive",
        })
      }
    }
  
    // Update only formData.images
    setFormData((prev: any) => ({
      ...prev,
      image: [...(prev.image || []), ...uploaded],
    }))
  
    setImageUploading(false)
  }
  
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
        const domainData = {
            ...formData, // ✅ formData already has the images array
            price: parseFloat(formData.price),
            tags: formData.tags.split(",").map((tag: string) => tag.trim()).filter(Boolean),
            metrics: Object.fromEntries(
                Object.entries(formData.metrics).map(([key, val]) => [
                  key,
                  isNaN(Number(val as string)) ? val : parseInt(val as string)
                ])
              ),
              
          }

      const response = await fetch(`/api/domains/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(domainData),
      })

      if (response.ok) {
        toast({ title: "Success", description: "Domain updated successfully" })
        router.push("/admin")
      } else throw new Error()
    } catch {
      toast({ title: "Error", description: "Failed to update domain", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  if (!formData)
    return (
      <div className="p-8 space-y-4">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-64 w-full" />
      </div>
    )

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
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Domains
                  </Link>
                </Button>
                <h2 className="text-3xl font-bold tracking-tight">Edit Domain</h2>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Basic Info */}
                <Card>
                  <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <InputGroup label="Domain Name *" id="name" value={formData.name} onChange={(v) => setFormData({ ...formData, name: v })} required />
                    <TextareaGroup label="Description *" id="description" value={formData.description} onChange={(v) => setFormData({ ...formData, description: v })} required />
                    <div className="grid grid-cols-2 gap-4">
                      <InputGroup label="Price ($) *" id="price" type="number" value={formData.price} onChange={(v) => setFormData({ ...formData, price: v })} required />
                      <div className="space-y-2">
                        <Label htmlFor="tld">TLD *</Label>
                        <Select value={formData.tld} onValueChange={(val) => setFormData({ ...formData, tld: val })}>
                          <SelectTrigger><SelectValue placeholder="Select TLD" /></SelectTrigger>
                          <SelectContent>
                            {[".com", ".net", ".org", ".io", ".co", ".ai"].map((tld) => (
                              <SelectItem key={tld} value={tld}>{tld}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
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
                      <Label>is Hot deal</Label>
                    </div>
                    <div className="space-y-2">
                      <Label>Upload Images</Label>
                      <Input multiple type="file" accept="image/*" onChange={handleImageUpload} />
                      {imageUploading && <p className="text-sm text-muted-foreground">Uploading...</p>}
                      <div className="flex flex-wrap gap-2">
  {formData.image?.map((img: string, i: number) => (
    <div key={i} className="relative">
      <img src={img} alt={`Uploaded ${i}`} className="w-20 h-20 object-cover border rounded-md" />
      <button
        type="button"
        onClick={() =>
            setFormData((prev: any) => ({
              ...prev,
              image: prev.image.filter((_: string, index: number) => index !== i),
            }))
          }
          
        className="absolute top-0 right-0 bg-black bg-opacity-60 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
      >
        ×
      </button>
    </div>
  ))}
</div>

                    </div>
                  </CardContent>
                </Card>

                {/* SEO Metrics */}
                <Card>
                  <CardHeader><CardTitle>SEO Metrics</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {["domainRank", "avgAuthorityDR", "referringDomains", "authorityLinks", "domainAuthority", "trustFlow", "citationFlow", "monthlyTraffic", "year", "age"].map((key) => (
                        <InputGroup
                          key={key}
                          label={key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                          id={key}
                          type="number"
                          value={formData.metrics[key]}
                          onChange={(v) => setFormData({ ...formData, metrics: { ...formData.metrics, [key]: v } })}
                          required
                        />
                      ))}
                    </div>
                    <div className="space-y-2">
                      <Label>Language</Label>
                      <Select value={formData.metrics.language} onValueChange={(val) => setFormData({ ...formData, metrics: { ...formData.metrics, language: val } })}>
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
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div> Updating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" /> Update Domain
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
const InputGroup = ({ label, id, value, onChange, type = "text", required = false }: { label: string; id: string; value: string; onChange: (val: string) => void; type?: string; required?: boolean }) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <Input id={id} value={value} onChange={(e) => onChange(e.target.value)} type={type} required={required} />
  </div>
)

const TextareaGroup = ({ label, id, value, onChange, required = false }: { label: string; id: string; value: string; onChange: (val: string) => void; required?: boolean }) => (
  <div className="space-y-2">
    <Label htmlFor={id}>{label}</Label>
    <Textarea id={id} value={value} onChange={(e) => onChange(e.target.value)} rows={4} required={required} />
  </div>
)

export default EditDomainPage
