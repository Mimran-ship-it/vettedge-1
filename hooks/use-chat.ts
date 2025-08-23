"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useSocket } from "@/hooks/use-socket"

interface ChatMessage {
  _id: string
  sessionId: string
  senderId: string
  senderName: string
  senderRole: "admin" | "customer"
  content: string
  messageType: "text" | "image" | "file"
  isRead: boolean
  createdAt: string
}

interface ChatSession {
  _id: string
  userId: string
  userName: string
  userEmail: string
  status: "active" | "closed" | "waiting"
  unreadCount: number
  lastMessageAt: string
  createdAt: string
  updatedAt: string
}

interface ChatContextType {
  messages: ChatMessage[]
  currentSession: ChatSession | null
  unreadCount: number
  isConnected: boolean
  sendMessage: (content: string) => void
  createSession: () => Promise<void>
  joinSession: (sessionId: string) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const { socket, isConnected } = useSocket()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (socket && isConnected) {
      console.log("Setting up socket listeners")
      
      socket.on("new_message", (message: ChatMessage) => {
        console.log("Received new_message:", message)
        if (currentSession && message.sessionId === currentSession._id) {
          setMessages(prev => [...prev, message])
        } else {
          console.log("Message not added - session mismatch:", { currentSession: currentSession?._id, messageSession: message.sessionId })
        }
        
        if (message.senderRole === "admin" && user?.role === "customer") {
          setUnreadCount(prev => prev + 1)
        }
      })

      socket.on("session_status_updated", ({ sessionId, status }: { 
        sessionId: string
        status: "active" | "closed" | "waiting" 
      }) => {
        console.log("Session status updated:", { sessionId, status })
        if (currentSession && currentSession._id === sessionId) {
          setCurrentSession(prev => prev ? { ...prev, status } : null)
        }
      })

      socket.on("session_joined", ({ sessionId }: { sessionId: string }) => {
        console.log("Session joined:", sessionId)
      })

      socket.on("error", (error: any) => {
        console.error("Socket error:", error)
      })

      return () => {
        socket.off("new_message")
        socket.off("session_status_updated")
        socket.off("session_joined")
        socket.off("error")
      }
    }
  }, [socket, isConnected, currentSession, user])

  const fetchMessages = async (sessionId: string) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`/api/chat/messages?sessionId=${sessionId}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages)
        setUnreadCount(0)
      }
    } catch (error) {
      console.error("Error fetching messages:", error)
    }
  }

  const createSession = async () => {
    // Check if user is authenticated before creating session
    if (!user) {
      console.warn("User must be signed in to start chat")
      return
    }

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        console.warn("No authentication token found")
        return
      }

      console.log("Creating chat session for user:", user.name)
      const response = await fetch("/api/chat/sessions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

      if (response.ok) {
        const data = await response.json()
        console.log("Session created:", data.session)
        setCurrentSession(data.session)
        
        if (socket && isConnected) {
          console.log("Joining session via socket:", data.session._id)
          socket.emit("join_session", data.session._id)
        } else {
          console.warn("Socket not available for joining session:", { socket: !!socket, isConnected })
        }
        
        fetchMessages(data.session._id)
      } else {
        console.error("Failed to create session:", response.status, await response.text())
      }
    } catch (error) {
      console.error("Error creating session:", error)
    }
  }

  const joinSession = (sessionId: string) => {
    if (socket && isConnected) {
      socket.emit("join_session", sessionId)
    }
  }

  const sendMessage = (content: string) => {
    console.log("sendMessage called with:", content)
    
    // Check authentication before sending message
    if (!user) {
      console.warn("User must be signed in to send messages")
      return
    }

    console.log("sendMessage - user check passed:", user.name)

    if (!socket) {
      console.warn("No socket available")
      return
    }

    if (!socket.connected) {
      console.warn("Socket not connected, current state:", socket.connected)
      return
    }

    console.log("sendMessage - socket check passed, socket connected:", socket.connected)

    // Always send without session first - let server handle session creation
    console.log("Emitting send_message event:", { content })
    socket.emit("send_message", {
      content
    })

    // Optimistically add message to UI
    const optimisticMessage = {
      _id: `temp-${Date.now()}`,
      sessionId: currentSession?._id || "temp-session",
      senderId: (user as any)._id || "unknown",
      senderName: user.name,
      senderRole: user.role as "admin" | "customer",
      content,
      messageType: "text" as const,
      isRead: false,
      createdAt: new Date().toISOString()
    }
    
    console.log("Adding optimistic message:", optimisticMessage)
    setMessages(prev => [...prev, optimisticMessage])
  }

  useEffect(() => {
    // Only auto-create session for authenticated customers
    if (user && user.role === "customer" && !currentSession) {
      console.log("Auto-creating session for customer:", user.name)
      createSession()
    }
  }, [user, currentSession])

  // Force session creation when chat is opened if no session exists
  useEffect(() => {
    if (user && user.role === "customer" && socket && isConnected && !currentSession) {
      console.log("Socket connected, creating session for customer")
      createSession()
    }
  }, [socket, isConnected, user, currentSession])

  const contextValue: ChatContextType = {
    messages,
    currentSession,
    unreadCount,
    isConnected,
    sendMessage,
    createSession,
    joinSession
  }

  return React.createElement(
    ChatContext.Provider,
    { value: contextValue },
    children
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}

export { ChatContext }
