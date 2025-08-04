"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, X, Send, Minimize2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useChat } from "@/hooks/use-chat"

export function LiveChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [message, setMessage] = useState("")
  const { user } = useAuth()
  const { messages, sendMessage, unreadCount } = useChat()

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage(message)
      setMessage("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button onClick={() => setIsOpen(true)} className="rounded-full w-14 h-14 shadow-lg relative">
          <MessageSquare className="h-6 w-6" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className={`w-80 shadow-xl transition-all duration-300 ${isMinimized ? "h-14" : "h-96"}`}>
        <CardHeader
          className="flex flex-row items-center justify-between space-y-0 pb-2 cursor-pointer"
          onClick={() => setIsMinimized(!isMinimized)}
        >
          <CardTitle className="text-sm font-medium flex items-center space-x-2">
            <MessageSquare className="h-4 w-4" />
            <span>Live Support</span>
            <Badge variant="secondary" className="text-xs">
              Online
            </Badge>
          </CardTitle>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                setIsMinimized(!isMinimized)
              }}
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                setIsOpen(false)
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="flex flex-col h-80">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-3 mb-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 text-sm py-8">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p>Start a conversation with our support team!</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                        msg.isUser ? "bg-cyan-500 text-white" : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p>{msg.content}</p>
                      <p className={`text-xs mt-1 ${msg.isUser ? "text-cyan-100" : "text-gray-500"}`}>
                        {msg.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input */}
            <div className="flex space-x-2">
              <Input
                placeholder={user ? "Type your message..." : "Sign in to chat"}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={!user}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={!user || !message.trim()} size="sm">
                <Send className="h-4 w-4" />
              </Button>
            </div>

            {!user && (
              <p className="text-xs text-gray-500 mt-2 text-center">
                Please{" "}
                <a href="/auth/signin" className="text-cyan-500 hover:underline">
                  sign in
                </a>{" "}
                to start chatting
              </p>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  )
}
