"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/use-auth"
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
} from "lucide-react"
import type { Domain } from "@/types/domain"
import { useCart } from "@/components/providers/cart-provider"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import Cookies from "js-cookie"
import { useEffect, useState } from "react"

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
  const { toast } = useToast()
  const [isWishlisted, setIsWishlisted] = useState(false)

  useEffect(() => {
    const wishlist = JSON.parse(Cookies.get("wishlist") || "[]")
    setIsWishlisted(wishlist.some((item: Domain) => item._id === domain._id))
  }, [domain._id])

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
    
    // Clear the cart first
    clearCart()
    
    // Add the current domain to the cart
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
    
    // Redirect to checkout
    if (!user) {
      router.push("/auth/signin?redirect=/checkout")
      return
    }else{
    router.push("/checkout")
 } 
  }

  const handleWishlistToggle = () => {
    let wishlist: Domain[] = JSON.parse(Cookies.get("wishlist") || "[]")
    if (isWishlisted) {
      wishlist = wishlist.filter((item) => item._id !== domain._id)
      setIsWishlisted(false)
      toast({
        title: "Removed",
        description: `${domain.name} removed from wishlist.`,
      })
    } else {
      wishlist.push(parsedDomain)
      setIsWishlisted(true)
      toast({
        title: "Wishlisted",
        description: `${domain.name} added to wishlist.`,
      })
    }
    Cookies.set("wishlist", JSON.stringify(wishlist), { expires: 30 })
  }

  return (
    <Card className={cn(
      "relative group mx-auto hover:shadow-sm hover:rounded-xl transition-all duration-300 overflow-hidden flex flex-col w-full max-w-xs",
      domain.isSold && "opacity-60"
    )}>
      {/* Top Image - Square */}
      {domain.image?.length > 0 && (
        <div className="relative aspect-square w-full">
          <img
            src={domain.image[0]}
            alt={domain.name}
            className={cn(
              "w-full rounded-3xl h-full object-cover transition duration-300",
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
        </div>
      )}
      <div className="flex flex-col flex-1 p-2">
        {/* Domain Name */}
        <CardHeader className="p-0 pb-1">
          <div className="flex items-start justify-between">
            <CardTitle className="text-base font-bold text-gray-900 truncate">
              {domain.name}
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleWishlistToggle}
              className={cn("p-1 h-6 w-6", isWishlisted && "text-red-500")}
              disabled={domain.isSold || !domain.isAvailable}
            >
              <Heart className={cn("h-3 w-3", isWishlisted && "fill-current")} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0 space-y-1.5 flex-1 flex flex-col">
          {/* Provider/Status Row */}
          <div className="flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center gap-1">
              {domain.type === "traffic" && domain.metrics.monthlyTraffic ? (
                <>
                  <BarChart3 className="h-3 w-3" />
                  <span>Traffic</span>
                </>
              ) : (
                <>
                  <Calendar className="h-3 w-3" />
                  <span>Aged</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-1">
              <ShoppingBag className="h-3 w-3" />
              <span className="truncate max-w-[70px]">{domain.registrar}</span>
            </div>
          </div>
          {/* Price & Availability */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <span className="text-lg font-bold text-gray-900">
                ${domain.price.toLocaleString()}
              </span>
              {domain.Actualprice > domain.price && (
                <span className="text-xs text-gray-500 line-through">
                  ${domain.Actualprice.toLocaleString()}
                </span>
              )}
            </div>
            <Badge className={cn(
              "text-xs px-1.5 py-0.5",
              domain.isAvailable ? "bg-green-600 text-white" : "bg-gray-400 text-white"
            )}>
              {domain.isAvailable ? "Available" : "Unavailable"}
            </Badge>
          </div>
          {/* SEO & Domain Metrics - 3 Columns */}
          <div className="grid grid-cols-3 gap-1.5 text-[10px]">
            {/* Column 1 */}
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-gray-600">
                <TrendingUp className="h-2.5 w-2.5" />
                <span>DR: {domain.metrics.domainRank}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <Activity className="h-2.5 w-2.5" />
                <span>TF: {domain.metrics.trustFlow}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <Calendar className="h-2.5 w-2.5" />
                <span>{domain.metrics.year}</span>
              </div>
            </div>
            {/* Column 2 */}
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-gray-600">
                <LinkIcon className="h-2.5 w-2.5" />
                <span>{domain.metrics.referringDomains} RDs</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <Flag className="h-2.5 w-2.5" />
                <span>CF: {domain.metrics.citationFlow}</span>
              </div>
              <div className="flex items-center gap-1 text-gray-600">
                <Hourglass className="h-2.5 w-2.5" />
                <span>{domain.metrics.age} yrs</span>
              </div>
            </div>
            {/* Column 3 */}
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-gray-600">
                <ShieldCheck className="h-2.5 w-2.5" />
                <span>DA: {domain.metrics.domainAuthority}</span>
              </div>
              {domain.type === "traffic" && domain.metrics.monthlyTraffic && (
                <div className="flex items-center gap-1 text-gray-600">
                  <Globe className="h-2.5 w-2.5" />
                  <span>{domain.metrics.monthlyTraffic.toLocaleString()}</span>
                </div>
              )}
              <div className="flex items-center gap-1 text-gray-600">
                <Languages className="h-2.5 w-2.5" />
                <span>{domain.metrics.language}</span>
              </div>
            </div>
          </div>
          {/* Tags */}
          {domain.tags?.length > 0 && (
            <div className="flex flex-wrap gap-0.5 pt-0.5">
              {domain.tags.slice(0, 3).map((tag, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="text-[10px] px-1.5 py-0.5 text-gray-600 border-gray-300"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          {/* Action Buttons */}
          <div className="flex space-x-1 pt-1 mt-auto">
            <Button
              className="flex-1 h-7 text-xs bg-[#33BDC7] hover:bg-[#2caab4] text-white"
              onClick={handleAddToCart}
              disabled={domain.isSold || !domain.isAvailable}
            >
              <ShoppingCart className="h-3 w-3 mr-1" />
              Add
            </Button>
            <Button
              className="h-7 px-2 text-xs bg-red-600 hover:bg-red-700 text-white"
              onClick={handleBuyNow}
              disabled={domain.isSold || !domain.isAvailable}
            >
              Buy Now
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-2 text-xs"
              disabled={domain.isSold || !domain.isAvailable}
            >
              <a href={`/domains/${domain._id}`} className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                Details
              </a>
            </Button>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}