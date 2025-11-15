"use client"
import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, X, Send, Minimize2, RefreshCw, Paperclip } from "lucide-react"
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
  const { messages, sendMessage, sendAttachment, currentSession, isConnected, refreshMessages } = useChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const prevMessageCount = useRef(messages.length)
  const previousUserIdRef = useRef<string | null>(null)

  // Detect user changes and close chat
  useEffect(() => {
    const currentUserId = user?.id || null
    
    // If user changed (and it's not initial mount)
    if (previousUserIdRef.current !== null && previousUserIdRef.current !== currentUserId) {
      console.log("User changed in LiveChat. Closing chat interface.", {
        previousUserId: previousUserIdRef.current,
        currentUserId,
      })
      
      // Close chat and clear message input
      setIsOpen(false)
      setIsMinimized(false)
      setMessage("")
    }
    
    // Update the ref to current user
    previousUserIdRef.current = currentUserId
  }, [user?.id])

  useEffect(() => {
    const handleOpenChat = () => {
      setIsOpen(true)
      setIsMinimized(false)
    }
    window.addEventListener("openLiveChat", handleOpenChat)
    return () => window.removeEventListener("openLiveChat", handleOpenChat)
  }, [])

  useEffect(() => {
    if (messages.length > prevMessageCount.current && !isOpen && (prevMessageCount.current !== 0 || messages.length === 1)) {
      setIsOpen(true)
      setIsMinimized(false)
    }
    prevMessageCount.current = messages.length
  }, [messages.length, isOpen])

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })

  useEffect(() => {
    if (isOpen && !isMinimized) scrollToBottom()
  }, [messages, isOpen, isMinimized])

  useEffect(() => {
    if (isOpen && !isMinimized) setTimeout(scrollToBottom, 100)
  }, [isOpen, isMinimized])

  const handleSendMessage = (e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()
    if (message.trim() && user) {
      sendMessage(message)
      setMessage("")
    } else {
      if (!isConnected) {
        toast({ title: "Chat Not Connected", description: "Please wait or refresh the page.", variant: "destructive" })
      } else if (!currentSession) {
        toast({ title: "Creating Session", description: "Please try again in a moment." })
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSendMessage()
  }

  const handleRefresh = () => {
    refreshMessages()
    toast({ title: "Refreshing Messages", description: "Fetching latest messages..." })
  }

  useEffect(() => {
    if (!popupShown) {
      const timer = setTimeout(() => {
        setShowPopup(true)
        setPopupShown(true)
        setTimeout(() => setShowPopup(false), 6000)
      }, 8000)
      return () => clearTimeout(timer)
    }
  }, [popupShown])

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50 flex items-end gap-2 overflow-hidden">
        <AnimatePresence>
          {showPopup && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.4 }} className="text-white shadow-lg xl z-[999px] px-4 py-2 text-sm bg-[#33BDC7] backdrop-blur-sm">
              💬 Need help? Chat with us!
            </motion.div>
          )}
        </AnimatePresence>
        <Button onClick={() => setIsOpen(true)} className="rounded-full w-14 h-14 shadow-lg relative bg-[#33BDC7] hover:bg-[#2A9CA3] border-0">
          <MessageSquare className="h-6 w-6 text-white" />
        </Button>
      </div>
    )
  }
  return (
    <div className="fixed z-[999999] bottom-4 right-4 max-w-[calc(100vw-2rem)]">
      <Card className={`w-80 max-w-full shadow-xl transition-all duration-300 ${isMinimized ? "h-14" : "h-96"} sm:w-80 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 cursor-pointer bg-[#33BDC7] text-white t-lg" onClick={() => setIsMinimized(!isMinimized)}>
          <CardTitle className="text-sm font-medium flex items-center space-x-2">
            <MessageSquare className="h-4 w-4" />
            <span>Live Support</span>
            {/* {!isConnected && <Badge variant="destructive" className="text-xs bg-red-500 hover:bg-red-600">Offline</Badge>} */}
          </CardTitle>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleRefresh() }} disabled={!isConnected} className="text-white hover:bg-[#2A9CA3]">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized) }} className="text-white hover:bg-[#2A9CA3]">
              <Minimize2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setIsOpen(false) }} className="text-white hover:bg-[#2A9CA3]">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        {!isMinimized && (
          <CardContent className="flex flex-col h-80 p-3 sm:p-6 bg-white dark:bg-gray-800">
            <div className="flex-1 overflow-y-auto space-y-3 mb-3 pr-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
              {messages.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 text-sm py-8">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                  <p>Start a conversation with our support team!</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg._id} className={`flex ${msg.senderRole === "customer" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] sm:max-w-xs px-3 py-2  text-sm ${msg.senderRole === "customer" ? "bg-[#33BDC7] text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100"} shadow-sm`}>
                      {msg.messageType === "image" ? (
                        <a href={msg.content} target="_blank" rel="noreferrer">
                          <img src={msg.content} alt="attachment" className="rounded max-h-60 w-auto object-contain" />
                        </a>
                      ) : msg.messageType === "file" ? (
                        <a href={msg.content} target="_blank" rel="noreferrer" className="underline break-all">
                          {msg.content.split("/").pop()}
                        </a>
                      ) : (
                        <p className="break-words">{msg.content}</p>
                      )}
                      <p className={`text-xs mt-1 ${msg.senderRole === "customer" ? "text-[#E0F7F9]" : "text-gray-500 dark:text-gray-400"}`}>
                        {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="flex space-x-2 mt-auto">
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (file && user) {
                    console.log("File selected:", file.name, "Session:", !!currentSession)
                    await sendAttachment(file)
                    e.currentTarget.value = ""
                  }
                }}
              />
              <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={!user} className="shrink-0">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Input
                placeholder={user ? "Type your message..." : "Sign in to chat"}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={!user}
                className="flex-1 text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 focus:border-[#33BDC7] focus:ring-[#33BDC7] text-gray-900 dark:text-gray-100"
              />
              <Button
                type="button"
                onClick={handleSendMessage}
                disabled={!user || !message.trim()}
                size="sm"
                className="bg-[#33BDC7] hover:bg-[#2A9CA3] active:bg-[#1E6B70] text-white disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 min-w-[40px] flex items-center justify-center border-0 shrink-0 shadow-md"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            {!user && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                <a href="/auth/signin" className="text-[#33BDC7] hover:underline font-medium">sign in</a> {" "}
                to start chatting
              </p>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  )
}