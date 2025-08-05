"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/components/providers/cart-provider"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { Loader2, Shield, CheckCircle } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"

interface OrderSummaryProps {
  paymentMethod: "stripe" | "paypal"
}

export function OrderSummary({ paymentMethod }: OrderSummaryProps) {
  const { items, total, clearCart } = useCart()
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [processing, setProcessing] = useState(false)

  const subtotal = total
  const tax = subtotal * 0.08
  const finalTotal = subtotal + tax

  const handlePayment = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to complete your purchase.",
        variant: "destructive",
      })
      return
    }

    setProcessing(true)

    try {
      // Create order first
      const orderData = {
        userId: user.id,
        customerEmail: user.email,
        customerName: user.name,
        domains: items.map((item) => ({
          domainId: item.id,
          domainName: item.name,
          price: item.price,
        })),
        totalAmount: finalTotal,
        status: "pending" as const,
        paymentMethod: paymentMethod,
        billingAddress: {
          firstName: user.name.split(" ")[0] || "",
          lastName: user.name.split(" ")[1] || "",
          email: user.email,
          company: "",
          address: "123 Main St",
          city: "San Francisco",
          zipCode: "94105",
          country: "United States",
        },
      }

      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      })

      if (!orderResponse.ok) {
        throw new Error("Failed to create order")
      }

      const order = await orderResponse.json()

      // Process payment using mock payment system
      const paymentResponse = await fetch("/api/payment/mock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: order.id,
          amount: finalTotal,
          paymentMethod: paymentMethod,
        }),
      })

      if (!paymentResponse.ok) {
        throw new Error("Payment failed")
      }

      const paymentResult = await paymentResponse.json()

      // Clear cart and show success
      clearCart()

      toast({
        title: "Payment Successful!",
        description: "Your domains have been purchased successfully. Check your email for confirmation.",
      })

      // Redirect to success page
      router.push(`/checkout/success?orderId=${order.id}`)
    } catch (error) {
      console.error("Payment error:", error)
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
    }
  }

  return (
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Order Items */}
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-start">
              <div className="flex-1">
                <div className="font-medium">{item.name}</div>
                <Badge variant="secondary" className="text-xs mt-1">
                  {item.domain?.tld}
                </Badge>
              </div>
              <div className="text-right">
                <div className="font-medium">${item.price.toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Pricing Breakdown */}
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

        {/* Demo Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div className="text-sm text-yellow-800">
            <strong>Demo Mode:</strong> This is a demonstration. No real payment will be processed.
          </div>
        </div>

        {/* Payment Button */}
        <Button className="w-full" size="lg" onClick={handlePayment} disabled={processing}>
          {processing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing Payment...
            </>
          ) : (
            <>Complete Demo Purchase</>
          )}
        </Button>

        {/* Security Info */}
        <div className="space-y-3 text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Demo environment - secure testing</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4" />
            <span>Money-back guarantee</span>
          </div>
        </div>

        <div className="text-xs text-gray-500 text-center">
          By completing this demo purchase, you agree to our Terms of Service and Privacy Policy.
        </div>
      </CardContent>
    </Card>
  )
}
