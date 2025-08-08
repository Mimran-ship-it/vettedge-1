"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ShoppingCart,
  Heart,
  TrendingUp,
  LinkIcon,
  Calendar,
  BarChart3,
  Users,
  Search,
  Shield,
  Star,
} from "lucide-react"
import type { Domain } from "@/types/domain"
import { useCart } from "@/components/providers/cart-provider"
import { useWishlist } from "@/hooks/use-wishlist"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { LiveChat } from "@/components/chat/live-chat"
import Image from "next/image"

export default function DomainDetailsPage() {
  const params = useParams()
  const [domain, setDomain] = useState<Domain | null>(null)
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { toast } = useToast()

  useEffect(() => {
    const fetchDomain = async () => {
      try {
        const res = await fetch("/api/domains")
        const data: Domain[] = await res.json()
        const matchedDomain = data.find((d) => d._id === params.id)
        setDomain(matchedDomain || null)
      } catch (error) {
        console.error("Failed to fetch domain data:", error)
        setDomain(null)
      } finally {
        setLoading(false)
      }
    }
    fetchDomain()
  }, [params.id])

  const handleAddToCart = () => {
    if (!domain || domain.isSold || !domain.isAvailable) {
      toast({
        title: "Domain Unavailable",
        description: "This domain is no longer available for purchase.",
        variant: "destructive",
      })
      return
    }
    addItem({ id: domain._id, name: domain.name, price: domain.price, domain })
    toast({
      title: "Added to Cart",
      description: `${domain.name} has been added to your cart.`,
    })
  }

  const handleWishlistToggle = () => {
    if (!domain) return
    if (isInWishlist(domain._id)) {
      removeFromWishlist(domain._id)
      toast({ title: "Removed from Wishlist", description: `${domain.name} removed from wishlist.` })
    } else {
      addToWishlist(domain)
      toast({ title: "Added to Wishlist", description: `${domain.name} added to wishlist.` })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!domain) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Domain Not Found</h1>
          <p className="text-gray-600 mb-6">The domain you're looking for doesn't exist or has been removed.</p>
          <Button asChild><a href="/domains">Browse All Domains</a></Button>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <a href="/" className="hover:text-gray-700">Home</a>
          <span>/</span>
          <a href="/domains" className="hover:text-gray-700">Domains</a>
          <span>/</span>
          <span className="text-gray-900">{domain.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left */}
          <div className="space-y-8">
            <div className={cn("relative p-8 rounded-2xl border bg-white shadow-xl", domain.isSold && "opacity-60")}>
              {domain.isSold && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-2xl z-10">
                  <Badge variant="destructive" className="text-lg px-6 py-3">SOLD</Badge>
                </div>
              )}
              <Image src={domain.image?.[0] || "/placeholder.png"} alt={domain.name} width={700} height={400} className="rounded-xl mx-auto object-cover shadow-md" />
              <div className="text-center mt-4">
                <h1 className="text-3xl font-bold">{domain.name}</h1>
                <p className="text-sm text-gray-500">Registrar: {domain.registrar}</p>
                <p className="mt-2 text-gray-600">{domain.description}</p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {domain.tags?.map((tag) => (
                  <Badge key={tag} className="bg-blue-100 text-blue-700 hover:bg-blue-200">{tag}</Badge>
                ))}
              </div>
            </div>

            {/* Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><BarChart3 /> SEO Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-6">
                  <Metric label="Domain Rank" value={domain.metrics.domainRank} icon={<TrendingUp />} />
                  <Metric label="Referring Domains" value={domain.metrics.referringDomains} icon={<LinkIcon />} />
                  {domain.type === "traffic" && (
                    <Metric label="Monthly Traffic" value={domain.metrics.monthlyTraffic?.toLocaleString() || "N/A"} icon={<Users />} />
                  )}
                  <Metric label="Authority Score" value={domain.metrics.avgAuthorityDR} icon={<Star />} />
                  <Metric label="Trust Flow" value={domain.metrics.trustFlow} icon={<Shield />} />
                  <Metric label="Citation Flow" value={domain.metrics.citationFlow} icon={<Search />} />
                </div>
              </CardContent>
            </Card>

            {/* Authority Links */}
            {domain.metrics.authorityLinks?.length > 0 && (
            <Card>
            <CardHeader>
              <CardTitle>Authority Links</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {domain.metrics.authorityLinks?.map((link, idx) => {
                try {
                  const url = new URL(link.trim()) // trim extra spaces
                  return (
                    <a
                      key={idx}
                      href={url.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 rounded-full bg-gray-100 text-blue-600 hover:bg-blue-200 transition"
                    >
                      {url.hostname}
                    </a>
                  )
                } catch {
                  // If invalid URL, skip rendering it
                  return null
                }
              })}
            </CardContent>
          </Card>
          
            )}
          </div>

          {/* Right */}
          <div className="space-y-6">
            <div className="sticky top-12 bg-white/80 backdrop-blur-lg rounded-xl shadow-lg p-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">${domain.price.toLocaleString()}</div>
                <Badge variant={domain.isAvailable ? "default" : "secondary"}>
                  {domain.isAvailable ? "Available" : "Unavailable"}
                </Badge>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button className="w-full" onClick={handleAddToCart} disabled={!domain.isAvailable}><ShoppingCart className="h-4 w-4 mr-2" />Add to Cart</Button>
                <Button variant="outline" onClick={handleWishlistToggle} className={cn(isInWishlist(domain._id) && "text-red-500 border-red-300")}>
                  <Heart className={cn("h-4 w-4 mr-2", isInWishlist(domain._id) && "fill-current")} />
                  {isInWishlist(domain._id) ? "Saved" : "Save"}
                </Button>
              </div>
              <Separator className="my-4" />
              <div className="space-y-2 text-sm">
                <TrustItem icon={<Shield />} text="Secure transfer guaranteed" color="green" />
                <TrustItem icon={<Calendar />} text="Transfer within 24-48 hours" color="blue" />
                <TrustItem icon={<Search />} text="Full SEO history included" color="purple" />
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <LiveChat />
    </div>
  )
}

const Metric = ({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) => (
  <div className="text-center p-4 bg-gray-50 rounded-lg shadow hover:shadow-md transition">
    <div className="h-6 w-6 mx-auto mb-2 text-gray-700">{icon}</div>
    <div className="text-xl font-bold">{value}</div>
    <div className="text-xs text-gray-500">{label}</div>
  </div>
)

const TrustItem = ({ icon, text, color }: { icon: React.ReactNode; text: string; color: string }) => (
  <div className={`flex items-center gap-2 text-${color}-600`}>
    {icon}
    <span>{text}</span>
  </div>
)
