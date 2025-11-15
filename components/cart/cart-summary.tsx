"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { CreditCard, Shield, AlertTriangle } from "lucide-react"
import type { CartItem } from "@/types/domain"

interface CartSummaryProps {
  items: CartItem[]
  total: number
  hasUnavailableItems?: boolean
}

export function CartSummary({ items, total, hasUnavailableItems = false }: CartSummaryProps) {
  const { user } = useAuth()
  const router = useRouter()
  
  const subtotal = total
  const tax = subtotal * 0.08 // 8% tax
  const finalTotal = subtotal 
  
  const handleCheckout = () => {
    if (!user) {
      router.push("/auth/signin?redirect=/checkout")
      return
    }
    router.push("/checkout")
  }

  // Count available items (not sold)
  const availableItemsCount = items.filter(item => !item.isSold).length

  return (
    <Card className="sticky top-8 dark:bg-gray-800 dark:border-gray-700">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5" />
          <span>Order Summary</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasUnavailableItems && (
          <div className="p-3 bg-amber-50 dark:bg-amber-900/20  border border-amber-200 dark:border-amber-700">
            <div className="flex items-center text-amber-800 dark:text-amber-200">
              <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="text-sm font-medium">Some items in your cart are no longer available</span>
            </div>
          </div>
        )}
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-900 dark:text-gray-100">Subtotal ({availableItemsCount} items)</span>
            <span className="text-gray-900 dark:text-gray-100">${subtotal.toLocaleString()}</span>
          </div>
          {/* <div className="flex justify-between text-sm">
            <span className="text-gray-900 dark:text-gray-100">Tax</span>
            <span className="text-gray-900 dark:text-gray-100">${tax.toFixed(2)}</span>
          </div> */}
          <Separator />
          <div className="flex justify-between font-semibold text-lg">
            <span className="text-gray-900 dark:text-white">Total</span>
            <span className="text-gray-900 dark:text-white">${finalTotal.toLocaleString()}</span>
          </div>
        </div>
        
        <Button 
          className="w-full" 
          size="lg" 
          onClick={handleCheckout} 
          disabled={availableItemsCount === 0}
        >
          {availableItemsCount === 0 ? "No Available Items" : "Proceed to Checkout"}
        </Button>
        
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
          <Shield className="h-4 w-4" />
          <span>Secure checkout with SSL encryption</span>
        </div>
        
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          By proceeding to checkout, you agree to our Terms of Service and Privacy Policy.
        </div>
      </CardContent>
    </Card>
  )
}