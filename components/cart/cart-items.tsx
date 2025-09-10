"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, TrendingUp, LinkIcon, Globe, Calendar, AlertCircle } from "lucide-react"
import { useCart } from "@/components/providers/cart-provider"
import { useToast } from "@/hooks/use-toast"
import type { CartItem } from "@/types/domain"

interface CartItemsProps {
  items: CartItem[]
  onRemoveItem?: (id: string, name: string) => void
}

export function CartItems({ items, onRemoveItem }: CartItemsProps) {
  const { removeItem, updateQuantity } = useCart()
  const { toast } = useToast()

  const handleRemoveItem = (id: string, name: string) => {
    removeItem(id)
    toast({
      title: "Removed from Cart",
      description: `${name} has been removed from your cart.`,
    })
    
    // Also call the parent's onRemoveItem if provided
    if (onRemoveItem) {
      onRemoveItem(id, name)
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Cart Items ({items.length})</h2>
      {items.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-500">Your cart is empty</p>
        </Card>
      ) : (
        items.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-start gap-2">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.name}</h3>
                    {item.isSold && (
                      <Badge variant="destructive" className="text-xs flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        <span>Sold</span>
                      </Badge>
                    )}
                  </div>
                  <Badge variant="secondary" className="text-xs mb-2">
                    {item.domain?.registrar}
                  </Badge>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.domain?.description}</p>
                </div>
                <div className="flex flex-col sm:items-end gap-2">
                  <div className="text-xl sm:text-2xl font-bold text-gray-900">${item.price.toLocaleString()}</div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveItem(item.id, item.name)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 self-start sm:self-auto"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    <span>Remove</span>
                  </Button>
                </div>
              </div>
              
              {/* Sold Item Notice */}
              {item.isSold && (
                <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center text-red-800">
                    <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="text-sm font-medium">This domain has been sold and is no longer available for purchase.</span>
                  </div>
                </div>
              )}
              
              {/* Domain Metrics */}
              {item.domain?.metrics && (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-xs text-gray-500">Domain Rank</div>
                      <div className="text-gray-800">{item.domain.metrics.domainRank}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <LinkIcon className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-xs text-gray-500">Referring Domains</div>
                      <div className="text-gray-800">{item.domain.metrics.referringDomains}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Globe className="h-4 w-4 text-purple-500 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-xs text-gray-500">Monthly Traffic</div>
                      {item.domain.metrics.monthlyTraffic ? (
                        <div className="text-gray-800">{item.domain.metrics.monthlyTraffic.toLocaleString()}</div>
                      ) : (
                        <div className="text-gray-800">N/A</div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4 text-orange-500 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-xs text-gray-500">Authority DR</div>
                      <div className="text-gray-800">{item.domain.metrics.avgAuthorityDR}</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}