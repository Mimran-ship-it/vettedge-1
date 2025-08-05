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

export default function DomainDetailsPage() {
  const params = useParams()
  const [domain, setDomain] = useState<Domain | null>(null)
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { toast } = useToast()

  useEffect(() => {
    // Mock API call to fetch domain details
    const fetchDomain = async () => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockDomain: Domain = {
        id: params.id as string,
        name: "techstartup.com",
        description:
          "Perfect domain for technology startups and innovation companies. This premium domain has been carefully vetted and comes with an established backlink profile and proven SEO authority.",
        price: 2500,
        isAvailable: true,
        isSold: false,
        tld: ".com",
        metrics: {
          domainRank: 45,
          referringDomains: 1250,
          authorityLinks: 890,
          avgAuthorityDR: 65,
          monthlyTraffic: 15000,
          year: 2018,
          language: "English",
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      setDomain(mockDomain)
      setLoading(false)
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
      id: domain.id,
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

    if (isInWishlist(domain.id)) {
      removeFromWishlist(domain.id)
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
          <a href="/" className="hover:text-gray-700">
            Home
          </a>
          <span>/</span>
          <a href="/domains" className="hover:text-gray-700">
            Domains
          </a>
          <span>/</span>
          <span className="text-gray-900">{domain.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - Domain Info */}
          <div className="space-y-8">
            {/* Domain Header */}
            <div className={cn("relative p-8 rounded-2xl border-2 bg-white", domain.isSold && "opacity-60")}>
              {domain.isSold && (
                <div className="absolute inset-0 bg-black/20 z-10 flex items-center justify-center rounded-2xl">
                  <Badge variant="destructive" className="text-xl px-6 py-3">
                    SOLD
                  </Badge>
                </div>
              )}

              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto">
                  <Globe className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{domain.name}</h1>
                  <Badge variant="secondary" className="text-sm px-3 py-1">
                    {domain.tld} Domain
                  </Badge>
                </div>
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
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <TrendingUp className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{domain.metrics.domainRank}</div>
                    <div className="text-sm text-gray-600">Domain Rank</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <LinkIcon className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{domain.metrics.referringDomains}</div>
                    <div className="text-sm text-gray-600">Referring Domains</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Users className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">
                      {domain.metrics.monthlyTraffic.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Monthly Visitors</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <Star className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-gray-900">{domain.metrics.avgAuthorityDR}</div>
                    <div className="text-sm text-gray-600">Authority Score</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Details */}
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Domain Age</span>
                        <span className="font-medium">{new Date().getFullYear() - domain.metrics.year} years</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Authority Links</span>
                        <span className="font-medium">{domain.metrics.authorityLinks}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Language</span>
                        <span className="font-medium">{domain.metrics.language}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Registration Year</span>
                        <span className="font-medium">{domain.metrics.year}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history" className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div>
                          <div className="font-medium">Domain Registered</div>
                          <div className="text-sm text-gray-600">{domain.metrics.year}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div>
                          <div className="font-medium">Peak Traffic Period</div>
                          <div className="text-sm text-gray-600">2020-2023</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <div>
                          <div className="font-medium">Domain Expired</div>
                          <div className="text-sm text-gray-600">Recently Available</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analysis" className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">SEO Potential</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 h-2 bg-gray-200 rounded-full">
                            <div className="w-4/5 h-2 bg-green-500 rounded-full"></div>
                          </div>
                          <span className="text-sm font-medium">Excellent</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Brand Value</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 h-2 bg-gray-200 rounded-full">
                            <div className="w-3/4 h-2 bg-blue-500 rounded-full"></div>
                          </div>
                          <span className="text-sm font-medium">High</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Investment Score</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-24 h-2 bg-gray-200 rounded-full">
                            <div className="w-5/6 h-2 bg-purple-500 rounded-full"></div>
                          </div>
                          <span className="text-sm font-medium">Premium</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Purchase */}
          <div className="space-y-6">
            {/* Price & Purchase */}
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-2">${domain.price.toLocaleString()}</div>
                  <Badge variant={domain.isAvailable ? "default" : "secondary"} className="text-sm">
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
                    className={cn(isInWishlist(domain.id) && "text-red-500 border-red-200")}
                  >
                    <Heart className={cn("h-4 w-4 mr-2", isInWishlist(domain.id) && "fill-current")} />
                    {isInWishlist(domain.id) ? "Saved" : "Save"}
                  </Button>
                </div>

                <Separator />

                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2 text-green-600">
                    <Shield className="h-4 w-4" />
                    <span>Secure transfer guaranteed</span>
                  </div>
                  <div className="flex items-center space-x-2 text-blue-600">
                    <Calendar className="h-4 w-4" />
                    <span>Transfer within 24-48 hours</span>
                  </div>
                  <div className="flex items-center space-x-2 text-purple-600">
                    <Search className="h-4 w-4" />
                    <span>Full SEO history included</span>
                  </div>
                </div>

                <Separator />

                <div className="text-center text-xs text-gray-500">
                  Price includes domain transfer, SSL certificate, and 1-year registration renewal.
                </div>
              </CardContent>
            </Card>

            {/* Trust Indicators */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Why Choose This Domain?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <div className="font-medium text-sm">Established Authority</div>
                    <div className="text-xs text-gray-600">High domain authority with quality backlinks</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <div className="font-medium text-sm">Clean History</div>
                    <div className="text-xs text-gray-600">No spam or penalty history detected</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <div className="font-medium text-sm">SEO Ready</div>
                    <div className="text-xs text-gray-600">Optimized for search engine rankings</div>
                  </div>
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
