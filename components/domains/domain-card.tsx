"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
  const parsedDomain: Domain = {
    ...domain,
    createdAt: new Date(domain.createdAt).toISOString(),
    updatedAt: new Date(domain.updatedAt).toISOString(),
  }
  const { addItem } = useCart()
  const { toast } = useToast()

  const [isWishlisted, setIsWishlisted] = useState(false)

  // Load wishlist state from cookie on mount
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

    // Add to cart and redirect to checkout
    addItem({
      id: parsedDomain._id,
      name: parsedDomain.name,
      price: parsedDomain.price,
      domain: parsedDomain,
    })
    
    // Redirect to checkout
    window.location.href = "/checkout"
  }

  const handleWishlistToggle = () => {
    let wishlist: Domain[] = JSON.parse(Cookies.get("wishlist") || "[]")

    if (isWishlisted) {
      // Remove from wishlist
      wishlist = wishlist.filter((item) => item._id !== domain._id)
      setIsWishlisted(false)
      toast({
        title: "Removed",
        description: `${domain.name} removed from wishlist.`,
      })
    } else {
      // Add to wishlist
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
      "relative group hover:shadow-sm hover:rounded-3xl transition-all duration-300 overflow-hidden  ",
      domain.isSold && "opacity-60"
    )}>
      {/* Top Image */}
      {domain.image?.length > 0 && (
        <div className="relative">
          <img
            src={domain.image[0]}
            alt={domain.name}
            className={cn(
              "w-full rounded-3xl h-44 object-cover shadow-sm transition duration-300",
              !domain.isAvailable && !domain.isSold && "blur-sm"
            )}
          />
          {/* Sold Overlay */}
          {domain.isSold && (
            <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center">
              <Badge variant="destructive" className="text-sm px-4 py-1.5">
                SOLD
              </Badge>
            </div>
          )}
        </div>
      )}

      {/* Domain Name */}
      <CardHeader className="px-3 pt-2 pb-0">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-bold text-gray-900">
            {domain.name}
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleWishlistToggle}
            className={cn("p-1", isWishlisted && "text-red-500")}
            disabled={domain.isSold || !domain.isAvailable}
          >
            <Heart className={cn("h-4 w-4", isWishlisted && "fill-current")} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="px-3 pb-0 space-y-2.5">
        {/* Provider/Status Row */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-2">
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
          <div className="flex items-center gap-1">
            <ShoppingBag className="h-3 w-3" />
            <span>{domain.registrar}</span>
          </div>
        </div>

        {/* Price & Availability */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900">
              ${domain.price.toLocaleString()}
            </span>
            {domain.Actualprice > domain.price && (
              <span className="text-sm text-gray-500 line-through">
                ${domain.Actualprice.toLocaleString()}
              </span>
            )}
          </div>
          <Badge className={cn(
            "text-xs px-2 py-1",
            domain.isAvailable ? "bg-green-600 text-white" : "bg-gray-400 text-white"
          )}>
            {domain.isAvailable ? "Available" : "Unavailable"}
          </Badge>
        </div>

        {/* SEO & Domain Metrics - 3 Columns */}
        <div className="grid grid-cols-3 gap-3 text-xs">
          {/* Column 1 */}
          <div className="space-y-2">
            <div className="flex items-center gap-1 text-gray-600">
              <TrendingUp className="h-3 w-3" />
              <span>DR: {domain.metrics.domainRank}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <Activity className="h-3 w-3" />
              <span>TF: {domain.metrics.trustFlow}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <Calendar className="h-3 w-3" />
              <span>Since {domain.metrics.year}</span>
            </div>
          </div>

          {/* Column 2 */}
          <div className="space-y-2">
            <div className="flex items-center gap-1 text-gray-600">
              <LinkIcon className="h-3 w-3" />
              <span>{domain.metrics.referringDomains} RDs</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <Flag className="h-3 w-3" />
              <span>CF: {domain.metrics.citationFlow}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <Hourglass className="h-3 w-3" />
              <span>Age: {domain.metrics.age} yrs</span>
            </div>
          </div>

          {/* Column 3 */}
          <div className="space-y-2">
            <div className="flex items-center gap-1 text-gray-600">
              <ShieldCheck className="h-3 w-3" />
              <span>DA: {domain.metrics.domainAuthority}</span>
            </div>
            {domain.type === "traffic" && domain.metrics.monthlyTraffic && (
              <div className="flex items-center gap-1 text-gray-600">
                <Globe className="h-3 w-3" />
                <span>{domain.metrics.monthlyTraffic.toLocaleString()} visits</span>
              </div>
            )}
            <div className="flex items-center gap-1 text-gray-600">
              <Languages className="h-3 w-3" />
              <span>{domain.metrics.language}</span>
            </div>
          </div>
        </div>

        {/* Tags */}
        {domain.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {domain.tags.slice(0, 4).map((tag, idx) => (
              <Badge
                key={idx}
                variant="outline"
                className="text-xs px-2 py-1 text-gray-600 border-gray-300"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <Button
            className="flex-1 h-9 text-sm bg-[#33BDC7] hover:bg-[#2caab4] text-white"
            onClick={handleAddToCart}
            disabled={domain.isSold || !domain.isAvailable}
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            Add
          </Button>
          <Button
            className="h-9 px-3 text-sm bg-red-600 hover:bg-red-700 text-white"
            onClick={handleBuyNow}
            disabled={domain.isSold || !domain.isAvailable}
          >
            Buy Now
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-9 px-3 text-sm"
            disabled={domain.isSold || !domain.isAvailable}
          >
            <a href={`/domains/${domain._id}`} className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              Details
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
