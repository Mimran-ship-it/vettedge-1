"use client"

import { useEffect, useState } from "react"
import io from "socket.io-client"
import type { Socket } from "socket.io-client"
import { useAuth } from "@/hooks/use-auth"

export function useSocket() {
  const [socket, setSocket] = useState<any>(null)
  const [isConnected, setIsConnected] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    console.log("useSocket effect triggered, user:", user?.name)
    
    if (!user) {
      console.log("No user, cleaning up socket")
      if (socket) {
        socket.disconnect()
        setSocket(null)
      }
      setIsConnected(false)
      return
    }

    const token = localStorage.getItem("token")
    if (!token) {
      console.error("No auth token found")
      return
    }

    console.log("Creating new socket connection...")
    console.log("Socket URL:", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000")
    console.log("Token available:", !!token)
    
    const newSocket = io(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000", {
      path: "/api/socket",
      auth: {
        token: token
      },
      transports: ["polling", "websocket"],
      timeout: 20000,
      forceNew: true
    })

    newSocket.on("connect", () => {
      console.log("✅ Socket connected successfully:", newSocket.id)
      console.log("Socket connected state:", newSocket.connected)
      setIsConnected(true)
    })

    newSocket.on("connect_error", (error: any) => {
      console.error("❌ Socket connection error:", error)
      setIsConnected(false)
    })

    newSocket.on("error", (error: any) => {
      console.error("❌ Socket error:", error)
    })

    newSocket.on("disconnect", (reason: string) => {
      console.log("🔌 Socket disconnected, reason:", reason)
      setIsConnected(false)
    })

    setSocket(newSocket)

    return () => {
      console.log("Cleaning up socket connection")
      newSocket.disconnect()
    }
  }, [user])

  return { socket, isConnected }
}
