"use client"

import { useState, useEffect } from "react"
import { useSocket } from "@/hooks/use-socket"
import { useAuth } from "@/hooks/use-auth"

interface AdminNotification {
  id: string
  type: "new_message" | "new_contact" | "new_order"
  title: string
  message: string
  sessionId?: string
  timestamp: Date
  isRead: boolean
}

export function useAdminNotifications() {
  const { socket, isConnected } = useSocket()
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<AdminNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (socket && isConnected && user?.role === "admin") {
      // Listen for new customer messages
      socket.on("new_customer_message", (data: {
        sessionId: string
        customerName: string
        content: string
      }) => {
        const notification: AdminNotification = {
          id: `msg_${Date.now()}`,
          type: "new_message",
          title: "New Message",
          message: `${data.customerName}: ${data.content.substring(0, 50)}${data.content.length > 50 ? '...' : ''}`,
          sessionId: data.sessionId,
          timestamp: new Date(),
          isRead: false
        }

        setNotifications(prev => [notification, ...prev.slice(0, 19)]) // Keep last 20
        setUnreadCount(prev => prev + 1)

        // Show browser notification if permission granted
        if (Notification.permission === "granted") {
          new Notification("New Chat Message", {
            body: `${data.customerName}: ${data.content}`,
            icon: "/logo.jpg"
          })
        }
      })

      return () => {
        socket.off("new_customer_message")
      }
    }
  }, [socket, isConnected, user])

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, isRead: true } : n
      )
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
    setUnreadCount(0)
  }

  const clearNotifications = () => {
    setNotifications([])
    setUnreadCount(0)
  }

  // Request notification permission on mount
  useEffect(() => {
    if (user?.role === "admin" && Notification.permission === "default") {
      Notification.requestPermission()
    }
  }, [user])

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications
  }
}
