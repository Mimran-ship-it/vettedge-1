// components/providers/auth-provider.tsx
"use client"

import React, { useEffect, useState, Suspense } from "react"
import { AuthContext, type User } from "@/hooks/use-auth"
import { useRouter, useSearchParams } from "next/navigation"
import { signIn as nextAuthSignIn } from "next-auth/react"

interface AuthProviderProps {
  children: React.ReactNode
}

// Component that actually uses useSearchParams
function AuthProviderInner({ children }: AuthProviderProps) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me")
        const data = await res.json()
        setUser(data.user || null)
        console.log("user fetched", data.user)
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

  const signInWithGoogle = async () => {
    try {
      const redirect = searchParams?.get("redirect") || "/"

      // prevent auto redirect
      const result = await nextAuthSignIn("google", {
        callbackUrl: redirect,
        redirect: false,
      })

      console.log("setting user")
      // now call your API
      const meRes = await fetch("/api/auth/me")
      const meData = await meRes.json()
      setUser({
        ...meData.user,
        role: meData.user.role || "customer",
      })
    

      console.log("user set", meData.user)

      // finally, redirect manually
      router.push(redirect)
    } catch (err) {
      console.error("Google sign in error:", err)
    }
  }

  const signOut = () => {
    fetch("/api/auth/signout", { method: "POST" })
    window.location.href = "/"
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, signIn, signOut, signInWithGoogle }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Exported provider wrapped in Suspense
export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <Suspense fallback={null}>
      <AuthProviderInner>{children}</AuthProviderInner>
    </Suspense>
  )
}
