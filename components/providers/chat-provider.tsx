"use client"

import { useState, type ReactNode } from "react"
import { ChatContext } from "@/hooks/use-chat"

interface ChatMessage {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  const sendMessage = (content: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])

    // Simulate admin response
    setTimeout(() => {
      const adminResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: "Thank you for your message! Our support team will get back to you shortly.",
        isUser: false,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, adminResponse])
      setUnreadCount((prev) => prev + 1)
    }, 1000)
  }

  return (
    <ChatContext.Provider
      value={{
        messages,
        sendMessage,
        unreadCount,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}
