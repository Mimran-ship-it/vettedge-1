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

    // Get token from user object or localStorage (browser only)
    const token =
      (typeof window !== "undefined" ? localStorage.getItem("token") : null) ||
      (user as any)?.token

    if (!token) {
      console.warn("⚠️ No auth token found, skipping socket connection")
      return
    }

    if (socketRef.current) {
      console.log("♻️ Socket already connected, skipping new connection")
      return
    }

    console.log("🌐 Creating new socket connection...")
    const newSocket = io(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000", {
      path: "/api/socket",
      auth: { token },
      transports: ["websocket", "polling"],
      timeout: 20000,
      forceNew: true,
    })

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
