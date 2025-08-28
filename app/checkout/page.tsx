"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CheckoutForm } from "@/components/checkout/checkout-form"
import { OrderSummary } from "@/components/checkout/order-summary"
import { PaymentMethods } from "@/components/checkout/payment-methods"
import { useCart } from "@/components/providers/cart-provider"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { LiveChat } from "@/components/chat/live-chat"

export default function CheckoutPage() {
  const { items, total } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "paypal">("stripe")



  if (!user || items.length === 0) {
    return null
  }
 
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Checkout</h1>
          <p className="text-lg text-gray-600">Complete your purchase securely</p>
        </div>

        <div className="grid lg:grid-cols-1 gap-6">
          <div className="space-y-8">
            <CheckoutForm />
  
          </div>
         
        </div>
      </main>

      <Footer />
      <LiveChat />
    </div>
  )
}
