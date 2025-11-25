"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"
import {
  Heart,
  ShoppingCart,
  TrendingUp,
  LinkIcon,
  Globe,
  Calendar,
  ShieldCheck,
  Flag,
  Activity,
  Languages,
  Hourglass,
  Building,
  Tag,
  BarChart3,
  ShoppingBag,
  CheckCircle,
  Eye,
  Share2,
} from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { Domain } from "@/types/domain"
import { useCart } from "@/components/providers/cart-provider"
import { useWishlist } from "@/components/providers/wishlist-provider"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { useState } from "react"
import { motion } from "framer-motion"

interface DomainCardProps {
  domain: {
    _id: string
    name: string
    description: string
    price: number
    Actualprice: number
    type: string
    registrar: string
    tags: string[]
    image: string[]
    isAvailable: boolean
    isSold: boolean
    isHot: boolean
    metrics: {
      domainRank: number
      referringDomains: number
      authorityLinks?: string[]
      authorityLinksCount: number
      avgAuthorityDR: number
      domainAuthority: number
      score: number
      trustFlow: number
      citationFlow: number
      monthlyTraffic: number | null
      year: number
      age: number
      language: string
    }
    createdAt: string
    updatedAt: string
  }
}

// Custom Tooltip Component that supports both hover and click
function CustomTooltip({ 
  children, 
  content, 
  tooltipKey 
}: { 
  children: React.ReactNode
  content: React.ReactNode
  tooltipKey: string 
}) {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <Tooltip open={isOpen} onOpenChange={setIsOpen}>
      <TooltipTrigger 
        asChild
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
      >
        {children}
      </TooltipTrigger>
      <TooltipContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md max-w-xs">
        {content}
      </TooltipContent>
    </Tooltip>
  )
}

