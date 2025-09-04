// Create a new file: /components/providers/wishlist-provider.tsx
"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import type { Domain } from "@/types/domain"
import Cookies from "js-cookie"

type WishlistContextType = {
  wishlist: Domain[]
  addToWishlist: (domain: Domain) => void
  removeFromWishlist: (domainId: string) => void
  isInWishlist: (domainId: string) => boolean
  wishlistCount: number
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<Domain[]>([])

  // Load wishlist from cookies on mount
  useEffect(() => {
    const savedWishlist = Cookies.get("wishlist")
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist))
      } catch (error) {
        console.error("Failed to parse wishlist from cookies:", error)
      }
    }
  }, [])

  // Save wishlist to cookies whenever it changes
  useEffect(() => {
    Cookies.set("wishlist", JSON.stringify(wishlist), { expires: 30 })
  }, [wishlist])

  const addToWishlist = (domain: Domain) => {
    setWishlist(prev => {
      if (prev.some(item => item._id === domain._id)) {
        return prev
      }
      return [...prev, domain]
    })
  }

  const removeFromWishlist = (domainId: string) => {
    setWishlist(prev => prev.filter(item => item._id !== domainId))
  }

  const isInWishlist = (domainId: string) => {
    return wishlist.some(item => item._id === domainId)
  }

  const wishlistCount = wishlist.length

  return (
    <WishlistContext.Provider value={{
      wishlist,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      wishlistCount
    }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}