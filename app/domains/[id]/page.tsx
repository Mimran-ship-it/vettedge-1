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
  Clock,
  Globe,
  Award,
  CheckCircle,
  Zap,
  Tag,
  Info,
  ArrowRight,
  FileText,
  ExternalLink,
  ThumbsUp,
  Eye,
  Share,
} from "lucide-react"
import type { Domain } from "@/types/domain"
import { useCart } from "@/components/providers/cart-provider"
import { useWishlist } from "@/components/providers/wishlist-provider"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { LiveChat } from "@/components/chat/live-chat"
import Image from "next/image"
import Link from "next/link"

export default function DomainDetailsPage() {
  const params = useParams()
  const [domain, setDomain] = useState<Domain | null>(null)
  const [similarDomains, setSimilarDomains] = useState<Domain[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { addItem } = useCart()
  const { toast } = useToast()

  useEffect(() => {
    const fetchDomain = async () => {
      try {
        const res = await fetch("/api/domains")
        const data: Domain[] = await res.json()
        const matchedDomain = data.find((d) => d._id === params?.id)
        setDomain(matchedDomain || null)

        // Fetch similar domains if we have a domain with tags
        if (matchedDomain && matchedDomain.tags && matchedDomain.tags.length > 0) {
          // Filter similar domains by tags and exclude sold/unavailable domains
          const similar = data.filter(d =>
            d._id !== matchedDomain._id &&
            d.tags &&
            d.tags.some(tag => matchedDomain.tags?.includes(tag)) &&
            !d.isSold && // Exclude sold domains
            d.isAvailable // Include only available domains
          )
          setSimilarDomains(similar)
        }
      } catch (error) {
        console.error("Failed to fetch domain data:", error)
        setDomain(null)
      } finally {
        setLoading(false)
      }
    }
    fetchDomain()
  }, [params?.id])

  const handleAddToCart = () => {
    if (!domain || domain.isSold || !domain.isAvailable) {
      toast({
        title: "Domain Unavailable",
        description: "This domain is no longer available for purchase.",
        variant: "destructive",
      })
      return
    }
    addItem({ id: domain._id, name: domain.name, price: domain.price, domain, isSold: domain.isSold })
    toast({
      title: "Added to Cart",
      description: `${domain.name} has been added to your cart.`,
    })
  }

  const handleWishlistToggle = () => {
    if (!domain) return
    const wishlisted = isInWishlist(domain._id)
    if (wishlisted) {
      removeFromWishlist(domain._id)
      toast({
        title: "Removed",
        description: `${domain.name} removed from wishlist.`
      })
    } else {
      addToWishlist(domain._id)
      toast({
        title: "Wishlisted",
        description: `${domain.name} added to wishlist.`
      })
    }
  }

  const handleShare = async () => {
    if (!domain) return

    const url = window.location.href
    const title = `Check out this domain: ${domain.name}`

    // Check if Web Share API is available
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `I found this premium domain for sale: ${domain.name} at $${domain.price.toLocaleString()}`,
          url: url,
        })
        toast({
          title: "Shared successfully",
          description: "Domain details have been shared.",
        })
      } catch (error) {
        // User cancelled or error occurred
        if ((error as Error).name !== 'AbortError') {
          console.error('Error sharing:', error)
          toast({
            title: "Sharing failed",
            description: "Could not share the domain details.",
            variant: "destructive",
          })
        }
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(url)
        toast({
          title: "Link copied to clipboard",
          description: "You can now share the domain details link.",
        })
      } catch (error) {
        console.error('Error copying to clipboard:', error)
        toast({
          title: "Copy failed",
          description: "Could not copy the link to clipboard.",
          variant: "destructive",
        })
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Header />
        <main className="max-w-7xl mx-auto px-4 pb-8 pt-24 animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!domain) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Header />
        <main className="max-w-7xl mx-auto px-4 pb-8  pt-24 text-center">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
            <div className="text-red-500 mx-auto w-16 h-16 mb-4">
              <Info size={64} />
            </div>
            <h1 className="text-2xl font-bold mb-4 dark:text-white">Domain Not Found</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">The domain you're looking for doesn't exist or has been removed.</p>
            <Button asChild className="px-6 py-3">
              <a href="/domains">Browse All Domains</a>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const isWishlisted = isInWishlist(domain._id)
  const discountPercentage = domain.Actualprice > domain.price
    ? Math.round(((domain.Actualprice - domain.price) / domain.Actualprice) * 100)
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />
      <main className="max-w-7xl mx-auto px-2 sm:px-16 pb-8 pt-24">
        {/* Hero Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-1xl md:text-4xl font-bold text-gray-900 dark:text-white">{domain.name}</h1>
                {domain.isHot && (
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
                    <Zap className="h-3 w-3 mr-1" /> HOT
                  </Badge>
                )}
                {(domain as any).featured && (
                  <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-0">
                    <Star className="h-3 w-3 mr-1" /> FEATURED
                  </Badge>
                )}
                {domain.isSold && (
                  <Badge variant="destructive" className="text-white">
                    SOLD
                  </Badge>
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-300">Registered with {domain.registrar}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant={domain.isAvailable ? "default" : "secondary"} className="px-3 py-1">
                {domain.isAvailable ? "Available Now" : "Unavailable"}
              </Badge>
              <Badge variant="outline" className="px-3 py-1 dark:border-gray-600">
                {domain.type === "traffic" ? "High Traffic" : "Aged Domain"}
              </Badge>
            </div>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Image and Description */}
            <div className="lg:col-span-2 space-y-6">
              <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md">
                {domain.isSold && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10">
                    <Badge variant="destructive" className="text-lg px-6 py-3">SOLD</Badge>
                  </div>
                )}
                <Image
                  src={domain.image?.[0] || "/placeholder.png"}
                  alt={domain.name}
                  width={800}
                  height={400}
                  className="w-full bg-white h-64 md:h-80 object-cover"
                />
              </div>
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Domain Overview</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{domain.description}</p>
              </div>

              {/* Tabs for additional information */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full rounded-lg">
                <TabsList className="grid w-full grid-cols-3 bg-gray-100 dark:bg-gray-700">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white dark:data-[state=active]:bg-blue-600 dark:data-[state=active]:text-white">Overview</TabsTrigger>
                  <TabsTrigger  value="metrics" className="data-[state=active]:bg-green-600 data-[state=active]:text-white dark:data-[state=active]:bg-green-600 dark:data-[state=active]:text-white">SEO Metrics</TabsTrigger>
                  <TabsTrigger value="history" className="data-[stnpate=active]:bg-purple-600 data-[state=active]:text-white dark:data-[state=active]:bg-purple-600 dark:data-[state=active]:text-white">History</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-4 ">
                  <Card className="dark:bg-gray-700  rounded-lg dark:border-gray-600">
                    <CardHeader>
                      <CardTitle className="flex items-center mt-2  gap-2 dark:text-white"><Info className="h-5 w-5" /> Domain Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-600 rounded-lg">
                          <Globe className="h-5 w-5 text-blue-500" />
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-300">Domain Type</p>
                            <p className="font-medium dark:text-white">{domain.type === "traffic" ? "High Traffic Domain" : "Aged Domain"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-600 rounded-lg">
                          <Calendar className="h-5 w-5 text-green-500" />
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-300">Domain Age</p>
                            <p className="font-medium dark:text-white">{domain.metrics.age || 'N/A'} years</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-600 rounded-lg">
                          <Clock className="h-5 w-5 text-purple-500" />
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-300">Industry</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {domain.tags && domain.tags.length > 0 ? (
                                domain.tags.map((tag, index) => (
                                  <Badge
                                    key={index}
                                    variant="outline"
                                    className="px-2 py-1 text-xs dark:border-gray-500 dark:text-gray-200"
                                  >
                                    {tag}
                                  </Badge>
                                ))
                              ) : (
                                <p className="font-medium dark:text-white">N/A</p>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-600 rounded-lg">
                          <Users className="h-5 w-5 text-orange-500" />
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-300">Language</p>
                            <p className="font-medium dark:text-white">{domain.metrics.language || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="metrics" className="mt-4">
                  <Card className="rounded-lg dark:bg-gray-700 dark:border-gray-600">
                    <CardHeader>
                      <CardTitle className="flex items-center  mt-2 gap-2 dark:text-white"><BarChart3 className="h-5 w-5" /> SEO Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <MetricCard
                          title="Domain Rank"
                          value={domain.metrics.domainRank}
                          icon={<TrendingUp className="h-5 w-5" />}
                          color="blue"
                        />
                        <MetricCard
                          title="Referring Domains"
                          value={domain.metrics.referringDomains}
                          icon={<LinkIcon className="h-5 w-5" />}
                          color="green"
                        />
                        {domain?.metrics.monthlyTraffic && <MetricCard
                          title="Monthly Traffic"
                          value={domain.metrics.monthlyTraffic?.toLocaleString() || "N/A"}
                          icon={<Users className="h-5 w-5" />}
                          color="purple"
                        />}
                        <MetricCard
                          title="Domain Authority"
                          value={domain.metrics.domainAuthority}
                          icon={<Award className="h-5 w-5" />}
                          color="yellow"
                        />
                        <MetricCard
                          title="Trust Flow"
                          value={domain.metrics.trustFlow}
                          icon={<Shield className="h-5 w-5" />}
                          color="red"
                        />
                        <MetricCard
                          title="Citation Flow"
                          value={domain.metrics.citationFlow}
                          icon={<Search className="h-5 w-5" />}
                          color="indigo"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="history" className="mt-4">
                  <Card className="rounded-lg dark:bg-gray-700 dark:border-gray-600">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2  mt-2 dark:text-white"><Clock className="h-5 w-5" /> Domain History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 bg-gray-50 dark:bg-gray-600 rounded-lg">
                          <h3 className="font-medium text-gray-900 dark:text-white mb-2">Registration Details</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">This domain was first registered in {domain.metrics.year} and has been maintained for {domain.metrics.age} years.</p>
                        </div>

                        {domain.metrics.authorityLinksCount > 0 && (
                          <div className="p-4 bg-gray-50 dark:bg-gray-600 rounded-lg">
                            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Authority Backlinks</h3>

                            {/* If links exist, show details */}
                            {Array.isArray(domain.metrics.authorityLinks) && domain.metrics.authorityLinks.length > 0 ? (
                              <>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                                  This domain has <span className="font-semibold">{domain.metrics.authorityLinksCount}</span> backlinks from the following authoritative sources:
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {domain.metrics.authorityLinks.map((link, idx) => {
                                    const trimmedLink = link.trim();
                                    let href = trimmedLink;
                                    let displayText = trimmedLink;

                                    if (!trimmedLink.startsWith('http://') && !trimmedLink.startsWith('https://')) {
                                      href = `https://${trimmedLink}`;
                                    }

                                    try {
                                      const url = new URL(href);
                                      displayText = url.hostname;
                                    } catch (e) {
                                      displayText = trimmedLink;
                                    }

                                    return (
                                      <a
                                        key={idx}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-600 hover:border-blue-300 dark:hover:border-blue-500 transition-colors group"
                                      >
                                        <div className="flex items-center">
                                          <div className="flex-shrink-0 w-10 h-10 rounded-md bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors">
                                            <ExternalLink className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                          </div>
                                          <div>
                                            <div className="font-medium text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                                              {displayText}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                                              {href}
                                            </div>
                                          </div>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                                      </a>
                                    );
                                  })}
                                </div>
                              </>
                            ) : (
                              // If only count exists (no link details)
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                This domain has <span className="font-semibold">{domain.metrics.authorityLinksCount}</span> authoritative backlinks.
                              </p>
                            )}
                          </div>
                        )}


                        <div className="p-4 bg-gray-50 dark:bg-gray-600 rounded-lg">
                          <h3 className="font-medium text-gray-900 dark:text-white mb-2">Domain Value</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Based on its age, authority metrics, and traffic, this domain represents a valuable digital asset with strong SEO potential.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Right Column - Pricing and Actions */}
            <div className="space-y-6">
              <div className=" dark:bg-gray-700 rounded-2xl p-6 shadow-lg border border-blue-100 dark:border-gray-600">
                <div className="text-center mb-6">
                  <div className="text-sm text-gray-500 dark:text-gray-300 mb-1">Current Price</div>
                  <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">${domain.price.toLocaleString()}</div>
                  {domain.Actualprice > domain.price && (
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-gray-500 dark:text-gray-400 line-through">${domain.Actualprice.toLocaleString()}</span>
                      <Badge className="bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50">
                        Save {discountPercentage}%
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <Button
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md"
                    onClick={handleAddToCart}
                    disabled={!domain.isAvailable || domain.isSold}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {domain.isSold ? "Sold Out" : domain.isAvailable ? "Add to Cart" : "Unavailable"}
                  </Button>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={handleWishlistToggle}
                      className={cn(
                        "flex-1 py-3 border-2",
                        domain && isInWishlist(domain._id)
                          ? "border-red-300 text-red-500 hover:bg-red-50 dark:border-red-700 dark:hover:bg-red-900/20"
                          : "border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                      )}
                    >
                      <Heart className={cn("h-4 w-4 mr-2", domain && isInWishlist(domain._id) && "fill-current")} />
                      {domain && isInWishlist(domain._id) ? "Remove" : "Wishlist"}
                    </Button>

                    <Button
                      variant="outline"
                      onClick={handleShare}
                      className="flex-1 py-3 border-2 border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                    >
                      <Share className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
                <Separator className="my-6 dark:bg-gray-600" />
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Purchase Benefits</h3>
                  <div className="space-y-3">
                    <TrustItem icon={<CheckCircle />} text="Secure transfer guaranteed" color="green" />
                    <TrustItem icon={<Clock />} text="Transfer within 24-48 hours" color="blue" />
                    <TrustItem icon={<Shield />} text="14-day money-back guarantee" color="red" />
                    <TrustItem icon={<Users />} text="Free dedicated support" color="yellow" />
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <Card className="dark:bg-gray-700 rounded-lg dark:border-gray-600">
                <CardHeader>
                  <CardTitle className="flex items-center mt-4 gap-2 dark:text-white"><FileText className="h-5 w-5 " /> Additional Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Registrar</span>
                      <span className="font-medium dark:text-white">{domain.registrar}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Status</span>
                      <Badge variant={domain.isAvailable ? "default" : "secondary"} className={domain.isAvailable ? "dark:bg-green-900/30 dark:text-green-300" : "dark:bg-gray-600 dark:text-gray-300"}>
                        {domain.isAvailable ? "Available" : "Unavailable"}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Hot Deal</span>
                      <Badge variant={domain.isHot ? "default" : "outline"} className={domain.isHot ? "dark:bg-orange-900/30 dark:text-orange-300" : "dark:bg-gray-600 dark:text-gray-300"}>
                        {domain.isHot ? "Yes" : "No"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        {/* Additional Sections */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          {domain?.metrics.monthlyTraffic && (
            <Card className="border-blue-100 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20 rounded-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-300"><Eye className="h-5 w-5" /> Traffic Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  This domain receives approximately {domain.metrics.monthlyTraffic?.toLocaleString() || 'N/A'} monthly visitors.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Traffic Quality</span>
                  <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">High</Badge>
                </div>
              </CardContent>
            </Card>
          )}
          <Card className="border-purple-100 bg-purple-50 dark:border-purple-800 dark:bg-purple-900/20 rounded-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 p-2 text-purple-800 dark:text-purple-300"><ThumbsUp className="h-5 w-5" /> Overall Score</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Domain Score: {domain.metrics.score || 'N/A'}/100
              </p>
              <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                <div
                  className="bg-purple-600 h-2.5 rounded-full"
                  style={{ width: `${(domain.metrics.score || 0) / 100 * 100}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
          {domain.type == 'aged' && <Card className="border-orange-100 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20 rounded-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 p-2 text-orange-800 dark:text-orange-300"><Calendar className="h-5 w-5" /> Age & History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Registered in {domain.metrics.year} with {domain.metrics.age || 'N/A'} years of history.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Clean History</span>
                <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">Verified</Badge>
              </div>
            </CardContent>
          </Card>}
        </div>
        {/* Similar Domains Section */}
        {similarDomains.length > 0 && (
          <div className="mt-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold dark:text-white">Similar Domains You May Like</h2>
              <Badge variant="outline" className="px-3 py-1 dark:border-gray-600">
                {similarDomains.length} available domains
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarDomains.map((similarDomain) => (
                <Card key={similarDomain._id} className="overflow-hidden transition-all hover:shadow-lg dark:bg-gray-800 dark:border-gray-700">
                  <div className="relative h-40">
                    <Image
                      src={similarDomain.image?.[0] || "/placeholder.png"}
                      alt={similarDomain.name}
                      fill
                      className="object-cover"
                    />
                    {similarDomain.isHot && (
                      <Badge className="absolute top-2 right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
                        <Zap className="h-3 w-3 mr-1" /> HOT
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg dark:text-white">{similarDomain.name}</h3>
                      <Badge variant="outline" className="px-2 py-1 text-xs dark:border-gray-600 dark:text-gray-300">
                        Available
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                      {similarDomain.description}
                    </p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {similarDomain.tags && similarDomain.tags.slice(0, 2).map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs dark:border-gray-600 dark:text-gray-300">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-lg font-bold dark:text-white">${similarDomain.price.toLocaleString()}</span>
                        {similarDomain.Actualprice > similarDomain.price && (
                          <span className="text-sm text-gray-500 dark:text-gray-400 line-through ml-2">
                            ${similarDomain.Actualprice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <Link href={`/domains/${similarDomain._id}`}>
                        <Button size="sm" variant="outline" className="dark:border-gray-600 dark:hover:bg-gray-700">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Show message if no similar domains are available */}
        {similarDomains.length === 0 && domain && domain.tags && domain.tags.length > 0 && (
          <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Similar Domains Available</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We couldn't find any available domains similar to {domain.name} at the moment.
            </p>
            <Button asChild className="px-6 py-3">
              <Link href="/domains">Browse All Domains</Link>
            </Button>
          </div>
        )}
      </main>
      <Footer />
      <LiveChat />
    </div>
  )
}

const MetricCard = ({ title, value, icon, color }: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string
}) => {
  const colorClasses = {
    blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700",
    green: "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700",
    purple: "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700",
    yellow: "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700",
    red: "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700",
    indigo: "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-700",
  }[color] || "bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600"

  return (
    <div className={`p-4 rounded-lg border ${colorClasses} transition-all hover:shadow-md dark:hover:shadow-lg`}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-gray-500 dark:text-gray-400">{icon}</div>
        <div className="text-xs font-medium bg-white dark:bg-gray-600 text-gray-900 dark:text-gray-100 px-2 py-1 rounded">{title}</div>
      </div>
      <div className="text-2xl font-bold dark:text-white">{value}</div>
    </div>
  )
}

const TrustItem = ({ icon, text, color }: {
  icon: React.ReactNode;
  text: string;
  color: string
}) => {
  const colorClasses = {
    green: "text-green-600 dark:text-green-400",
    blue: "text-blue-600 dark:text-blue-400",
    purple: "text-purple-600 dark:text-purple-400",
    red: "text-red-600 dark:text-red-400",
    yellow: "text-yellow-600 dark:text-yellow-400",
  }[color] || "text-gray-600 dark:text-gray-400"

  return (
    <div className={`flex items-center gap-3 ${colorClasses}`}>
      <div className="flex-shrink-0">{icon}</div>
      <span className="text-sm dark:text-gray-300">{text}</span>
    </div>
  )
}