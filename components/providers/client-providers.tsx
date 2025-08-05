"use client"

import type React from "react"
import { AuthProvider } from "@/components/providers/auth-provider"
import { CartProvider } from "@/components/providers/cart-provider"
import { ChatProvider } from "@/components/providers/chat-provider"
import { SessionProvider } from "next-auth/react"

// DEBUG: This is a client component wrapper for all context providers
console.log("DEBUG: ClientProviders - Client Component Loading")

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>
        <CartProvider>
          <ChatProvider>
            {children}
          </ChatProvider>
        </CartProvider>
      </AuthProvider>
    </SessionProvider>
  )
}