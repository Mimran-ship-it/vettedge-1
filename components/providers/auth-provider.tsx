// components/providers/auth-provider.tsx
"use client"

import React, { useEffect, useState } from "react"
import { SessionProvider, useSession } from "next-auth/react"
import { signIn as nextAuthSignIn, signOut as nextAuthSignOut } from "next-auth/react"
import { AuthContext, type User } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  return (
    <SessionProvider>
      <AuthProviderContent>
        {children}
      </AuthProviderContent>
    </SessionProvider>
  )
}

function AuthProviderContent({ children }: AuthProviderProps) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const loading = status === "loading"

  useEffect(() => {
    if (session?.user) {
      // Map NextAuth session user to our User type
      const mappedUser: User = {
        id: session.user.id,
        name: session.user.name || "",
        email: session.user.email || "",
        role: session.user.role || "customer"
      }
      setUser(mappedUser)
    } else {
      setUser(null)
    }
  }, [session])

  const signIn = async (email: string, password: string): Promise<User> => {
    // For credentials login, we'll use our existing API
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
    await nextAuthSignIn("google");
  };

 const signOut = async () => {
  await nextAuthSignOut({ callbackUrl: "/" }); // Redirect to home after sign out
  setUser(null);
};

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  )
}
