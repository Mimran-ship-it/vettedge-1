"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CartSummary } from "@/components/cart/cart-summary"
import { CartItems } from "@/components/cart/cart-items"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { ShoppingBag } from "lucide-react"
import Link from "next/link"
import { LiveChat } from "@/components/chat/live-chat"

export default function CartPage() {
  const { items, total } = useCart()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Shopping Cart</h1>
          <p className="text-lg text-gray-600">Review your selected domains before checkout</p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Discover premium expired domains and add them to your cart</p>
            <Button size="lg" asChild>
              <Link href="/domains">Browse Domains</Link>
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <CartItems />
            </div>
            <div className="lg:col-span-1">
              <CartSummary />
            </div>
          </div>
        )}
      </main>

      <Footer />
      <LiveChat />
    </div>
  )
}
