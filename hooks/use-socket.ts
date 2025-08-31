// hooks/use-socket.ts
"use client"
import { useEffect, useRef, useState } from "react"
import { io, Socket } from "socket.io-client"
import { useAuth } from "./use-auth"

export function useSocket() {
  const { user } = useAuth()
const [socket, setSocket] = useState<typeof Socket | null>(null)
const socketRef = useRef<typeof Socket | null>(null) 
const [isConnected, setIsConnected] = useState(false)
const [connectionError, setConnectionError] = useState<string | null>(null)
const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'connected' | 'disconnected'>('idle')
  // const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    // Only create socket if user is authenticated
    if (!user) {
      console.log("🚫 No user, cleaning up socket")
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
        setSocket(null)
        setIsConnected(false)
        setConnectionStatus('disconnected')
      }
      return
    }

    // Get the token from cookies
    const getAuthToken = () => {
      console.log("🔍 Looking for token in cookies...")
      const cookies = document.cookie.split(';')
      console.log("🍪 Found cookies:", cookies)
      const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='))
      if (tokenCookie) {
        const token = tokenCookie.split('=')[1]
        console.log("✅ Token found:", token.substring(0, 20) + "...")
        return token
      }
      console.log("❌ No token found in cookies")
      return null
    }

    const token = getAuthToken()

    if (!token) {
      console.warn("⚠️ No authentication token found for socket")
      setConnectionError("No authentication token found")
      return
    }

    console.log("🔄 useSocket effect triggered, user:", user.name)
    setConnectionStatus('connecting')

    // Initialize socket
    const socketInstance = io(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000", {
      path: "/api/socket",
      transports: ["websocket", "polling"],
      timeout: 15000, // Increased timeout
      forceNew: true,
      auth: {
        token: token
      }
    })

    socketRef.current = socketInstance

    socketInstance.on("connect", () => {
      console.log("✅ Socket connected:", socketInstance.id)
      setIsConnected(true)
      setSocket(socketInstance)
      setConnectionError(null)
      setConnectionStatus('connected')
    })

    socketInstance.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason)
      setIsConnected(false)
      setConnectionStatus('disconnected')
      if (reason === "io server disconnect") {
        // The server forcefully disconnected the socket
        socketInstance.connect()
      }
    })

    socketInstance.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error.message)
      console.error("Full error details:", error)
      setIsConnected(false)
      setConnectionError(error.message)
      setConnectionStatus('disconnected')
    })

    // Cleanup on unmount or when user changes
    return () => {
      console.log("🧹 Cleaning up socket connection")
      if (socketInstance) {
        socketInstance.disconnect()
      }
    }
  }, [user])

  return { socket, isConnected, connectionError, connectionStatus }
}