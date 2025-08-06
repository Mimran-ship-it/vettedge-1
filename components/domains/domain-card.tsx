"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart, TrendingUp, LinkIcon, Globe, Calendar } from "lucide-react"
import type { Domain } from "@/types/domain"
import { useCart } from "@/components/providers/cart-provider"
import { useWishlist } from "@/hooks/use-wishlist"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface DomainCardProps {
  domain: Domain
}

export function DomainCard({ domain }: DomainCardProps) {
  const { addItem } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { toast } = useToast()

  const domainId = domain.id 

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
      id: domainId,
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
    if (isInWishlist(domainId)) {
      removeFromWishlist(domainId)
      toast({
        title: "Removed from Wishlist",
        description: `${domain.name} has been removed from your wishlist.`,
      })
    } else {
      addToWishlist({ ...domain, id: domainId })
      toast({
        title: "Added to Wishlist",
        description: `${domain.name} has been added to your wishlist.`,
      })
    }
  }

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-all duration-300 hover:shadow-lg",
        domain.isSold && "opacity-60",
      )}
    >
      {domain.isSold && (
        <div className="absolute inset-0 bg-black/20 z-10 flex items-center justify-center">
          <Badge variant="destructive" className="text-lg px-4 py-2">
            SOLD
          </Badge>
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 mb-1">{domain.name}</CardTitle>
            <Badge variant="secondary" className="text-xs">
              {domain.tld}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleWishlistToggle}
            className={cn("p-2", isInWishlist(domainId) && "text-red-500")}
          >
            <Heart className={cn("h-4 w-4", isInWishlist(domainId) && "fill-current")} />
          </Button>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2">{domain.description}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Price */}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold  text-gray-900">${domain.price.toLocaleString()}</span>
          <Badge className="bg-[#33BDC7]" variant={domain.isAvailable ? "default" : "secondary"}>
            {domain.isAvailable ? "Available" : "Unavailable"}
          </Badge>
        </div>

        {/* SEO Metrics */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <span className="text-gray-600">DR: {domain.metrics.avgAuthorityDR}</span>
          </div>
          <div className="flex items-center space-x-2">
            <LinkIcon className="h-4 w-4 text-blue-500" />
            <span className="text-gray-600">{domain.metrics.referringDomains} RDs</span>
          </div>
          <div className="flex items-center space-x-2">
            <Globe className="h-4 w-4 text-purple-500" />
            <span className="text-gray-600">{domain.metrics.monthlyTraffic.toLocaleString()} visits</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-orange-500" />
            <span className="text-gray-600">Since {domain.metrics.year}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <Button className="flex-1 bg-[#33BDC7] hover:cursor-pointer hover:bg-[#33bdc7]" onClick={handleAddToCart} disabled={domain.isSold || !domain.isAvailable}>
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href={`/domains/${domainId}`}>View Details</a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
