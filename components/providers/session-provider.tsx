// app/providers.tsx
"use client"

import { SessionProvider } from "next-auth/react"

export function SessProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}