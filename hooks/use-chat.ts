"use client"

import { createContext, useContext } from "react"

interface ChatMessage {
  id: string
  content: string
  isUser: boolean
  timestamp: Date
}

interface ChatContextType {
  messages: ChatMessage[]
  sendMessage: (content: string) => void
  unreadCount: number
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}

export { ChatContext }
