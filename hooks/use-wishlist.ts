"use client"

import { useState, useEffect } from "react"
import type { Domain } from "@/types/domain"

export function useWishlist() {
  const [wishlist, setWishlist] = useState<Domain[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Load wishlist from localStorage after mount
    const saved = localStorage.getItem("wishlist")
    if (saved) {
      setWishlist(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    // Save to localStorage when wishlist changes, but only after mount
    if (mounted) {
      localStorage.setItem("wishlist", JSON.stringify(wishlist))
    }
  }, [wishlist, mounted])

  const addToWishlist = (domain: Domain) => {
    setWishlist((prev) => {
      if (prev.some((item) => item.id === domain.id)) {
        return prev
      }
      return [...prev, domain]
    })
  }

  const removeFromWishlist = (domainId: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== domainId))
  }

  const isInWishlist = (domainId: string) => {
    return wishlist.some((item) => item.id === domainId)
  }

  return {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
  }
}
