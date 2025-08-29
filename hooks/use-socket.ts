"use client"

import { useEffect, useRef, useState } from "react"
import io, { type Socket } from "socket.io-client"
import { useAuth } from "@/hooks/use-auth"

export function useSocket() {
  const [isConnected, setIsConnected] = useState(false)
  const { user } = useAuth()
  const socketRef = useRef<Socket | null>(null)


  useEffect(() => {
    console.log("🔄 useSocket effect triggered, user:", user?.name)
    
    if (!user) {
      console.log("No user, cleaning up socket")
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
      setIsConnected(false)
      return
    }

    // Get token from socket_token cookie (non-HttpOnly)
    console.log("All cookies:", document.cookie)
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('socket_token='))
      ?.split('=')[1];
    
    console.log("Extracted socket_token:", token ? "Token found" : "No token found")
    
    if (!token) {
      console.error("No socket_token found in cookies")
      console.log("Available cookies:", document.cookie.split('; '))
      return
    }

    if (socketRef.current) {
      console.log("♻️ Socket already connected, skipping new connection")
      return
    }

    console.log("🌐 Creating new socket connection...")
    const newSocket = io(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000", {
      path: "/api/socket/",
      transports: ["websocket"], // 👈 important
      auth: { token },
      timeout: 20000,
      forceNew: true,
    });

    newSocket.on("connect", () => {
      console.log("✅ Socket connected:", newSocket.id)
      setIsConnected(true)
    })

    newSocket.on("connect_error", (error: any) => {
      console.error("❌ Socket connection error:", error.message || error)
      setIsConnected(false)
    })

    newSocket.on("disconnect", (reason: string) => {
      console.log("🔌 Socket disconnected, reason:", reason)
      setIsConnected(false)
    })

    socketRef.current = newSocket

    return () => {
      console.log("🧹 Cleaning up socket connection")
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
    }
  }, [user])

  return { socket: socketRef.current, isConnected }
}
