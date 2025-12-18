"use client"
import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CartSummary } from "@/components/cart/cart-summary"
import { CartItems } from "@/components/cart/cart-items"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/providers/cart-provider"
import { ShoppingBag, AlertCircle, X } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import type { CartItem } from "@/types/domain"

export default function CartPage() {
  const { items, total, removeItem } = useCart()
  const [isLoading, setIsLoading] = useState(true)
  const [unavailableItems, setUnavailableItems] = useState<CartItem[]>([])
  const [availableItems, setAvailableItems] = useState<CartItem[]>([])
  
  // New state to track if we've finished the initial client-side hydration
  const [isHydrated, setIsHydrated] = useState(false)

  // 1. Wait for mount and a small tick for localStorage to populate
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHydrated(true)
    }, 100) // Small buffer to allow useCart to read from localStorage

    return () => clearTimeout(timer)
  }, [])

  // 2. Main Logic: Check availability only after hydration or if items exist
  useEffect(() => {
    async function checkItemAvailability() {
      // If we have items, we know we are loaded. 
      // If we don't have items, we must wait for 'isHydrated' to be true before assuming it's empty.
      if (items.length === 0) {
        if (isHydrated) {
          setIsLoading(false)
        }
        return
      }

      // If items exist, we can proceed with checking them immediately
      try {
        const ids = items.map(item => item.id)
        const res = await fetch(`/api/domains?ids=${ids.join(",")}`)
        
        if (!res.ok) {
          throw new Error('Failed to check domain availability')
        }
        
        const domains = await res.json()
        
        // Separate available and unavailable items
        const available: CartItem[] = []
        const unavailable: CartItem[] = []
        
        items.forEach(cartItem => {
          const domain = domains.find((d: any) => d._id === cartItem.id)
          
          // Check if domain exists, is not sold, and is marked available
          if (domain && !domain.isSold && domain.isAvailable) {
            available.push(cartItem)
          } else {
            unavailable.push(cartItem)
          }
        })
        
        setAvailableItems(available)
        setUnavailableItems(unavailable)
      } catch (error) {
        console.error('Error checking domain availability:', error)
        // If API fails, assume all items are available to prevent blocking purchase (or handle differently)
        setAvailableItems(items)
        setUnavailableItems([])
      } finally {
        setIsLoading(false)
      }
    }
    
    checkItemAvailability()
  }, [items, isHydrated]) // Re-run when items change or hydration finishes
  
  const handleRemoveUnavailable = () => {
    unavailableItems.forEach(item => removeItem(item.id))
    setUnavailableItems([])
  }
  
  const handleRemoveSingleItem = (id: string) => {
    removeItem(id)
    setUnavailableItems(prev => prev.filter(item => item.id !== id))
  }
  
  // Calculate total for available items only
  const availableTotal = availableItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        {/* Page Heading */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Shopping Cart</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">Review your selected domains before checkout</p>
        </motion.div>
        
        {/* Unavailable Items Alert */}
        {unavailableItems.length > 0 && (
          <motion.div
            className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Some items in your cart are no longer available</h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                  <p>The following domains have been sold and cannot be purchased:</p>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    {unavailableItems.map(item => (
                      <li key={item.id} className="flex items-center justify-between">
                        <span>{item.name}</span>
                        <button 
                          onClick={() => handleRemoveSingleItem(item.id)}
                          className="text-red-600 hover:text-red-800 ml-2"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-4">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={handleRemoveUnavailable}
                    className="text-red-700 dark:text-red-300 border-red-300 dark:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/30"
                  >
                    Remove All Unavailable Items
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Loading State */}
        {isLoading ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="animate-spin full h-12 w-12 border-b-2 border-gray-900 dark:border-white mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Checking cart items availability...</p>
          </motion.div>
        ) : (
          /* Cart Content */
          <>
            {/* Empty Cart */}
            {availableItems.length === 0 && unavailableItems.length === 0 ? (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Your cart is empty</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                  Discover premium Aged Domains and add them to your cart
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
                  <CartItems items={availableItems} />
                </motion.div>
                <motion.div
                  className="lg:col-span-1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
                >
                  <CartSummary 
                    total={availableTotal} 
                    items={availableItems} 
                    hasUnavailableItems={unavailableItems.length > 0} 
                  />
                </motion.div>
              </div>
            )}
          </>
        )}
      </main> 
      <Footer/>
    </div>
  )
}