export function DomainCard({ domain }: DomainCardProps) {
  const { user } = useAuth()
  const router = useRouter()
  const parsedDomain: Domain = {
    ...domain,
    createdAt: new Date(domain.createdAt).toISOString(),
    updatedAt: new Date(domain.updatedAt).toISOString(),
  }
  const { addItem, clearCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { toast } = useToast()
  const isWishlisted = isInWishlist(domain._id)

  const handleAddToCart = () => {
    if (domain.isSold || !domain.isAvailable) {
      toast({
        title: "Domain Unavailable",
        description: "This domain is no longer available for purchase.",
        variant: "destructive",
      })
      return
    }
    addItem({
      id: parsedDomain._id,
      name: parsedDomain.name,
      price: parsedDomain.price,
      domain: parsedDomain,
      isSold: parsedDomain.isSold,
    })
  
  }

  const handleBuyNow = () => {
    if (domain.isSold || !domain.isAvailable) {
      toast({
        title: "Domain Unavailable",
        description: "This domain is no longer available for purchase.",
        variant: "destructive",
      })
      return
    }
    clearCart()
    addItem({
      id: parsedDomain._id,
      name: parsedDomain.name,
      price: parsedDomain.price,
      domain: parsedDomain,
      isSold: parsedDomain.isSold,
    })
    
    if (!user) {
      router.push("/auth/signin?redirect=/checkout")
      return
    } else {
      router.push("/checkout")
    }
  }

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(domain._id)
      toast({
        title: "Removed",
        description: `${domain.name} removed from wishlist.`,
      })
    } else {
      addToWishlist(domain._id)
      toast({
        title: "Wishlisted",
        description: `${domain.name} added to wishlist.`,
      })
    }
  }

  const handleShare = async () => {
    if (domain.isSold || !domain.isAvailable) {
      return; // Don't allow sharing for sold or unavailable domains
    }
    
    const url = `${window.location.origin}/domains/${domain._id}`;

    // Create shareable text with all key domain information
    const shareText = `Check out this premium domain: ${domain.name}
Key Metrics:
• Domain Rank (DR): ${domain.metrics.domainRank}
• Domain Authority (DA): ${domain.metrics.domainAuthority}
• Overall Score: ${domain.metrics.score}
• Trust Flow (TF): ${domain.metrics.trustFlow}
• Citation Flow (CF): ${domain.metrics.citationFlow}
• Referring Domains: ${domain.metrics.referringDomains}
• Authority Links: ${domain.metrics.authorityLinksCount}
• Domain Age: ${domain.metrics.age} years
• Language: ${domain.metrics.language}
 ${domain.metrics.monthlyTraffic ? `• Monthly Traffic: ${domain.metrics.monthlyTraffic.toLocaleString()}` : ''}
Price: $${domain.price.toLocaleString()} ${(domain.Actualprice && (domain.Actualprice > domain.price)) ? `(was $${domain.Actualprice.toLocaleString()})` : ''}
Registrar: ${domain.registrar}
View full details:`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareText,
          text: shareText,
          url: url,
        });
       
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        toast({
          title: "Copied to Clipboard",
          description: "Domain details have been copied to your clipboard.",
        });
      } catch (error) {
        console.error('Error copying to clipboard:', error);
        toast({
          title: "Copy Failed",
          description: "Failed to copy domain details to clipboard.",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card className={cn(
        "relative group h-full flex flex-col  overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200",
        (domain.isSold||(!domain.isAvailable)) && "opacity-70"
      )}>
        {/* Top Image - Responsive Aspect Ratio */}
        {domain.image?.length > 0 && (
          <div className="relative w-full aspect-video overflow-hidden bg-gray-100 dark:bg-gray-700">
            <Link href={domain.isSold || !domain.isAvailable ? '#' : `/domains/${domain._id}`}>
              <Image
                src={domain.image[0]}
                alt={domain.name}
                fill
                className={cn(
                  "object-cover transition duration-300",
                  (domain.isSold || !domain.isAvailable) ? "blur-[40px] brightness-50" : ""
                )}
              />
            </Link>
            
            {(domain.isSold || !domain.isAvailable) && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <Badge variant="destructive" className="text-sm px-3 py-1">
                  {domain.isSold ? "SOLD" : "UNAVAILABLE"}
                </Badge>
              </div>
            )}
            
            {domain.isHot && (
              <Badge className="absolute top-3 right-3 bg-orange-500 hover:bg-orange-600">
                HOT
              </Badge>
            )}
          </div>
        )}

        <div className="flex flex-col flex-1 p-4">
          {/* Domain Name */}
          <CardHeader className="p-0 pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                {(domain.isSold||(!domain.isAvailable)) ? (
                  <div className="relative">
                    <div className="absolute inset-0 blur-[30px] bg-gradient-to-r from-gray-300 to-gray-400 opacity-70"></div>
                    <div className="relative text-transparent">███████████████████</div>
                  </div>
                ) : (
                  <CardTitle className="text-lg font-bold text-gray-900 dark:text-white truncate pr-2">
                    {domain.name}
                  </CardTitle>
                )}
              </div>
              <div className="flex gap-1 flex-shrink-0">
                {!domain.isSold && domain.isAvailable && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleShare}
                    className="p-1 h-7 w-7 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleWishlistToggle}
                  className={cn("p-1 h-7 w-7 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300", isWishlisted && "text-red-500 hover:text-red-500 dark:text-red-400 dark:hover:text-red-400")}
                  disabled={domain.isSold || !domain.isAvailable}
                >
                  <Heart className={cn("h-4 w-4", isWishlisted && "fill-current")} />
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0 space-y-3 flex-1 flex flex-col">
            {/* Provider/Status Row */}
            <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-1">
                {domain.type === "traffic" && domain.metrics.monthlyTraffic ? (
                  <>
                    <BarChart3 className="h-4 w-4" />
                    <span>Traffic</span>
                  </>
                ) : (
                  <>
                    <Calendar className="h-4 w-4" />
                    <span>Aged</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-1 truncate max-w-[100px]">
                <ShoppingBag className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{domain.registrar}</span>
              </div>
            </div>

            {/* Price & Availability */}
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-2">
    <span className="text-xl font-bold text-gray-900 dark:text-white">
      ${domain.price.toLocaleString()}
    </span>

    {domain.Actualprice && domain.Actualprice > domain.price && (
      <>
        <span className="text-sm text-gray-500 dark:text-gray-400 line-through">
          ${domain.Actualprice.toLocaleString()}
        </span>
        <span className="text-sm font-semibold text-[#38C172]">
          {Math.round(((domain.Actualprice - domain.price) / domain.Actualprice) * 100)}% off
        </span>
      </>
    )}
  </div>
              <Badge 
                variant={domain.isAvailable && !domain.isSold ? "default" : "secondary"}
                className={cn(
                  "text-xs",
                  domain.isAvailable && !domain.isSold 
                    ? "bg-[#38C172]/10 text-[#38C172]" 
                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                )}
              >
                {domain.isAvailable && !domain.isSold ? "Available" : domain.isSold ? "Sold" : "Unavailable"}
              </Badge>
            </div>

            {/* Overall Score Section */}
            <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-md border border-gray-200 dark:border-gray-600 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-[#33BDC7]" />
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">Overall Score</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">
                    {domain.metrics.score}
                  </span>
                  <div className="relative w-16 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div 
                      className="absolute top-0 left-0 h-full bg-[#33BDC7] rounded-full"
                      style={{ width: `${Math.min(100, domain.metrics.score)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Score Description */}
              <div className="text-xs text-gray-600 dark:text-gray-300">
                {domain.metrics.score >= 80 ? (
                  <span className="text-[#33BDC7] font-medium">Exceptional domain score</span>
                ) : domain.metrics.score >= 60 ? (
                  <span className="text-[#33BDC7] font-medium">Strong domain score</span>
                ) : domain.metrics.score >= 40 ? (
                  <span className="text-yellow-600 dark:text-yellow-400 font-medium">Moderate domain score</span>
                ) : (
                  <span className="text-orange-600 dark:text-orange-400 font-medium">Developing domain score</span>
                )}
              </div>
            </div>

            <TooltipProvider>
              <div className="grid grid-cols-3 gap-2 text-xs">
                {/* Column 1 */}
                <div className="space-y-2">
                  <CustomTooltip tooltipKey="domainRank" content={<p className="font-semibold">Domain Rank (DR)</p>}>
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300 cursor-help">
                      <TrendingUp className="h-3 w-3" />
                      <span>DR: {domain.metrics.domainRank}</span>
                    </div>
                  </CustomTooltip>

                  <CustomTooltip tooltipKey="trustFlow" content={<p className="font-semibold">Trust Flow (TF)</p>}>
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300 cursor-help">
                      <Activity className="h-3 w-3" />
                      <span>TF: {domain.metrics.trustFlow}</span>
                    </div>
                  </CustomTooltip>

                  <CustomTooltip tooltipKey="authorityLinks" content={<p className="font-semibold">Authority Links (ALs)</p>}>
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300 cursor-help">
                      <LinkIcon className="h-3 w-3" />
                      <span>{domain.metrics.authorityLinksCount} ALs</span>
                    </div>
                  </CustomTooltip>
                </div>

                {/* Column 2 */}
                <div className="space-y-2">
                  <CustomTooltip tooltipKey="referringDomains" content={<p className="font-semibold">Referring Domains (RDs)</p>}>
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300 cursor-help">
                      <LinkIcon className="h-3 w-3" />
                      <span>{domain.metrics.referringDomains} RDs</span>
                    </div>
                  </CustomTooltip>

                  <CustomTooltip tooltipKey="citationFlow" content={<p className="font-semibold">Citation Flow (CF)</p>}>
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300 cursor-help">
                      <Flag className="h-3 w-3" />
                      <span>CF: {domain.metrics.citationFlow}</span>
                    </div>
                  </CustomTooltip>

                  <CustomTooltip tooltipKey="domainAge" content={<p className="font-semibold">Domain Age</p>}>
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300 cursor-help">
                      <Hourglass className="h-3 w-3" />
                      <span>{domain.metrics.age} yrs</span>
                    </div>
                  </CustomTooltip>
                </div>

                {/* Column 3 */}
                <div className="space-y-2">
                  <CustomTooltip tooltipKey="domainAuthority" content={<p className="font-semibold">Domain Authority (DA)</p>}>
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300 cursor-help">
                      <Building className="h-3 w-3" />
                      <span>DA: {domain.metrics.domainAuthority}</span>
                    </div>
                  </CustomTooltip>

                  {domain.type === "traffic" && domain.metrics.monthlyTraffic && (
                    <CustomTooltip tooltipKey="monthlyTraffic" content={<p className="font-semibold">Monthly Traffic</p>}>
                      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300 cursor-help">
                        <Globe className="h-3 w-3" />
                        <span>{domain.metrics.monthlyTraffic.toLocaleString()}</span>
                      </div>
                    </CustomTooltip>
                  )}

                  <CustomTooltip tooltipKey="language" content={<p className="font-semibold">Primary Language</p>}>
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300 cursor-help">
                      <Languages className="h-3 w-3" />
                      <span>{domain.metrics.language}</span>
                    </div>
                  </CustomTooltip>
                </div>
              </div>
            </TooltipProvider>

            {/* Tags */}
            {domain.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-1">
                {domain.tags.slice(0, 3).map((tag, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="text-xs px-2 py-0.5 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 pt-2 mt-auto">
              <Button
                className="flex-1 h-9 bg-[#33BDC7] hover:bg-[#2caab4] text-white"
                onClick={handleAddToCart}
                disabled={domain.isSold || !domain.isAvailable}
              >
                <ShoppingCart className="h-4 w-4 mr-1" />
                Add
              </Button>
              <Button
                className="h-9 px-3 bg-red-600 hover:bg-red-700 text-white"
                onClick={handleBuyNow}
                disabled={domain.isSold || !domain.isAvailable}
              >
                Buy Now
              </Button>
              <Button
                variant="outline"
                className="h-9 px-3 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                disabled={domain.isSold || !domain.isAvailable}
              >
                <Link
                  href={`/domains/${domain._id}`}
                  className="flex items-center gap-1"
                >
                  <Eye className="h-4 w-4" />
                  <span>Details</span>
                </Link>
              </Button>
            </div>
           
            <div className="flex gap-4 pt-2 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-[#33BDC7]" />
                <span>Search engine indexed</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-[#33BDC7]" />
                <span>Trademark Free</span>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  )
}