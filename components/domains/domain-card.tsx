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
      <TooltipContent>
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
    toast({
      title: "Added to Cart",
      description: `${domain.name} has been added to your cart.`,
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
    toast({
      title: "Added to Cart",
      description: `${domain.name} has been added to your cart. Redirecting to checkout...`,
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
    const url = `${window.location.origin}/domains/${domain._id}`;

    // Create shareable text with all key domain information
    const shareText = `Check out this premium domain: ${domain.name}
Key Metrics:
• Domain Rank (DR): ${domain.metrics.domainRank}
• Domain Authority (DA): ${domain.metrics.domainAuthority}
• Overall Score : ${domain.metrics.score}
• Trust Flow (TF): ${domain.metrics.trustFlow}
• Citation Flow (CF): ${domain.metrics.citationFlow}
• Referring Domains: ${domain.metrics.referringDomains}
• Authority Links: ${domain.metrics.authorityLinksCount}
• Domain Age: ${domain.metrics.age} years
• Language: ${domain.metrics.language}
 ${domain.metrics.monthlyTraffic ? `• Monthly Traffic: ${domain.metrics.monthlyTraffic.toLocaleString()}` : ''}
Price: $${domain.price.toLocaleString()} ${(domain.Actualprice&&(domain.Actualprice > domain.price)) ? `(was $${domain.Actualprice.toLocaleString()})` : ''}
Registrar: ${domain.registrar}
Status: ${domain.isAvailable ? 'Available' : 'Unavailable'} ${domain.isSold ? '(SOLD)' : ''}
View full details:`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareText,
          text: shareText,
          url: url,
        });
        toast({
          title: "Shared Successfully",
          description: "Domain details have been shared.",
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
    <Card className={cn(
      "relative group hover:shadow-sm hover:rounded-xl transition-all duration-300 overflow-hidden flex flex-col w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700",
      (domain.isSold||(!domain.isAvailable)) && "opacity-60"
    )}>
      {/* Top Image - Responsive Aspect Ratio */}
      {domain.image?.length > 0 && (
        <div className="relative w-full aspect-video">
          <Link href={`/domains/${domain._id}`}><Image
            src={domain.image[0]}
            alt={domain.name}
            fill
            className={cn(
              "object-cover transition duration-300 bg-white",
              (domain.isSold||(!domain.isAvailable)) ? "blur-[40px] brightness-50" : (!domain.isAvailable && !domain.isSold ? "blur-sm" : "")
            )}
          /></Link>
          {(domain.isSold||(!domain.isAvailable)) && (
            <div className="absolute inset-0 bg-black/80 z-10 flex items-center justify-center">
              <Badge variant="destructive" className="text-xs px-2 py-1">
                SOLD
              </Badge>
            </div>
          )}
          {domain.isHot && (
            <Badge className="absolute top-2 right-2 bg-orange-500 hover:bg-orange-600 z-0">
              HOT
            </Badge>
          )}
        </div>
      )}

      <div className="flex flex-col flex-1 p-3 sm:p-4">
        {/* Domain Name */}
        <CardHeader className="p-0 pb-2 sm:pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              {(domain.isSold||(!domain.isAvailable)) ? (
                <div className="relative">
                  <div className="absolute inset-0 blur-[30px] bg-gradient-to-r from-gray-300 to-gray-400 opacity-70"></div>
                  <div className="relative text-transparent">███████████████████</div>
                </div>
              ) : (
                <CardTitle className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate pr-2">
                  {domain.name}
                </CardTitle>
              )}
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleShare}
                className="p-1 h-7 w-7 sm:h-8 sm:w-8 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleWishlistToggle}
                className={cn("p-1 h-7 w-7 sm:h-8 sm:w-8 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white", isWishlisted && "text-red-500 hover:text-red-500 dark:text-red-400 dark:hover:text-red-400")}
                disabled={domain.isSold || !domain.isAvailable}
              >
                <Heart className={cn("h-3 w-3 sm:h-4 sm:w-4", isWishlisted && "fill-current")} />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 space-y-2 sm:space-y-3 flex-1 flex flex-col">
          {/* Provider/Status Row */}
          <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-1">
              {domain.type === "traffic" && domain.metrics.monthlyTraffic ? (
                <>
                  <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Traffic</span>
                </>
              ) : (
                <>
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Aged</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-1 truncate max-w-[70px] sm:max-w-[100px]">
              <ShoppingBag className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="truncate">{domain.registrar}</span>
            </div>
          </div>

          {/* Price & Availability */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div className="flex items-center gap-1">
              <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                ${domain.price.toLocaleString()}
              </span>
              {domain.Actualprice&&(domain.Actualprice > domain.price) && (
                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-through">
                  ${domain.Actualprice.toLocaleString()}
                </span>
              )}
            </div>
            <Badge className={cn(
              "text-xs px-1.5 py-0.5 self-start sm:self-auto",
              domain.isAvailable ? "bg-green-600 text-white" : "bg-gray-400 text-white"
            )}>
              {domain.isAvailable ? "Available" : "Unavailable"}
            </Badge>
          </div>

          {/* Enhanced Overall Score Section */}
          <div className="mb-3 sm:mb-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-100 dark:border-blue-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-semibold text-blue-800 dark:text-blue-300">Overall Score</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-blue-800 dark:text-blue-300">
                  {domain.metrics.score}
                </span>
                <div className="relative w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 rounded-full"
                    style={{ width: `${Math.min(100, domain.metrics.score)}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Desktop Score Description */}
            <div className="text-xs text-gray-600 dark:text-gray-300">
              {domain.metrics.score >= 80 ? (
                <span className="text-green-600 dark:text-green-400 font-medium">Exceptional domain score</span>
              ) : domain.metrics.score >= 60 ? (
                <span className="text-blue-600 dark:text-blue-400 font-medium">Strong domain score </span>
              ) : domain.metrics.score >= 40 ? (
                <span className="text-yellow-600 dark:text-yellow-400 font-medium">Moderate domain score</span>
              ) : (
                <span className="text-orange-600 dark:text-orange-400 font-medium">Developing domain score</span>
              )}
            </div>
          </div>

          <TooltipProvider>
            <div className="grid grid-cols-3 gap-1 sm:gap-3 text-[10px] sm:text-xs">
              {/* Column 1 */}
              <div className="space-y-1 sm:space-y-2">
                <CustomTooltip tooltipKey="domainRank" content={<p className="font-semibold">Domain Rank</p>}>
                  <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300 cursor-help">
                    <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    <span>DR: {domain.metrics.domainRank}</span>
                  </div>
                </CustomTooltip>

                <CustomTooltip tooltipKey="trustFlow" content={<p className="font-semibold">Trust Flow</p>}>
                  <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300 cursor-help">
                    <Activity className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    <span>TF: {domain.metrics.trustFlow}</span>
                  </div>
                </CustomTooltip>

                <CustomTooltip tooltipKey="authorityLinks" content={<p className="font-semibold">Authority Links</p>}>
                  <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300 cursor-help">
                    <LinkIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    <span>{domain.metrics.authorityLinksCount} ALs</span>
                  </div>
                </CustomTooltip>
              </div>

              {/* Column 2 */}
              <div className="space-y-1 sm:space-y-2">
                <CustomTooltip tooltipKey="referringDomains" content={<p className="font-semibold">Referring Domains</p>}>
                  <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300 cursor-help">
                    <LinkIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    <span>{domain.metrics.referringDomains} RDs</span>
                  </div>
                </CustomTooltip>

                <CustomTooltip tooltipKey="citationFlow" content={<p className="font-semibold">Citation Flow</p>}>
                  <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300 cursor-help">
                    <Flag className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    <span>CF: {domain.metrics.citationFlow}</span>
                  </div>
                </CustomTooltip>

                <CustomTooltip tooltipKey="domainAge" content={<p className="font-semibold">Domain Age</p>}>
                  <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300 cursor-help">
                    <Hourglass className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    <span>{domain.metrics.age} yrs</span>
                  </div>
                </CustomTooltip>
              </div>

              {/* Column 3 */}
              <div className="space-y-1 sm:space-y-2">
                <CustomTooltip tooltipKey="domainAuthority" content={<p className="font-semibold">Domain Authority</p>}>
                  <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300 cursor-help">
                    <Building className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    <span>DA: {domain.metrics.domainAuthority}</span>
                  </div>
                </CustomTooltip>

                {domain.type === "traffic" && domain.metrics.monthlyTraffic && (
                  <CustomTooltip tooltipKey="monthlyTraffic" content={<p className="font-semibold">Monthly Traffic</p>}>
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300 cursor-help">
                      <Globe className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      <span>{domain.metrics.monthlyTraffic.toLocaleString()}</span>
                    </div>
                  </CustomTooltip>
                )}

                <CustomTooltip tooltipKey="language" content={<p className="font-semibold">Primary Language</p>}>
                  <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300 cursor-help">
                    <Languages className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
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
                  className="text-[10px] sm:text-xs px-1.5 py-0.5 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 pt-2 mt-auto">
            <Button
              className="flex-1 h-8 sm:h-9 text-xs sm:text-sm bg-[#33BDC7] hover:bg-[#2caab4] text-white"
              onClick={handleAddToCart}
              disabled={domain.isSold || !domain.isAvailable}
            >
              <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
              Add
            </Button>
            <Button
              className="h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm bg-red-600 hover:bg-red-700 text-white"
              onClick={handleBuyNow}
              disabled={domain.isSold || !domain.isAvailable}
            >
              Buy Now
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              disabled={domain.isSold || !domain.isAvailable}
            >
              <Link
                href={`/domains/${domain._id}`}
                className="flex items-center gap-1"
              >
                <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Details</span>
              </Link>
            </Button>
          </div>
         
          <div className="flex gap-5 pt-2 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="h-3 w-3 text-green-600 dark:text-green-400 flex-shrink-0" />
              <span>Search engine indexed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="h-3 w-3 ml-13 text-green-600 dark:text-green-400 flex-shrink-0" />
              <span>Trademark Free</span>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}