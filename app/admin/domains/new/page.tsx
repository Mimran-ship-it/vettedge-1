"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

export default function NewDomainPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    isAvailable: true,
    tld: "",
    category: "",
    tags: "",
    featured: false,
    metrics: {
      domainRank: "",
      referringDomains: "",
      authorityLinks: "",
      avgAuthorityDR: "",
      monthlyTraffic: "",
      year: "",
      language: "",
    },
  })

  const uploadToCloudinary = async () => {
    if (!imageFile) return ""

    const data = new FormData()
    data.append("file", imageFile)
    data.append("upload_preset", "YOUR_UPLOAD_PRESET") // ← change this
    const res = await fetch("https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload", {
      method: "POST",
      body: data,
    })

    const result = await res.json()
    return result.secure_url || ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const imageUrl = await uploadToCloudinary()

      const domainData = {
        ...formData,
        price: Number(formData.price),
        imageUrl,
        tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
        isSold: false,
        metrics: {
          domainRank: Number(formData.metrics.domainRank),
          referringDomains: Number(formData.metrics.referringDomains),
          authorityLinks: Number(formData.metrics.authorityLinks),
          avgAuthorityDR: Number(formData.metrics.avgAuthorityDR),
          monthlyTraffic: Number(formData.metrics.monthlyTraffic),
          year: Number(formData.metrics.year),
          language: formData.metrics.language,
        },
      }

      const res = await fetch("/api/domains", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(domainData),
      })

      if (!res.ok) throw new Error("Failed to create domain")

      toast({ title: "Success", description: "Domain created successfully" })
      router.push("/admin/domains")
    } catch (err) {
      toast({ title: "Error", description: "Failed to create domain", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    if (name in formData.metrics) {
      setFormData((prev) => ({
        ...prev,
        metrics: { ...prev.metrics, [name]: value },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label>Price</Label>
            <Input name="price" value={formData.price} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label>TLD</Label>
            <Input name="tld" value={formData.tld} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Input name="category" value={formData.category} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label>Tags (comma separated)</Label>
            <Input name="tags" value={formData.tags} onChange={handleChange} />
          </div>
          <div className="flex items-center space-x-2">
            <Input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} />
            <Label>Featured</Label>
          </div>
          <div className="space-y-2">
            <Label>Thumbnail Image</Label>
            <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} />
            {imageFile && (
              <img
                src={URL.createObjectURL(imageFile)}
                alt="Preview"
                className="w-40 h-40 object-cover rounded border"
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Domain Metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            "domainRank",
            "referringDomains",
            "authorityLinks",
            "avgAuthorityDR",
            "monthlyTraffic",
            "year",
          ].map((key) => (
            <div key={key} className="space-y-2">
              <Label>{key}</Label>
              <Input name={key} value={(formData.metrics as any)[key]} onChange={handleChange} />
            </div>
          ))}
          <div className="space-y-2">
            <Label>Language</Label>
            <Input name="language" value={formData.metrics.language} onChange={handleChange} />
          </div>
        </CardContent>
      </Card>

      <div className="md:col-span-2 flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Create Domain"}
        </Button>
      </div>
    </form>
  )
}
