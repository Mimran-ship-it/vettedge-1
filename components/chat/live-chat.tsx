// components/chat/live-chat.tsx
"use client"
import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, X, Send, Minimize2 } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useChat } from "@/hooks/use-chat"
import { formatDistanceToNow } from "date-fns"
import { useToast } from "@/hooks/use-toast"


export function LiveChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [message, setMessage] = useState("")
  const { user } = useAuth()
  const { messages, sendMessage, unreadCount, currentSession, isConnected } = useChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

    // Auto scroll when messages change
    useEffect(() => {
      if (isOpen && !isMinimized) {
        scrollToBottom()
      }
    }, [messages, isOpen, isMinimized])
  
    // Auto scroll when chat is first opened
    useEffect(() => {
      if (isOpen && !isMinimized) {
        // slight delay so DOM renders before scrolling
        setTimeout(scrollToBottom, 100)
      }
    }, [isOpen, isMinimized])
  
  useEffect(() => {
    scrollToBottom()
  }, [messages])
  
  useEffect(() => {
    console.log("LiveChat - Current session:", currentSession)
    console.log("LiveChat - Is connected:", isConnected)
    console.log("LiveChat - Messages count:", messages.length)
  }, [currentSession, isConnected, messages])
  
  const handleSendMessage = (e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    
    console.log("Send button clicked", { user, message, currentSession, isConnected })
    
    if (message.trim() && user) {
      console.log("Sending message:", message, "Session:", currentSession?._id || "No session")
      sendMessage(message)
      setMessage("")
    } else {
      console.log("Cannot send message - missing requirements", { 
        hasMessage: !!message.trim(), 
        hasSession: !!currentSession, 
        hasUser: !!user,
        isConnected 
      })
      
      // Show feedback to user
      if (!isConnected) {
        toast({
          title: "Chat Not Connected",
          description: "Please wait or refresh the page.",
          variant: "destructive"
        })
      } else if (!currentSession) {
        toast({
          title: "Creating Session",
          description: "Please try again in a moment.",
        })
      }
    }
  }
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      
      handleSendMessage()
    }
  }
  
  if (!isOpen) {
    console.log('counter is',unreadCount)
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
    <div className="fixed bottom-4 right-4 z-[999px] bg-white max-w-[calc(100vw-2rem)]">
      <Card className={`w-80 max-w-full shadow-xl transition-all duration-300 ${isMinimized ? "h-14" : "h-96"} sm:w-80`}>
        <CardHeader
          className="flex flex-row items-center justify-between space-y-0 pb-2 cursor-pointer"
          onClick={() => setIsMinimized(!isMinimized)}
        >
          <CardTitle className="text-sm font-medium flex items-center space-x-2">
            <MessageSquare className="h-4 w-4" />
            <span>Live Support</span>
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
          <CardContent className="flex flex-col h-80 p-3 sm:p-6">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-3 mb-3">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 text-sm py-8">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p>Start a conversation with our support team!</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg._id} className={`flex ${msg.senderRole === "customer" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[75%] sm:max-w-xs px-3 py-2 rounded-lg text-sm ${
                        msg.senderRole === "customer" ? "bg-cyan-500 text-white" : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="break-words">{msg.content}</p>
                      <p className={`text-xs mt-1 ${msg.senderRole === "customer" ? "text-cyan-100" : "text-gray-500"}`}>
                        {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
            {/* Input */}
            <div className="flex space-x-2 mt-auto">
              <Input
                placeholder={user ? "Type your message..." : "Sign in to chat"}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={!user}
                className="flex-1 text-sm"
              />
              <Button 
                type="button"
                onClick={handleSendMessage} 
                disabled={!user || !message.trim()} 
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 min-w-[40px] flex items-center justify-center border-0 shrink-0"
              >
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