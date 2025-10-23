"use client"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import { useState, useEffect, useMemo } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { DomainCard } from "@/components/domains/domain-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Heart, ShoppingBag, AlertCircle, Trash2 } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useWishlist } from "@/components/providers/wishlist-provider"

import type { Domain } from "@/types/domain"

export default function WishlistPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { wishlistIds, removeFromWishlist } = useWishlist()
  const [domains, setDomains] = useState<Domain[]>([])
  const [unavailableDomains, setUnavailableDomains] = useState<Domain[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // Get wishlist IDs for comparison
  const wishlistIdsMemo = useMemo(() => wishlistIds, [wishlistIds])

  // Compute filtered domains based on search query
  const filteredDomains = useMemo(() => {
    if (!searchQuery) return domains

    return domains.filter(domain =>
      domain.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      domain.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [domains, searchQuery])

  useEffect(() => {
    async function fetchLatestDomains() {
      setIsLoading(true)

      // Check if wishlist has items
      if (!wishlistIds || wishlistIds.length === 0) {
        setDomains([])
        setUnavailableDomains([])
        setIsLoading(false)
        return
      }

      try {
        const ids = wishlistIds
        const res = await fetch(`/api/domains?ids=${ids.join(",")}`)

        if (!res.ok) {
          throw new Error('Failed to fetch domains')
        }

        const freshDomains = await res.json()

        // Separate available and unavailable domains
        const available: Domain[] = []
        const unavailable: Domain[] = []

        freshDomains.forEach((domain: Domain) => {
          if (ids.includes(domain._id)) {
            // Check if domain is sold or not available
            if (domain.isSold || !domain.isAvailable) {
              unavailable.push(domain)
            } else {
              available.push(domain)
            }
          }
        })

        // Find IDs that didn't return a domain (deleted)
        const missingIds = ids.filter(id => !freshDomains.some((fetched: Domain) => fetched._id === id))
        const missingDomains: Domain[] = missingIds.map((id: string) => ({
          _id: id,
          name: "Unavailable domain",
          description: "This domain is no longer available.",
          price: 0,
          Actualprice: 0,
          type: "",
          registrar: "",
          tags: [],
          image: [],
          isAvailable: false,
          isSold: true,
          isHot: false,
          metrics: {
            domainRank: 0,
            referringDomains: 0,
            authorityLinks: [],
            authorityLinksCount: 0,
            avgAuthorityDR: 0,
            domainAuthority: 0,
            score: 0,
            trustFlow: 0,
            citationFlow: 0,
            monthlyTraffic: null,
            year: 0,
            age: 0,
            language: ""
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as Domain))

        setDomains(available)
        setUnavailableDomains([...unavailable, ...missingDomains])
      } catch (error) {
        console.error('Error fetching wishlist domains:', error)
        // Fallback: show nothing but keep count
        setDomains([])
        setUnavailableDomains([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchLatestDomains()
  }, [wishlistIdsMemo])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    },
  }

  const handleRemoveUnavailable = () => {
    if (confirm(`Are you sure you want to remove ${unavailableDomains.length} unavailable domain${unavailableDomains.length > 1 ? 's' : ''} from your wishlist?`)) {
      unavailableDomains.forEach(domain => {
        removeFromWishlist(domain._id)
      })
    }
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      
      
      <div className="flex-1 md:pl-6">
    
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">My Wishlist</h1>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Keep track of domains you're interested in 
                  <span className="font-semibold text-blue-600 dark:text-blue-400 ml-1">
                    ({wishlistIds?.length || 0} domains)
                  </span>
                  {unavailableDomains.length > 0 && (
                    <span className="text-sm text-orange-500 ml-2">
                      ({unavailableDomains.length} no longer available)
                    </span>
                  )}
                </p>
              </div>
            </div>

            {wishlistIds && wishlistIds.length > 0 && (
              <div className="relative max-w-md mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
                <Input
                  placeholder="Search your wishlist..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-16 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">Loading your wishlist...</p>
            </div>
          ) : (
            <>
              {/* Unavailable domains section */}
              {unavailableDomains.length > 0 && (
                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-6 mb-8 shadow-sm">
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                    <div className="flex items-start">
                      <AlertCircle className="h-6 w-6 text-orange-500 mt-0.5 mr-3 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-lg text-orange-800 dark:text-orange-300 mb-1">
                          {unavailableDomains.length} domain{unavailableDomains.length > 1 ? 's' : ''} no longer available
                        </h3>
                        <p className="text-orange-700 dark:text-orange-400 mb-3">
                          {unavailableDomains.length > 1 ? 'These domains are' : 'This domain is'} no longer available for purchase.
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={handleRemoveUnavailable}
                      className="flex items-center gap-1 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove All
                    </Button>
                  </div>
                </div>
              )}

              {/* Available domains */}
              {filteredDomains.length > 0 ? (
                <div className="grid md:grid-cols-2 me-16  gap-10">
                  {filteredDomains.map((domain) => (
                    <motion.div 
                      key={domain._id} 
                      className="mb-6"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <DomainCard domain={domain} />
                    </motion.div>
                  ))}
                </div>
              ) : (wishlistIds && wishlistIds.length > 0) ? (
                // Only show "no domains found" if there are no unavailable domains
                unavailableDomains.length === 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-12 text-center">
                    <Search className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No domains found</h3>
                    <p className="text-gray-500 dark:text-gray-400">Try adjusting your search terms</p>
                  </div>
                )
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-16 text-center">
                  <Heart className="h-24 w-24 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
                  <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Your wishlist is empty</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
                    Start adding domains to your wishlist to keep track of the ones you're interested in purchasing.
                  </p>
                  <Button size="lg" asChild className="dark:bg-blue-600 dark:hover:bg-blue-700 shadow-md hover:shadow-lg transition-shadow">
                    <Link href="/domains">
                      <ShoppingBag className="h-5 w-5 mr-2" />
                      Browse Domains
                    </Link>
                  </Button>
                </div>
              )}
            </>
          )}
        </main>
        
      </div>
    </div>
  )
}