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
  Eye,
  Share2,
} from "lucide-react"
import type { Domain } from "@/types/domain"
import { useCart } from "@/components/providers/cart-provider"
import { useWishlist } from "@/components/providers/wishlist-provider"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import Image from "next/image"

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
      authorityLinks: string[]
      avgAuthorityDR: number
      domainAuthority: number
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
      addToWishlist(parsedDomain)
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
• Trust Flow (TF): ${domain.metrics.trustFlow}
• Citation Flow (CF): ${domain.metrics.citationFlow}
• Referring Domains: ${domain.metrics.referringDomains}
• Authority Links: ${domain.metrics.authorityLinks.length}
• Domain Age: ${domain.metrics.age} years
• Language: ${domain.metrics.language}
${domain.metrics.monthlyTraffic ? `• Monthly Traffic: ${domain.metrics.monthlyTraffic.toLocaleString()}` : ''}
Price: $${domain.price.toLocaleString()} ${domain.Actualprice > domain.price ? `(was $${domain.Actualprice.toLocaleString()})` : ''}
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
      "relative group hover:shadow-sm hover:rounded-xl transition-all duration-300 overflow-hidden flex flex-col w-full",
      domain.isSold && "opacity-60"
    )}>
      {/* Top Image - Responsive Aspect Ratio */}
      {domain.image?.length > 0 && (
        <div className="relative w-full aspect-video">
          <Image
            src={domain.image[0]}
            alt={domain.name}
            fill
            className={cn(
              "object-cover transition duration-300",
              !domain.isAvailable && !domain.isSold && "blur-sm"
            )}
          />
          {domain.isSold && (
            <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center">
              <Badge variant="destructive" className="text-xs px-2 py-1">
                SOLD
              </Badge>
            </div>
          )}
          {domain.isHot && (
            <Badge className="absolute top-2 right-2 bg-orange-500 hover:bg-orange-600 z-10">
              HOT
            </Badge>
          )}
        </div>
      )}
      
      <div className="flex flex-col flex-1 p-3 sm:p-4">
        {/* Domain Name */}
        <CardHeader className="p-0 pb-2 sm:pb-3">
          <div className="flex items-start justify-between">
            <CardTitle className="text-base sm:text-lg font-bold text-gray-900 truncate pr-2">
              {domain.name}
            </CardTitle>
            <div className="flex gap-1 flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleShare}
                className="p-1 h-7 w-7 sm:h-8 sm:w-8"
              >
                <Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleWishlistToggle}
                className={cn("p-1 h-7 w-7 sm:h-8 sm:w-8", isWishlisted && "text-red-500 hover:text-red-500")}
                disabled={domain.isSold || !domain.isAvailable}
              >
                <Heart className={cn("h-3 w-3 sm:h-4 sm:w-4", isWishlisted && "fill-current")} />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-0 space-y-2 sm:space-y-3 flex-1 flex flex-col">
          {/* Provider/Status Row */}
          <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600">
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
              <span className="text-lg sm:text-xl font-bold text-gray-900">
                ${domain.price.toLocaleString()}
              </span>
              {domain.Actualprice > domain.price && (
                <span className="text-xs sm:text-sm text-gray-500 line-through">
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
          
          {/* SEO & Domain Metrics - Updated for Mobile */}
          <div className="grid grid-cols-3 gap-1 sm:gap-3 text-[10px] sm:text-xs">
            {/* Column 1 */}
            <div className="space-y-1 sm:space-y-2">
              <div className="flex items-center gap-1 text-gray-600">
                <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                <span>DR: {domain.metrics.domainRank}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <Activity className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                <span>TF: {domain.metrics.trustFlow}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <LinkIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                <span>{domain.metrics.authorityLinks.length} ALs</span>
              </div>
            </div>
            
            {/* Column 2 */}
            <div className="space-y-1 sm:space-y-2">
              <div className="flex items-center gap-1 text-gray-600">
                <LinkIcon className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                <span>{domain.metrics.referringDomains} RDs</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <Flag className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                <span>CF: {domain.metrics.citationFlow}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <Hourglass className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                <span>{domain.metrics.age} yrs</span>
              </div>
            </div>
            
            {/* Column 3 */}
            <div className="space-y-1 sm:space-y-2">
              <div className="flex items-center gap-1 text-gray-600">
                <ShieldCheck className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                <span>DA: {domain.metrics.domainAuthority}</span>
              </div>
              {domain.type === "traffic" && domain.metrics.monthlyTraffic && (
                <div className="flex items-center gap-1 text-gray-600">
                  <Globe className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  <span>{domain.metrics.monthlyTraffic.toLocaleString()}</span>
                </div>
              )}
              <div className="flex items-center gap-1 text-gray-600">
                <Languages className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                <span>{domain.metrics.language}</span>
              </div>
            </div>
          </div>
          
          {/* Tags */}
          {domain.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {domain.tags.slice(0, 3).map((tag, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="text-[10px] sm:text-xs px-1.5 py-0.5 text-gray-600 border-gray-300"
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
              className="h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm"
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
        </CardContent>
      </div>
    </Card>
  )
}