import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/providers/auth-provider"
import { CartProvider } from "@/components/providers/cart-provider"
import { ChatProvider } from "@/components/providers/chat-provider"
import Script from "next/script"
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Vettedge.domains - Premium Expired Domains",
  description: "Discover & Buy Premium Expired Domains With Real Authority",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <ChatProvider>
             
              {children}
              <Script
          src="https://accounts.google.com/gsi/client"
          strategy="afterInteractive"
        />
              <Toaster />
            </ChatProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
