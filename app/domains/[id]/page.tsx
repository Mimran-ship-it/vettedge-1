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
  Globe,
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

        if (matchedDomain) {
          setDomain(matchedDomain)
        } else {
          setDomain(null)
        }
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

    addItem({
      id: domain._id,
      name: domain.name,
      price: domain.price,
      domain: domain,
    })

    toast({
      title: "Added to Cart",
      description: `${domain.name} has been added to your cart.`,
    })
  }

  const handleWishlistToggle = () => {
    if (!domain) return

    if (isInWishlist(domain._id)) {
      removeFromWishlist(domain._id)
      toast({
        title: "Removed from Wishlist",
        description: `${domain.name} has been removed from your wishlist.`,
      })
    } else {
      addToWishlist(domain)
      toast({
        title: "Added to Wishlist",
        description: `${domain.name} has been added to your wishlist.`,
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
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
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Domain Not Found</h1>
            <p className="text-gray-600 mb-8">The domain you're looking for doesn't exist or has been removed.</p>
            <Button asChild>
              <a href="/domains">Browse All Domains</a>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <a href="/" className="hover:text-gray-700">Home</a>
          <span>/</span>
          <a href="/domains" className="hover:text-gray-700">Domains</a>
          <span>/</span>
          <span className="text-gray-900">{domain.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column */}
          <div className="space-y-8">
            <div className={cn("relative p-8 rounded-2xl border-2 bg-white", domain.isSold && "opacity-60")}>
              {domain.isSold && (
                <div className="absolute inset-0 bg-black/20 z-10 flex items-center justify-center rounded-2xl">
                  <Badge variant="destructive" className="text-xl px-6 py-3">SOLD</Badge>
                </div>
              )}

              <div className="text-center space-y-4">
                <Image
                  src={domain.image?.[0] || "/placeholder.png"}
                  alt={domain.name}
                  width={600}
                  height={350}
                  className="rounded-xl mx-auto object-cover"
                />
                <h1 className="text-3xl font-bold text-gray-900">{domain.name}</h1>
                <Badge variant="secondary" className="text-sm px-3 py-1">{domain.tld} Domain</Badge>
                <p className="text-gray-600 leading-relaxed">{domain.description}</p>
              </div>
            </div>

            {/* SEO Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5" />
                  <span>SEO Metrics & Analytics</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <Metric label="Domain Rank" value={domain.metrics.domainRank} icon={<TrendingUp />} />
                  <Metric label="Referring Domains" value={domain.metrics.referringDomains} icon={<LinkIcon />} />
                  <Metric label="Monthly Visitors" value={domain.metrics.monthlyTraffic.toLocaleString()} icon={<Users />} />
                  <Metric label="Authority Score" value={domain.metrics.avgAuthorityDR} icon={<Star />} />
                </div>
              </CardContent>
            </Card>

            {/* Tabs for Additional Info */}
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <InfoRow label="Domain Age" value={`${domain.metrics.age} years`} />
                    <InfoRow label="Authority Links" value={domain.metrics.authorityLinks ?? "N/A"} />
                    <InfoRow label="Language" value={domain.metrics.language} />
                    <InfoRow label="Registration Year" value={domain.metrics.year} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <HistoryItem label="Domain Registered" value={domain.metrics.year} color="green" />
                    <HistoryItem label="Peak Traffic Period" value="2020-2023" color="blue" />
                    <HistoryItem label="Domain Expired" value="Recently Available" color="purple" />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analysis" className="space-y-4">
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <AnalysisRow label="SEO Potential" value="Excellent" percent={80} color="green" />
                    <AnalysisRow label="Brand Value" value="High" percent={75} color="blue" />
                    <AnalysisRow label="Investment Score" value="Premium" percent={85} color="purple" />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <Card className="sticky top-12">
              <CardHeader>
                <CardTitle className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-2">${domain.price.toLocaleString()}</div>
                  <Badge variant={domain.isAvailable ? "default" : "secondary"}>
                    {domain.isAvailable ? "Available Now" : "Unavailable"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Button className="w-full" onClick={handleAddToCart} disabled={domain.isSold || !domain.isAvailable}>
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleWishlistToggle}
                    className={cn(isInWishlist(domain._id) && "text-red-500 border-red-200")}
                  >
                    <Heart className={cn("h-4 w-4 mr-2", isInWishlist(domain._id) && "fill-current")} />
                    {isInWishlist(domain._id) ? "Saved" : "Save"}
                  </Button>
                </div>

                <Separator />

                <div className="space-y-3 text-sm">
                  <TrustItem icon={<Shield />} text="Secure transfer guaranteed" color="green" />
                  <TrustItem icon={<Calendar />} text="Transfer within 24-48 hours" color="blue" />
                  <TrustItem icon={<Search />} text="Full SEO history included" color="purple" />
                </div>

                <Separator />

                <div className="text-center text-xs text-gray-500">
                  Price includes domain transfer, SSL certificate, and 1-year registration renewal.
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
      <LiveChat />
    </div>
  )
}

const Metric = ({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) => (
  <div className="text-center p-4 bg-gray-100 rounded-lg">
    <div className="h-8 w-8 mx-auto text-gray-700 mb-2">{icon}</div>
    <div className="text-2xl font-bold text-gray-900">{value}</div>
    <div className="text-sm text-gray-600">{label}</div>
  </div>
)

const InfoRow = ({ label, value }: { label: string; value: string | number }) => (
  <div className="flex justify-between">
    <span className="text-gray-600">{label}</span>
    <span className="font-medium">{value}</span>
  </div>
)

const HistoryItem = ({ label, value, color }: { label: string; value: string | number; color: string }) => (
  <div className="flex items-center space-x-3">
    <div className={`w-2 h-2 rounded-full bg-${color}-500`}></div>
    <div>
      <div className="font-medium">{label}</div>
      <div className="text-sm text-gray-600">{value}</div>
    </div>
  </div>
)

const AnalysisRow = ({ label, value, percent, color }: { label: string; value: string; percent: number; color: string }) => (
  <div className="flex items-center justify-between">
    <span className="text-gray-600">{label}</span>
    <div className="flex items-center space-x-2">
      <div className="w-24 h-2 bg-gray-200 rounded-full">
        <div className={`h-2 rounded-full bg-${color}-500`} style={{ width: `${percent}%` }}></div>
      </div>
      <span className="text-sm font-medium">{value}</span>
    </div>
  </div>
)

const TrustItem = ({ icon, text, color }: { icon: React.ReactNode; text: string; color: string }) => (
  <div className={`flex items-center space-x-2 text-${color}-600`}>
    {icon}
    <span>{text}</span>
  </div>
)
