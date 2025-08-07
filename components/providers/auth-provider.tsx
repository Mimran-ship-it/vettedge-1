// components/providers/auth-provider.tsx
"use client"

import React, { useEffect, useState } from "react"
import { AuthContext, type User } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router=useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me")
        const data = await res.json()
        setUser(data.user || null)
      } catch {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [])

  const signIn = async (email: string, password: string): Promise<User> => {
    const res = await fetch("/api/auth/signin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    if (!res.ok) {
      const data = await res.json()
      throw new Error(data?.error || "Sign in failed")
    }

    // After login, fetch user again
    const meRes = await fetch("/api/auth/me")
    const meData = await meRes.json()
    setUser(meData.user)
    return meData.user
  }

  const signOut = () => {
    // Add this route too — it will clear the token cookie
    fetch("/api/auth/signout", { method: "POST" })
    router.push('/')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
