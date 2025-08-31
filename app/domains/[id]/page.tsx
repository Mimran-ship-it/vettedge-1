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
  const [activeTab, setActiveTab] = useState("overview")
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        <main className="max-w-7xl mx-auto px-4 pb-8 pt-24 animate-pulse">
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Header />
        <main className="max-w-7xl mx-auto px-4 pb-8 pt-24 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
            <div className="text-red-500 mx-auto w-16 h-16 mb-4">
              <Info size={64} />
            </div>
            <h1 className="text-2xl font-bold mb-4">Domain Not Found</h1>
            <p className="text-gray-600 mb-6">The domain you're looking for doesn't exist or has been removed.</p>
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
      <main className="max-w-7xl mx-auto px-4 pb-8 pt-24">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <a href="/" className="hover:text-gray-700 transition-colors">Home</a>
          <span>/</span>
          <a href="/domains" className="hover:text-gray-700 transition-colors">Domains</a>
          <span>/</span>
          <span className="text-gray-900 font-medium">{domain.name}</span>
        </nav>

        {/* Hero Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{domain.name}</h1>
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
              <p className="text-gray-600">Registered with {domain.registrar}</p>
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
                <h2 className="text-xl font-semibold text-gray-900">Domain Overview</h2>
                <p className="text-gray-700 leading-relaxed">{domain.description}</p>
                
                <div className="flex flex-wrap gap-2 mt-4">
                  {domain.tags?.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors">
                      <Tag className="h-3 w-3 mr-1" /> {tag}
                    </Badge>
                  ))}
                </div>
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
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Globe className="h-5 w-5 text-blue-500" />
                          <div>
                            <p className="text-sm text-gray-500">Domain Type</p>
                            <p className="font-medium">{domain.type === "traffic" ? "High Traffic Domain" : "Aged Domain"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Calendar className="h-5 w-5 text-green-500" />
                          <div>
                            <p className="text-sm text-gray-500">Domain Age</p>
                            <p className="font-medium">{domain.metrics.age || 'N/A'} years</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Clock className="h-5 w-5 text-purple-500" />
                          <div>
                            <p className="text-sm text-gray-500">Registration Year</p>
                            <p className="font-medium">{domain.metrics.year || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Users className="h-5 w-5 text-orange-500" />
                          <div>
                            <p className="text-sm text-gray-500">Language</p>
                            <p className="font-medium">{domain.metrics.language || 'N/A'}</p>
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
                        <MetricCard 
                          title="Monthly Traffic" 
                          value={domain.metrics.monthlyTraffic?.toLocaleString() || "N/A"} 
                          icon={<Users className="h-5 w-5" />} 
                          color="purple"
                        />
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
                  <div className="text-sm text-gray-500 mb-1">Current Price</div>
                  <div className="text-4xl font-bold text-gray-900 mb-2">${domain.price.toLocaleString()}</div>
                  {domain.Actualprice > domain.price && (
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-gray-500 line-through">${domain.Actualprice.toLocaleString()}</span>
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
                  
                  <Button 
                    variant="outline" 
                    onClick={handleWishlistToggle} 
                    className={cn(
                      "w-full py-3 border-2", 
                      isInWishlist(domain._id) 
                        ? "border-red-300 text-red-500 hover:bg-red-50" 
                        : "border-gray-300 hover:bg-gray-50"
                    )}
                  >
                    <Heart className={cn("h-4 w-4 mr-2", isInWishlist(domain._id) && "fill-current")} />
                    {isInWishlist(domain._id) ? "Remove from Wishlist" : "Add to Wishlist"}
                  </Button>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">Purchase Benefits</h3>
                  <div className="space-y-3">
                    <TrustItem icon={<CheckCircle />} text="Secure transfer guaranteed" color="green" />
                    <TrustItem icon={<Clock />} text="Transfer within 24-48 hours" color="blue" />
                    <TrustItem icon={<Search />} text="Full SEO history included" color="purple" />
                    <TrustItem icon={<Shield />} text="30-day money-back guarantee" color="red" />
                    <TrustItem icon={<Users />} text="Free dedicated support" color="yellow" />
                  </div>
                </div>
              </div>

              {/* Domain Value Proposition */}
              <Card className="border-green-100 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800"><Award className="h-5 w-5" /> Domain Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Domain Authority</span>
                      <Badge variant="outline" className="bg-white border-green-200 text-green-700">
                        {domain.metrics.domainAuthority || 'N/A'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Trust Flow</span>
                      <Badge variant="outline" className="bg-white border-green-200 text-green-700">
                        {domain.metrics.trustFlow || 'N/A'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Citation Flow</span>
                      <Badge variant="outline" className="bg-white border-green-200 text-green-700">
                        {domain.metrics.citationFlow || 'N/A'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Domain Age</span>
                      <Badge variant="outline" className="bg-white border-green-200 text-green-700">
                        {domain.metrics.age || 'N/A'} years
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" /> Additional Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Registrar</span>
                      <span className="font-medium">{domain.registrar}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Status</span>
                      <Badge variant={domain.isAvailable ? "default" : "secondary"}>
                        {domain.isAvailable ? "Available" : "Unavailable"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Featured</span>
                      <Badge variant={domain.featured ? "default" : "outline"}>
                        {domain.featured ? "Yes" : "No"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Hot Deal</span>
                      <Badge variant={domain.isHot ? "default" : "outline"}>
                        {domain.isHot ? "Yes" : "No"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Zap className="h-5 w-5" /> Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-between">
                      <span>View WHOIS Data</span>
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" className="w-full justify-between">
                      <span>Check Backlinks</span>
                      <LinkIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" className="w-full justify-between">
                      <span>Estimate Value</span>
                      <BarChart3 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Additional Sections */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-blue-100 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800"><Eye className="h-5 w-5" /> Traffic Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                This domain receives approximately {domain.metrics.monthlyTraffic?.toLocaleString() || 'N/A'} monthly visitors.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Traffic Quality</span>
                <Badge className="bg-blue-100 text-blue-700">High</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-100 bg-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-800"><ThumbsUp className="h-5 w-5" /> Authority Score</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Domain Authority: {domain.metrics.domainAuthority || 'N/A'}/100
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-purple-600 h-2.5 rounded-full" 
                  style={{ width: `${(domain.metrics.domainAuthority || 0) / 100 * 100}%` }}
                ></div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-100 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800"><Calendar className="h-5 w-5" /> Age & History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">
                Registered in {domain.metrics.year} with {domain.metrics.age || 'N/A'} years of history.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Clean History</span>
                <Badge className="bg-orange-100 text-orange-700">Verified</Badge>
              </div>
            </CardContent>
          </Card>
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
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-green-50 text-green-700 border-green-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    yellow: "bg-yellow-50 text-yellow-700 border-yellow-200",
    red: "bg-red-50 text-red-700 border-red-200",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
  }[color] || "bg-gray-50 text-gray-700 border-gray-200"

  return (
    <div className={`p-4 rounded-lg border ${colorClasses} transition-all hover:shadow-md`}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-gray-500">{icon}</div>
        <div className="text-xs font-medium bg-white px-2 py-1 rounded">{title}</div>
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
    green: "text-green-600",
    blue: "text-blue-600",
    purple: "text-purple-600",
    red: "text-red-600",
    yellow: "text-yellow-600",
  }[color] || "text-gray-600"

  return (
    <div className={`flex items-center gap-3 ${colorClasses}`}>
      <div className="flex-shrink-0">{icon}</div>
      <span className="text-sm">{text}</span>
    </div>
  )
}