// hooks/use-auth.ts
"use client"

import { createContext, useContext } from "react"

export interface User {
  id: string
  name: string
  email: string
  image?: string
  role: "admin" | "customer"
  billingAddress?: {
    address: string
    city: string
    state: string
    zipCode: string
    country: string
    phone: string
  }
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<User>
  signUp: (name: string, email: string, password: string) => Promise<User>
  signOut: () => void
  signInWithGoogle: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
