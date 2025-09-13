"use client"
import { useState, useEffect, ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCart } from "@/components/providers/cart-provider"
import { useAuth } from "@/hooks/use-auth"

// Cart Item Type
interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

// Billing Info Type
interface BillingInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

export function CheckoutForm() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { items, total, clearCart } = useCart() as {
    items: CartItem[]
    total: number
    clearCart: () => void
  }
  const { user } = useAuth() as {
    user: { id: string; name: string; email: string } | null
  }
  
  const [billingInfo, setBillingInfo] = useState<BillingInfo>({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ")[1] || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  })

  // State to track form validity
  const [isFormValid, setIsFormValid] = useState(false)

  // ✅ Verify product prices on page load
  useEffect(() => {
    const verifyPrices = async () => {
      if (items.length === 0) return
      try {
        const res = await fetch("/api/domains")
        const domains: { _id: string; price: number }[] = await res.json()
        let priceMismatch = false
        items.forEach((cartItem) => {
          const domainData = domains.find((d) => d._id === cartItem.id)
          if (!domainData || cartItem.price !== domainData.price) {
            priceMismatch = true
          }
        })
        if (priceMismatch) {
          alert("Some product prices have changed. Please review your cart.")
          clearCart()
          localStorage.removeItem("cart")
        }
      } catch (err) {
        console.error("Price verification failed:", err)
      }
    }
    verifyPrices()
  }, [items, clearCart])

  // Check form validity whenever billingInfo changes
  useEffect(() => {
    const isValid = Object.values(billingInfo).every(value => value.trim() !== "")
    setIsFormValid(isValid)
  }, [billingInfo])

  const handleBillingChange = (field: keyof BillingInfo, value: string) => {
    setBillingInfo((prev) => ({ ...prev, [field]: value }))
  }

  const handlePaymentSubmit = async () => {
    setLoading(true)
    try {
      // ✅ Create checkout session on backend
      const response = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          billingInfo,
          userId: user?.id,
        }),
      })
      const data = await response.json()
      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url
      } else { 
        throw new Error("Checkout session creation failed")
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
      {/* Billing Info */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Billing Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={billingInfo.firstName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleBillingChange("firstName", e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={billingInfo.lastName}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleBillingChange("lastName", e.target.value)
                  }
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={billingInfo.email}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleBillingChange("email", e.target.value)
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                value={billingInfo.phone}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleBillingChange("phone", e.target.value)
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                value={billingInfo.address}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleBillingChange("address", e.target.value)
                }
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={billingInfo.city}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleBillingChange("city", e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={billingInfo.state}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleBillingChange("state", e.target.value)
                  }
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="zipCode">ZIP Code *</Label>
                <Input
                  id="zipCode"
                  value={billingInfo.zipCode}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleBillingChange("zipCode", e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  value={billingInfo.country}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleBillingChange("country", e.target.value)
                  }
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Order Summary */}
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
                    <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-base">
                  <span className="text-gray-900 dark:text-white">Subtotal</span>
                  <span className="text-gray-900 dark:text-white">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-base">
                  <span className="text-gray-900 dark:text-white">Tax (8%)</span>
                  <span className="text-gray-900 dark:text-white">${(total * 0.08).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold mt-2">
                  <span className="text-gray-900 dark:text-white">Total</span>
                  <span className="text-gray-900 dark:text-white">${(total * 1.08).toFixed(2)}</span>
                </div>
              </div>
              
              {/* Only show the Pay Now button if all fields are filled */}
              {isFormValid && (
                <button
                  disabled={loading}
                  onClick={handlePaymentSubmit}
                  className="w-full bg-black dark:bg-white dark:text-black text-white py-3 rounded-lg mt-4 disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Pay Now"}
                </button>
              )}
              
              {/* Show a message if form is not complete */}
              {!isFormValid && (
                <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-200 rounded-lg text-sm">
                  Please complete all required fields to proceed with payment.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}