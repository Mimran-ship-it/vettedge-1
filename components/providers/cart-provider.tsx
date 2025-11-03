"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode
} from "react"
import type { CartItem } from "@/types/domain"

interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">) => CartItem | null
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  total: number
  getMostFrequentDomain: () => { id: string; name: string } | null
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart)
        if (Array.isArray(parsed)) {
          setItems(parsed)
        } else {
          console.warn("Parsed cart is not an array:", parsed)
          setItems([])
        }
      } catch (error) {
        console.error("Error parsing saved cart:", error)
        localStorage.removeItem("cart")
        setItems([])
      }
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("cart", JSON.stringify(items))
    }
  }, [items, mounted])

  /**
   * addItem: if item with same id already exists, DO NOTHING (return null).
   * Otherwise add the item with quantity = 1 and return the added CartItem.
   */
  const addItem = (newItem: Omit<CartItem, "quantity">): CartItem | null => {
    let addedItem: CartItem | null = null
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === newItem.id)
      if (existingItem) {
        // Item already in cart — do not increase count or price
        return currentItems
      }
      addedItem = { ...newItem, quantity: 1 }
      return [...currentItems, addedItem]
    })
    // Track frequency only when an item is actually added
    try {
      const key = "cartAddFrequency"
      const raw = localStorage.getItem(key)
      type FreqMap = Record<string, { count: number; name: string }>
      const map: FreqMap = raw ? JSON.parse(raw) : {}
      const entry = map[newItem.id]
      if (entry) {
        map[newItem.id] = { ...entry, count: entry.count + 1 }
      } else {
        map[newItem.id] = { count: 1, name: newItem.name }
      }
      localStorage.setItem(key, JSON.stringify(map))
    } catch (e) {
      console.warn("Failed to update cart add frequency:", e)
    }
    return addedItem
  }

  const removeItem = (id: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
      return
    }
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const total = Array.isArray(items)
    ? items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    : 0

  const getMostFrequentDomain = () => {
    try {
      const raw = localStorage.getItem("cartAddFrequency")
      if (!raw) return null
      const map: Record<string, { count: number; name: string }> = JSON.parse(raw)
      let top: { id: string; name: string } | null = null
      let max = -1
      for (const [id, { count, name }] of Object.entries(map)) {
        if (count > max) {
          max = count
          top = { id, name }
        }
      }
      return top
    } catch (e) {
      console.warn("Failed to read cart add frequency:", e)
      return null
    }
  }

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, total, getMostFrequentDomain }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
