"use client"
import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, X, Send, Minimize2, RefreshCw } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useChat } from "@/hooks/use-chat"
import { formatDistanceToNow } from "date-fns"
import { useToast } from "@/hooks/use-toast"

import { motion, AnimatePresence } from "framer-motion"

export function LiveChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [popupShown, setPopupShown] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [message, setMessage] = useState("")
  const { user } = useAuth()
  const { messages, sendMessage, currentSession, isConnected, refreshMessages } = useChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Track previous total message count
  const prevMessageCount = useRef(messages.length)

  // Auto-open chat when a new message arrives (only if closed)
  useEffect(() => {
    if (messages.length > prevMessageCount.current && !isOpen&&(prevMessageCount.current!=0||messages.length==1)) {
      console.log('length',messages.length,prevMessageCount.current)
      setIsOpen(true)
      setIsMinimized(false)
    }
    prevMessageCount.current = messages.length
  }, [messages.length, isOpen])

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
      setTimeout(scrollToBottom, 100)
    }
  }, [isOpen, isMinimized])

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
        isConnected,
      })

      if (!isConnected) {
        toast({
          title: "Chat Not Connected",
          description: "Please wait or refresh the page.",
          variant: "destructive",
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

  const handleRefresh = () => {
    refreshMessages()
    toast({
      title: "Refreshing Messages",
      description: "Fetching latest messages...",
    })
  }

  useEffect(() => {
    if (!popupShown) {
      const timer = setTimeout(() => {
        setShowPopup(true)
        setPopupShown(true)
        // auto hide popup after 4s
        setTimeout(() => setShowPopup(false), 6000)
      }, 8000) // 10 seconds
      return () => clearTimeout(timer)
    }
  }, [popupShown])

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50 flex items-end gap-2 overflow-hidden ">
        {/* ✨ Popup Message */}
        <AnimatePresence>
          {showPopup && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
              className="bg-white  shadow-lg rounded-xl z-[999px] px-4 py-2 text-sm text-gray-700 "
            >
              💬 Need help? Chat with us!
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Icon */}
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 shadow-lg relative"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      </div>
    )
  }


  return (
    <div className="fixed bottom-4 right-4 z-[999px] bg-white max-w-[calc(100vw-2rem)]">
      <Card
        className={`w-80 max-w-full shadow-xl transition-all duration-300 ${
          isMinimized ? "h-14" : "h-96"
        } sm:w-80`}
      >
        <CardHeader
          className="flex flex-row items-center justify-between space-y-0 pb-2 cursor-pointer"
          onClick={() => setIsMinimized(!isMinimized)}
        >
          <CardTitle className="text-sm font-medium flex items-center space-x-2">
            <MessageSquare className="h-4 w-4" />
            <span>Live Support</span>
            {!isConnected && (
              <Badge variant="destructive" className="text-xs">
                Offline
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                handleRefresh()
              }}
              disabled={!isConnected}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
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
                  <div
                    key={msg._id}
                    className={`flex ${msg.senderRole === "customer" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] sm:max-w-xs px-3 py-2 rounded-lg text-sm ${
                        msg.senderRole === "customer"
                          ? "bg-cyan-500 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="break-words">{msg.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.senderRole === "customer" ? "text-cyan-100" : "text-gray-500"
                        }`}
                      >
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
