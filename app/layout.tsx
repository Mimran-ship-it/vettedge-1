"use client"
import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/providers/auth-provider"
import { CartProvider } from "@/components/providers/cart-provider"
import { ChatProvider } from "@/components/providers/chat-provider"
import { StripeProvider } from "@/components/providers/stripe-provider"
import Script from "next/script"
import { WishlistProvider } from "@/components/providers/wishlist-provider"
import { LiveChat } from "@/components/chat/live-chat"
import { ThemeProvider } from "@/components/theme-provider"
import { useEffect } from "react"
import { loadStripe } from "@stripe/stripe-js"

const inter = Inter({ subsets: ["latin"] })
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function SocketInitializer() {
  useEffect(() => {
    const initializeSocket = async () => {
      try {
        await fetch("/api/socket", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
        console.log("Socket server initialized successfully")
      } catch (error) {
        console.error("Failed to initialize socket server:", error)
      }
    }

    initializeSocket()
  }, [])

  return null
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* ✅ Add favicon here */}
        <link rel="icon" href="/shihlogo.png" sizes="any"  />
       
      </head>
      <body className={inter.className}>
        <SocketInitializer />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <CartProvider>
              <ChatProvider>
                <StripeProvider>
                  <WishlistProvider>
                 
                    {children}
                 
                    <LiveChat />
                    
                  </WishlistProvider>
                </StripeProvider>
                <Script
                  src="https://accounts.google.com/gsi/client"
                  strategy="afterInteractive"
                />
                <Toaster />
              </ChatProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
