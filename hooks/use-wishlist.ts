"use client"

import { useState, useEffect, useCallback } from "react"
import type { Domain } from "@/types/domain"

export function useWishlist() {
  const [wishlist, setWishlist] = useState<Domain[]>([])
  const [mounted, setMounted] = useState(false)

  // 🔄 Load wishlist from localStorage
  const refreshWishlist = useCallback(() => {
    const saved = localStorage.getItem("wishlist")
    setWishlist(saved ? JSON.parse(saved) : [])
  }, [])

  useEffect(() => {
    setMounted(true)
    refreshWishlist()

    // ✅ Listen to localStorage changes across tabs/pages
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "wishlist") {
        refreshWishlist()
      }
    }
    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [refreshWishlist])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("wishlist", JSON.stringify(wishlist))
    }
  }, [wishlist, mounted])

  const addToWishlist = (domain: Domain) => {
    setWishlist((prev) => {
      if (prev.some((item) => item._id === domain._id)) return prev
      const updated = [...prev, domain]
      localStorage.setItem("wishlist", JSON.stringify(updated)) // 🔄 ensure localStorage updated immediately
      return updated
    })
    refreshWishlist()
  }

  const removeFromWishlist = (domainId: string) => {
    setWishlist((prev) => {
      const updated = prev.filter((item) => item._id !== domainId)
      localStorage.setItem("wishlist", JSON.stringify(updated)) // 🔄 update immediately
      return updated
    })
    refreshWishlist()
  }

  const isInWishlist = (domainId: string) => {
    return wishlist.some((item) => item._id === domainId)
  }

  return {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    refreshWishlist, // 👉 expose manually if you want to trigger refetch from UI
  }
}
