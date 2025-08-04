"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { CreditCard, Shield } from "lucide-react"

export function CartSummary() {
  const { items, total } = useCart()
  const { user } = useAuth()
  const router = useRouter()

  const subtotal = total
  const tax = subtotal * 0.08 // 8% tax
  const finalTotal = subtotal + tax

  const handleCheckout = () => {
    if (!user) {
      router.push("/auth/signin?redirect=/checkout")
      return
    }
    router.push("/checkout")
  }

  return (
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5" />
          <span>Order Summary</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal ({items.length} items)</span>
            <span>${subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>${finalTotal.toLocaleString()}</span>
          </div>
        </div>

        <Button className="w-full" size="lg" onClick={handleCheckout} disabled={items.length === 0}>
          Proceed to Checkout
        </Button>

        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
          <Shield className="h-4 w-4" />
          <span>Secure checkout with SSL encryption</span>
        </div>

        <div className="text-xs text-gray-500 text-center">
          By proceeding to checkout, you agree to our Terms of Service and Privacy Policy.
        </div>
      </CardContent>
    </Card>
  )
}
