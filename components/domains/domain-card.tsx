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
  ExternalLink,
  Tag,
  DollarSign,
} from "lucide-react"
import type { Domain } from "@/types/domain"
import { useCart } from "@/components/providers/cart-provider"
import { useWishlist } from "@/hooks/use-wishlist"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

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
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { toast } = useToast()

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

  const handleWishlistToggle = () => {
    if (isInWishlist(domain._id)) {
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

  return (
    <Card
      className={cn(
        "relative group hover:shadow-lg transition-shadow overflow-hidden border border-gray-200 rounded-lg",
        domain.isSold && "opacity-60"
      )}
    >
      {/* Top Image */}
      {domain.image?.length > 0 && (
        <img
          src={domain.image[0]}
          alt={domain.name}
          className="w-full h-36 object-cover"
        />
      )}

      {/* Sold Overlay */}
      {domain.isSold && (
        <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center">
          <Badge variant="destructive" className="text-sm px-4 py-1.5">
            SOLD
          </Badge>
        </div>
      )}

      {/* Card Body */}
      <CardHeader className="relative z-20 px-3 pt-3 pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-base font-semibold text-gray-900">
              {domain.name}
            </CardTitle>
            <div className="flex flex-wrap gap-1 mt-1">
              <Badge variant="secondary" className="text-[10px]">
                {domain.type}
              </Badge>
              <Badge variant="outline" className="text-[10px] flex items-center gap-1">
                <Building className="h-3 w-3" /> {domain.registrar}
              </Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleWishlistToggle}
            className={cn("p-1", isInWishlist(domain._id) && "text-red-500")}
          >
            <Heart
              className={cn("h-4 w-4", isInWishlist(domain._id) && "fill-current")}
            />
          </Button>
        </div>
        <p className="text-xs text-gray-600 line-clamp-2 mt-1">
          {domain.description}
        </p>
      </CardHeader>

      <CardContent className="relative z-20 px-3 pb-3 space-y-3">
        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-base font-semibold text-gray-900">
              ${domain.price}
            </span>
            {domain.Actualprice > domain.price && (
              <span className="text-xs text-gray-500 line-through">
                ${domain.Actualprice}
              </span>
            )}
          </div>
          <Badge
            className={cn(
              "text-[10px] px-2 py-0.5",
              domain.isAvailable ? "bg-green-600" : "bg-gray-400"
            )}
          >
            {domain.isAvailable ? "Available" : "Unavailable"}
          </Badge>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-2 text-[11px]">
          <Metric icon={TrendingUp} label={`DR: ${domain.metrics.avgAuthorityDR}`} />
          <Metric icon={LinkIcon} label={`${domain.metrics.referringDomains} RDs`} />
          <Metric icon={ShieldCheck} label={`DA: ${domain.metrics.domainAuthority}`} />
          <Metric icon={Activity} label={`TF: ${domain.metrics.trustFlow}`} />
          <Metric icon={Flag} label={`CF: ${domain.metrics.citationFlow}`} />
          {domain.type === "traffic" && domain.metrics.monthlyTraffic && (
            <Metric
              icon={Globe}
              label={`${domain.metrics.monthlyTraffic.toLocaleString()} visits`}
            />
          )}
          <Metric icon={Calendar} label={`Since ${domain.metrics.year}`} />
          <Metric icon={Hourglass} label={`Age: ${domain.metrics.age} yrs`} />
          <Metric icon={Languages} label={domain.metrics.language} />
        </div>

        {/* Authority Links */}
        {domain.metrics.authorityLinks?.length > 0 && (
          <div className="pt-1">
            <p className="text-xs font-medium text-gray-700 mb-1 flex items-center gap-1">
              <ExternalLink className="h-3 w-3" /> Authority Links:
            </p>
            <div className="flex flex-wrap gap-1">
              {domain.metrics.authorityLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-blue-600 hover:underline truncate max-w-[120px]"
                  title={link}
                >
                  {link.replace(/^https?:\/\//, "")}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {domain.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {domain.tags.map((tag, idx) => (
              <Badge
                key={idx}
                variant="outline"
                className="text-[10px] flex items-center gap-1"
              >
                <Tag className="h-3 w-3" /> {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <Button
            className="flex-1 h-8 text-xs bg-[#33BDC7] hover:bg-[#2caab4]"
            onClick={handleAddToCart}
            disabled={domain.isSold || !domain.isAvailable}
          >
            <ShoppingCart className="h-3 w-3 mr-1" />
            Add
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs px-2"
            asChild
          >
            <a href={`/domains/${domain._id}`}>Details</a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function Metric({
  icon: Icon,
  label,
}: {
  icon: React.ElementType
  label: string
}) {
  return (
    <div className="flex items-center space-x-1 text-gray-600">
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </div>
  )
}
