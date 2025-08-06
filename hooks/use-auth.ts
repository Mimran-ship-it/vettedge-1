// hooks/use-auth.ts
"use client"

import { createContext, useContext } from "react"

export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "customer" | string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<User>
  signUp?: (...args: any[]) => void
  signOut: () => void
  signInWithGoogle?: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
