// Create a new file: /components/providers/wishlist-provider.tsx
"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import Cookies from "js-cookie"

type WishlistContextType = {
  wishlistIds: string[]
  addToWishlist: (domainId: string) => void
  removeFromWishlist: (domainId: string) => void
  isInWishlist: (domainId: string) => boolean
  clearWishlist: () => void
  wishlistCount: number
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  // Store only IDs to keep cookie size small
  const [wishlistIds, setWishlistIds] = useState<string[]>([])

  // Load wishlist from cookies on mount
  useEffect(() => {
    const savedWishlist = Cookies.get("wishlist")
    if (savedWishlist) {
      try {
        const parsed = JSON.parse(savedWishlist)
        // Backward compatibility: if we previously stored full domain objects, map to IDs
        const ids = Array.isArray(parsed)
          ? parsed.map((item: any) => (typeof item === "string" ? item : item?._id)).filter(Boolean)
          : []
        setWishlistIds(ids)
      } catch (error) {
        console.error("Failed to parse wishlist from cookies:", error)
      }
    }
  }, [])

  // Save wishlist to cookies whenever it changes
  useEffect(() => {
    Cookies.set("wishlist", JSON.stringify(wishlistIds), { expires: 30 })
  }, [wishlistIds])

  const addToWishlist = (domainId: string) => {
    setWishlistIds(prev => {
      if (prev.includes(domainId)) return prev
      return [...prev, domainId]
    })
  }

  const removeFromWishlist = (domainId: string) => {
    setWishlistIds(prev => prev.filter(id => id !== domainId))
  }

  const isInWishlist = (domainId: string) => {
    return wishlistIds.includes(domainId)
  }

  const clearWishlist = () => setWishlistIds([])

  const wishlistCount = wishlistIds.length

  return (
    <WishlistContext.Provider value={{
      wishlistIds,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      clearWishlist,
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