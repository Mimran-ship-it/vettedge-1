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
  const [isCreatingSession, setIsCreatingSession] = useState(false)

  useEffect(() => {
    if (!socket || !isConnected) return

    console.log("Setting up socket listeners")
    
    const handleNewMessage = (message: ChatMessage) => {
      console.log("Received new_message:", message)
      
      // Add message if it belongs to current session
      if (currentSession && message.sessionId === currentSession._id) {
        setMessages(prev => [...prev, message])
      } else {
        console.log("Message not added - session mismatch:", { 
          currentSession: currentSession?._id, 
          messageSession: message.sessionId 
        })
      }
      
      // Update unread count for admin messages to customers not in current session
      if (message.senderRole === "admin" && user?.role === "customer") {
        if (!currentSession || message.sessionId !== currentSession._id) {
          setUnreadCount(prev => prev + 1)
        }
      }
    }

    const handleSessionStatusUpdated = ({ sessionId, status }: { 
      sessionId: string
      status: "active" | "closed" | "waiting" 
    }) => {
      console.log("Session status updated:", { sessionId, status })
      if (currentSession && currentSession._id === sessionId) {
        setCurrentSession(prev => prev ? { ...prev, status } : null)
      }
    }

    const handleSessionJoined = ({ sessionId }: { sessionId: string }) => {
      console.log("Session joined:", sessionId)
    }

    const handleError = (error: any) => {
      console.error("Socket error:", error)
    }

    socket.on("new_message", handleNewMessage)
    socket.on("session_status_updated", handleSessionStatusUpdated)
    socket.on("session_joined", handleSessionJoined)
    socket.on("error", handleError)

    return () => {
      socket.off("new_message", handleNewMessage)
      socket.off("session_status_updated", handleSessionStatusUpdated)
      socket.off("session_joined", handleSessionJoined)
      socket.off("error", handleError)
    }
  }, [socket, isConnected, currentSession, user])

  // Combined effect for session creation
  useEffect(() => {
    if (user && user.role === "customer" && !currentSession && socket && isConnected && !isCreatingSession) {
      console.log("Auto-creating session for customer:", user.name)
      createSession()
    }
  }, [user, currentSession, socket, isConnected, isCreatingSession])

  const fetchMessages = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/chat/messages?sessionId=${sessionId}`, {
        credentials: 'include' // Include cookies in the request
      })
      
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages)
        setUnreadCount(0)
      } else {
        console.error("Failed to fetch messages:", response.status, await response.text())
      }
    } catch (error) {
      console.error("Error fetching messages:", error)
    }
  }

  const createSession = async () => {
    if (!user) {
      console.warn("User must be signed in to start chat")
      return
    }

    if (isCreatingSession) {
      console.log("Session creation already in progress")
      return
    }

    setIsCreatingSession(true)
    
    try {
      console.log("Creating chat session for user:", user.name)
      const response = await fetch("/api/chat/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: 'include' // Include cookies in the request
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
    } finally {
      setIsCreatingSession(false)
    }
  }

  const joinSession = (sessionId: string) => {
    if (socket && isConnected) {
      socket.emit("join_session", sessionId)
    }
  }

  const sendMessage = (content: string) => {
    console.log("sendMessage called with:", content)
    
    if (!user) {
      console.warn("User must be signed in to send messages")
      return
    }
    
    if (!socket) {
      console.warn("No socket available")
      return
    }
    
    if (!socket.connected) {
      console.warn("Socket not connected, current state:", socket.connected)
      return
    }
    
    // Send message via socket - don't add optimistic message to avoid duplicates
    console.log("Emitting send_message event:", { content })
    socket.emit("send_message", {
      content,
      sessionId: currentSession?._id // Include sessionId if available
    })
  }

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