// src/context/auth-context.tsx or src/contexts/auth-context.tsx

"use client"

import { createContext } from "react"

export type User = {
  id: string
  name: string
  email: string
  role: "admin" | "customer"
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (name: string, email: string, password: string) => Promise<void>
  signOut: () => void
  signInWithGoogle: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
