"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PaymentMethods } from "./payment-methods"
import { useCart } from "@/components/providers/cart-provider" 
import { useAuth } from "@/hooks/use-auth"

export function CheckoutForm() {
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "paypal">("stripe")

  const router = useRouter()
  const { items, total, clearCart } = useCart()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [billingInfo, setBillingInfo] = useState({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  })

  const handleBillingChange = (field: string, value: string) => {
    setBillingInfo((prev) => ({ ...prev, [field]: value }))
  }

  const handlePaymentSubmit = async (paymentData: any) => {
    setLoading(true)

    try {
      // Process mock payment
      const paymentResponse = await fetch("/api/payment/mock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          currency: "USD",
          paymentMethod: paymentData,
        }),
      })

      const paymentResult = await paymentResponse.json()

      if (paymentResult.success) {
        // Create order
        const orderResponse = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items,
            total,
            billingInfo,
            paymentId: paymentResult.payment.id,
            userId: user?.id,
          }),
        })

        const order = await orderResponse.json()

        if (order.success) {
          clearCart()
          router.push(`/checkout/success?orderId=${order.orderId}`)
        } else {
          throw new Error("Failed to create order")
        }
      } else {
        throw new Error("Payment failed")
      }
    } catch (error) {
      console.error("Checkout error:", error)
      alert("Checkout failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Billing Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={billingInfo.firstName}
                  onChange={(e) => handleBillingChange("firstName", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={billingInfo.lastName}
                  onChange={(e) => handleBillingChange("lastName", e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={billingInfo.email}
                onChange={(e) => handleBillingChange("email", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={billingInfo.phone}
                onChange={(e) => handleBillingChange("phone", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={billingInfo.address}
                onChange={(e) => handleBillingChange("address", e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={billingInfo.city}
                  onChange={(e) => handleBillingChange("city", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={billingInfo.state}
                  onChange={(e) => handleBillingChange("state", e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="zipCode">ZIP Code</Label>
                <Input
                  id="zipCode"
                  value={billingInfo.zipCode}
                  onChange={(e) => handleBillingChange("zipCode", e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={billingInfo.country}
                  onChange={(e) => handleBillingChange("country", e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <PaymentMethods
  selectedMethod={paymentMethod}
  onMethodChange={setPaymentMethod}
  onPaymentSubmit={handlePaymentSubmit}
  loading={loading}
/>
      </div>

      <div>
      <Card>
  <CardHeader>
    <CardTitle>Order Summary</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="flex justify-between items-center">
          <div>
            <p className="font-medium">{item.name}</p>
            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
          </div>
          <p className="font-medium">
            ${(item.price * item.quantity).toFixed(2)}
          </p>
        </div>
      ))}

      {/* Subtotal */}
      <div className="border-t pt-4">
        <div className="flex justify-between items-center text-base">
          <span>Subtotal</span>
          <span>${total.toFixed(2)}</span>
        </div>

        {/* Tax */}
        <div className="flex justify-between items-center text-base">
          <span>Tax (8%)</span>
          <span>${(total * 0.08).toFixed(2)}</span>
        </div>

        {/* Grand Total */}
        <div className="flex justify-between items-center text-lg font-bold mt-2">
          <span>Total</span>
          <span>${(total * 1.08).toFixed(2)}</span>
        </div>
      </div>
    </div>
  </CardContent>
</Card>

      </div>
    </div>
  )
}
