"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRealtime } from "@/hooks/use-pusher"

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
  const { user } = useAuth()
  const { pusher } = useRealtime()
  const [notifications, setNotifications] = useState<AdminNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!user || user.role !== "admin") return

    // If no pusher, skip real-time notifications
    if (!pusher) {
      console.log("No Pusher connection, admin notifications disabled")
      return
    }

    // ✅ Subscribe to admin channel
    const channel = pusher.subscribe("admin-channel")

    // ✅ Listen for new customer messages
    channel.bind("new_customer_message", (data: {
      sessionId: string
      customerName: string
      content: string
    }) => {
      const notification: AdminNotification = {
        id: `msg_${Date.now()}`,
        type: "new_message",
        title: "New Message",
        message: `${data.customerName}: ${data.content.substring(0, 50)}${data.content.length > 50 ? "..." : ""}`,
        sessionId: data.sessionId,
        timestamp: new Date(),
        isRead: false,
      }

      setNotifications(prev => [notification, ...prev.slice(0, 19)]) // keep last 20
      setUnreadCount(prev => prev + 1)

      // ✅ Show browser notification
      if (Notification.permission === "granted") {
        new Notification("New Chat Message", {
          body: `${data.customerName}: ${data.content}`,
          icon: "/logo.jpg",
        })
      }
    })

    // ✅ Cleanup on unmount
    return () => {
      try {
        channel.unbind("new_customer_message")
        pusher.unsubscribe("admin-channel")
      } catch (e) {
        // ignore cleanup errors
      }
    }
  }, [user, pusher])

  // ✅ Request browser notification permission
  useEffect(() => {
    if (user?.role === "admin" && Notification.permission === "default") {
      Notification.requestPermission()
    }
  }, [user])

  // ✅ Actions
  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === notificationId ? { ...n, isRead: true } : n))
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

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications,
  }
}
