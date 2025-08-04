"use client"

import { useState, useEffect, type ReactNode } from "react"
import { AuthContext, type User } from "@/hooks/use-auth"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check for existing session only on client side
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error("Error parsing saved user:", error)
        localStorage.removeItem("user")
      }
    }
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    // Mock authentication - in real app, this would call your API
    const mockUser: User = {
      id: "1",
      name: "John Doe",
      email: email,
      role: email.includes("admin") ? "admin" : "customer",
    }

    setUser(mockUser)
    if (mounted) {
      localStorage.setItem("user", JSON.stringify(mockUser))
    }
  }

  const signUp = async (name: string, email: string, password: string) => {
    // Mock registration
    const mockUser: User = {
      id: Date.now().toString(),
      name: name,
      email: email,
      role: "customer",
    }

    setUser(mockUser)
    if (mounted) {
      localStorage.setItem("user", JSON.stringify(mockUser))
    }
  }

  const signInWithGoogle = async () => {
    // Mock Google authentication
    const mockUser: User = {
      id: "google_" + Date.now().toString(),
      name: "Google User",
      email: "user@gmail.com",
      role: "customer",
    }

    setUser(mockUser)
    if (mounted) {
      localStorage.setItem("user", JSON.stringify(mockUser))
    }
  }

  const signOut = () => {
    setUser(null)
    if (mounted) {
      localStorage.removeItem("user")
    }
  }

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <AuthContext.Provider value={{ user: null, signIn, signUp, signInWithGoogle, signOut, loading: true }}>
        {children}
      </AuthContext.Provider>
    )
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signInWithGoogle, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
