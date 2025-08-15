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
      socket.on("new-message", (message: ChatMessage) => {
        if (currentSession && message.sessionId === currentSession._id) {
          setMessages(prev => [...prev, message])
        }
        
        if (message.senderRole === "admin" && user?.role === "customer") {
          setUnreadCount(prev => prev + 1)
        }
      })

      socket.on("session-status-updated", ({ sessionId, status }: { 
        sessionId: string
        status: "active" | "closed" | "waiting" 
      }) => {
        if (currentSession && currentSession._id === sessionId) {
          setCurrentSession(prev => prev ? { ...prev, status } : null)
        }
      })

      return () => {
        socket.off("new-message")
        socket.off("session-status-updated")
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

      const response = await fetch("/api/chat/sessions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })

      if (response.ok) {
        const data = await response.json()
        setCurrentSession(data.session)
        
        if (socket && isConnected) {
          socket.emit("join-session", data.session._id)
        }
        
        fetchMessages(data.session._id)
      }
    } catch (error) {
      console.error("Error creating session:", error)
    }
  }

  const joinSession = (sessionId: string) => {
    if (socket && isConnected) {
      socket.emit("join-session", sessionId)
    }
  }

  const sendMessage = (content: string) => {
    // Check authentication before sending message
    if (!user) {
      console.warn("User must be signed in to send messages")
      return
    }

    if (!currentSession || !socket || !isConnected) return

    socket.emit("send-message", {
      sessionId: currentSession._id,
      content,
      messageType: "text"
    })
  }

  useEffect(() => {
    // Only auto-create session for authenticated customers
    if (user && user.role === "customer" && !currentSession) {
      createSession()
    }
  }, [user, currentSession])

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
