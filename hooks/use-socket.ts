"use client"

import { useEffect, useState } from "react"
import { io } from "socket.io-client"
import type { Socket } from "socket.io-client"
import { useAuth } from "@/hooks/use-auth"

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
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

    const newSocket = io(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000", {
      auth: {
        token: token
      },
      transports: ["websocket", "polling"]
    })

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id)
      setIsConnected(true)
    })

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected")
      setIsConnected(false)
    })

    newSocket.on("connect_error", (error: Error) => {
      console.error("Socket connection error:", error)
      setIsConnected(false)
    })

    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [user])

  return { socket, isConnected }
}
