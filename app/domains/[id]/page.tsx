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
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { LiveChat } from "@/components/chat/live-chat"
import Image from "next/image"
import Cookies from "js-cookie"

export default function DomainDetailsPage() {
  const params = useParams()
  const [domain, setDomain] = useState<Domain | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [isWishlisted, setIsWishlisted] = useState(false)
  const { addItem } = useCart()
  const { toast } = useToast()
  
  useEffect(() => {
    const fetchDomain = async () => {
      try {
        const res = await fetch("/api/domains")
        const data: Domain[] = await res.json()
        const matchedDomain = data.find((d) => d._id === params?.id)
        setDomain(matchedDomain || null)
        
        // Check if domain is already in wishlist
        if (matchedDomain) {
          const wishlist = JSON.parse(Cookies.get("wishlist") || "[]")
          setIsWishlisted(wishlist.some((item: Domain) => item._id === matchedDomain._id))
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
    addItem({ id: domain._id, name: domain.name, price: domain.price, domain,isSold:domain.isSold })
    toast({
      title: "Added to Cart",
      description: `${domain.name} has been added to your cart.`,
    })
  }
  
  const handleWishlistToggle = () => {
    if (!domain) return
    
    let wishlist: Domain[] = JSON.parse(Cookies.get("wishlist") || "[]")
    
    if (isWishlisted) {
      // Remove from wishlist
      wishlist = wishlist.filter((item) => item._id !== domain._id)
      setIsWishlisted(false)
      toast({ 
        title: "Removed", 
        description: `${domain.name} removed from wishlist.` 
      })
    } else {
      // Add to wishlist
      wishlist.push(domain)
      setIsWishlisted(true)
      toast({ 
        title: "Wishlisted", 
        description: `${domain.name} added to wishlist.` 
      })
    }
    
    Cookies.set("wishlist", JSON.stringify(wishlist), { expires: 30 })
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        <main className="max-w-7xl mx-auto px-4 pb-8 pt-24 text-center">
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
  
  const discountPercentage = domain.Actualprice > domain.price 
    ? Math.round(((domain.Actualprice - domain.price) / domain.Actualprice) * 100) 
    : 0
    
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto px-2 sm:px-16 pb-8 pt-24">
        {/* Hero Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-1xl md:text-4xl font-bold text-gray-900 dark:text-white">{domain.name}</h1>
                {domain.isHot && (
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0">
                    <Zap className="h-3 w-3 mr-1" /> HOT
                  </Badge>
                )}
                {domain.featured && (
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
              <Badge variant="outline" className="px-3 py-1">
                {domain.type === "traffic" ? "High Traffic" : "Aged Domain"}
              </Badge>
            </div>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Image and Description */}
            <div className="lg:col-span-2 space-y-6">
              <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-md">
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
                  className="w-full h-64 md:h-80 object-cover" 
                />
              </div>
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Domain Overview</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{domain.description}</p>
              </div>
              
              {/* Tabs for additional information */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="metrics">SEO Metrics</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2"><Info className="h-5 w-5" /> Domain Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <Globe className="h-5 w-5 text-blue-500" />
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Domain Type</p>
                            <p className="font-medium dark:text-white">{domain.type === "traffic" ? "High Traffic Domain" : "Aged Domain"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <Calendar className="h-5 w-5 text-green-500" />
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Domain Age</p>
                            <p className="font-medium dark:text-white">{domain.metrics.age || 'N/A'} years</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <Clock className="h-5 w-5 text-purple-500" />
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Industry</p>
                            <p className="font-medium dark:text-white">{domain.tags || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <Users className="h-5 w-5 text-orange-500" />
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Language</p>
                            <p className="font-medium dark:text-white">{domain.metrics.language || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="metrics" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5" /> SEO Metrics</CardTitle>
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
                       { domain?.metrics.monthlyTraffic&&<MetricCard 
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
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5" /> Domain History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h3 className="font-medium text-gray-900 mb-2">Registration Details</h3>
                          <p className="text-sm text-gray-600">This domain was first registered in {domain.metrics.year} and has been maintained for {domain.metrics.age} years.</p>
                        </div>
                        
                        {domain.metrics.authorityLinks?.length > 0 && (
                          <div className="p-4 bg-gray-50 rounded-lg">
                            <h3 className="font-medium text-gray-900 mb-2">Authority Backlinks</h3>
                            <p className="text-sm text-gray-600 mb-3">This domain has backlinks from the following authoritative sources:</p>
                            <div className="flex flex-wrap gap-2">
                              {domain.metrics.authorityLinks?.map((link, idx) => {
                                try {
                                  const url = new URL(link.trim())
                                  return (
                                    <a
                                      key={idx}
                                      href={url.href}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-3 py-1 rounded-full bg-white border border-gray-200 text-blue-600 hover:bg-blue-50 transition-colors"
                                    >
                                      {url.hostname}
                                    </a>
                                  )
                                } catch {
                                  return null
                                }
                              })}
                            </div>
                          </div>
                        )}
                        
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <h3 className="font-medium text-gray-900 mb-2">Domain Value</h3>
                          <p className="text-sm text-gray-600">Based on its age, authority metrics, and traffic, this domain represents a valuable digital asset with strong SEO potential.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Right Column - Pricing and Actions */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 shadow-lg border border-blue-100">
                <div className="text-center mb-6">
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Current Price</div>
                  <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">${domain.price.toLocaleString()}</div>
                  {domain.Actualprice > domain.price && (
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-gray-500 dark:text-gray-400 line-through">${domain.Actualprice.toLocaleString()}</span>
                      <Badge className="bg-red-100 text-red-700 hover:bg-red-200">
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
                        isWishlisted
                          ? "border-red-300 text-red-500 hover:bg-red-50" 
                          : "border-gray-300 hover:bg-gray-50"
                      )}
                    >
                      <Heart className={cn("h-4 w-4 mr-2", isWishlisted && "fill-current")} />
                      {isWishlisted ? "Remove" : "Wishlist"}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      onClick={handleShare}
                      className="flex-1 py-3 border-2 border-gray-300 hover:bg-gray-50"
                    >
                      <Share className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
                <Separator className="my-6" />
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
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" /> Additional Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Registrar</span>
                      <span className="font-medium dark:text-white">{domain.registrar}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Status</span>
                      <Badge variant={domain.isAvailable ? "default" : "secondary"}>
                        {domain.isAvailable ? "Available" : "Unavailable"}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Hot Deal</span>
                      <Badge variant={domain.isHot ? "default" : "outline"}>
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
            <Card className="border-blue-100 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800 dark:text-blue-300"><Eye className="h-5 w-5" /> Traffic Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  This domain receives approximately {domain.metrics.monthlyTraffic?.toLocaleString() || 'N/A'} monthly visitors.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Traffic Quality</span>
                  <Badge className="bg-blue-100 text-blue-700">High</Badge>
                </div>
              </CardContent>
            </Card>
          )}
          <Card className="border-purple-100 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-800 dark:text-purple-300"><ThumbsUp className="h-5 w-5" /> Overall Score</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Domain Score: {domain.metrics.score || 'N/A'}/100
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-purple-600 h-2.5 rounded-full" 
                  style={{ width: `${(domain.metrics.score || 0) / 100 * 100}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>
         { domain.type=='aged' &&  <Card className="border-orange-100 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-300"><Calendar className="h-5 w-5" /> Age & History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Registered in {domain.metrics.year} with {domain.metrics.age || 'N/A'} years of history.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">Clean History</span>
                <Badge className="bg-orange-100 text-orange-700">Verified</Badge>
              </div>
            </CardContent>
          </Card>}
        </div>
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
  }[color] || "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700"
  
  return (
    <div className={`p-4 rounded-lg border ${colorClasses} transition-all hover:shadow-md dark:hover:shadow-lg`}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-gray-500 dark:text-gray-400">{icon}</div>
        <div className="text-xs font-medium bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 px-2 py-1 rounded">{title}</div>
      </div>
      <div className="text-2xl font-bold">{value}</div>
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
      <span className="text-sm">{text}</span>
    </div>
  )
}