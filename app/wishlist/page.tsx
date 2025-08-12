"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { DomainCard } from "@/components/domains/domain-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Heart, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { LiveChat } from "@/components/chat/live-chat"
import Cookies from "js-cookie"
import { motion, AnimatePresence } from "framer-motion"

export default function WishlistPage() {
  const { user } = useAuth()
  const router = useRouter()

  const [wishlist, setWishlist] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredDomains, setFilteredDomains] = useState<any[]>([])

  // Load wishlist from cookies
  useEffect(() => {
    const storedWishlist = Cookies.get("wishlist")
    if (storedWishlist) {
      try {
        const parsed = JSON.parse(storedWishlist)
        setWishlist(parsed)
        setFilteredDomains(parsed)
      } catch {
        console.error("Failed to parse wishlist from cookies")
      }
    }
  }, [])

  // Filter wishlist
  useEffect(() => {
    const filtered = wishlist.filter(
      (domain) =>
        domain.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        domain.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredDomains(filtered)
  }, [searchQuery, wishlist])

  

  // Animation .s (same style as Cart page)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Page Heading */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wishlist</h1>
          <p className="text-lg text-gray-600">
            Keep track of domains you're interested in ({wishlist.length} domains)
          </p>
        </motion.div>

        {/* Search Bar */}
        {wishlist.length > 0 && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search your wishlist..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </motion.div>
        )}

        {/* Wishlist Items */}
        {filteredDomains.length > 0 ? (
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {filteredDomains.map((domain) => (
              <motion.div
                key={domain._id}
                className="mb-6"
              >
                <DomainCard domain={domain} />
              </motion.div>
            ))}
          </motion.div>
        ) : wishlist.length > 0 ? (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No domains found</h3>
            <p className="text-gray-500">Try adjusting your search terms</p>
          </motion.div>
        ) : (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Heart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start adding domains to your wishlist to keep track of the ones you're interested in purchasing.
            </p>
            <Button size="lg" asChild>
              <Link href="/domains">
                <ShoppingBag className="h-5 w-5 mr-2" />
                Browse Domains
              </Link>
            </Button>
          </motion.div>
        )}
      </main>

      <Footer />
      <LiveChat />
    </div>
  )
}
