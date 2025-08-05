"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, TrendingUp, LinkIcon, Globe, Calendar } from "lucide-react"
import { useCart } from "@/components/providers/cart-provider"
import { useToast } from "@/hooks/use-toast"

export function CartItems() {
  const { items, removeItem, updateQuantity } = useCart()
  const { toast } = useToast()

  const handleRemoveItem = (id: string, name: string) => {
    removeItem(id)
    toast({
      title: "Removed from Cart",
      description: `${name} has been removed from your cart.`,
    })
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Cart Items ({items.length})</h2>

      {items.map((item) => (
        <Card key={item.id} className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.name}</h3>
                <Badge variant="secondary" className="text-xs mb-2">
                  {item.domain?.tld}
                </Badge>
                <p className="text-sm text-gray-600 mb-3">{item.domain?.description}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900 mb-2">${item.price.toLocaleString()}</div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveItem(item.id, item.name)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Domain Metrics */}
            {item.domain?.metrics && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <div>
                    <div className="font-medium">Domain Rank</div>
                    <div className="text-gray-600">{item.domain.metrics.domainRank}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <LinkIcon className="h-4 w-4 text-blue-500" />
                  <div>
                    <div className="font-medium">Referring Domains</div>
                    <div className="text-gray-600">{item.domain.metrics.referringDomains}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Globe className="h-4 w-4 text-purple-500" />
                  <div>
                    <div className="font-medium">Monthly Traffic</div>
                    <div className="text-gray-600">{item.domain.metrics.monthlyTraffic.toLocaleString()}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="h-4 w-4 text-orange-500" />
                  <div>
                    <div className="font-medium">Authority DR</div>
                    <div className="text-gray-600">{item.domain.metrics.avgAuthorityDR}</div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
