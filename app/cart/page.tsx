"use client"

import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CartSummary } from "@/components/cart/cart-summary"
import { CartItems } from "@/components/cart/cart-items"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/providers/cart-provider"
import { ShoppingBag } from "lucide-react"
import Link from "next/link"
import { LiveChat } from "@/components/chat/live-chat"
import { motion } from "framer-motion"

export default function CartPage() {
  const { items, total } = useCart()

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        {/* Page Heading */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Shopping Cart</h1>
          <p className="text-lg text-gray-600">Review your selected domains before checkout</p>
        </motion.div>

        {/* Empty Cart */}
        {items.length === 0 ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">
              Discover premium expired domains and add them to your cart
            </p>
            <Button size="lg" asChild>
              <Link href="/domains">Browse Domains</Link>
            </Button>
          </motion.div>
        ) : (
          /* Cart Items & Summary with animation */
          <div className="grid lg:grid-cols-3 gap-8">
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <CartItems />
            </motion.div>

            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            >
              <CartSummary />
            </motion.div>
          </div>
        )}
      </main> 
      <Footer/>
    </div>
  )
}
