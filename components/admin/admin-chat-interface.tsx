"use client"
import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageSquare, Send, Users, Clock, RefreshCw, Paperclip } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { AdminNotificationBell } from "@/components/admin/admin-notification-bell"
import { formatDistanceToNow } from "date-fns"
import { useRealtime } from "@/hooks/use-pusher"

interface ChatSession {
  _id: string
  userId: string
  userName: string
  userEmail: string
  status: "active" | "closed" | "waiting"
  createdAt: string
  updatedAt: string
  lastMessageAt: string
  unreadCount: number
}

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

export function AdminChatInterface() {
  const { user } = useAuth()
  const { pusher, isConnected } = useRealtime()
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  
  useEffect(() => {
    scrollToBottom()
  }, [messages])
  
  // 🔹 Initialize Pusher real-time subscriptions
  useEffect(() => {
    if (!user || user.role !== "admin") return
    
    // If no pusher, skip real-time functionality
    if (!pusher) {
      console.log("No Pusher connection, admin chat using polling mode")
      return
    }
    
    // Subscribe to global admin channel
    const channel = pusher.subscribe("admin-channel")
    
    channel.bind("new_message", (message: ChatMessage) => {
      if (selectedSession && message.sessionId === selectedSession._id) {
        setMessages(prev => [...prev, message])
      }
      
      setSessions(prev =>
        prev.map(session =>
          session._id === message.sessionId
            ? {
                ...session,
                lastMessageAt: message.createdAt,
                unreadCount:
                  session.unreadCount + (message.senderRole === "customer" ? 1 : 0),
              }
            : session
        )
      )
    })
    
    channel.bind("new_customer_message", ({ sessionId }: { sessionId: string }) => {
      setSessions(prev =>
        prev.map(s =>
          s._id === sessionId
            ? {
                ...s,
                lastMessageAt: new Date().toISOString(),
                unreadCount: s.unreadCount + 1,
              }
            : s
        )
      )
    })
    
    return () => {
      try {
        channel.unbind("new_message")
        channel.unbind("new_customer_message")
        pusher.unsubscribe("admin-channel")
      } catch (e) {
        // ignore cleanup errors
      }
    }
  }, [user, selectedSession, pusher])
  
  // 🔹 Fetch chat sessions with useCallback
  const fetchSessions = useCallback(async () => {
    try {
      const response = await fetch("/api/chat/sessions", { credentials: "include" })
      if (response.ok) {
        const data = await response.json()
        setSessions(data.sessions || [])
      }
    } catch (error) {
      console.error("Failed to fetch sessions:", error)
    } finally {
      setLoading(false)
    }
  }, [])
  
  // 🔹 Fetch messages for selected session with useCallback
  const fetchMessages = useCallback(async (sessionId: string) => {
    try {
      const response = await fetch(`/api/chat/messages?sessionId=${sessionId}`, {
        credentials: "include",
      })
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages || [])
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error)
    }
  }, [])
  
  // 🔹 Auto-refresh data every 30 seconds
  useEffect(() => {
    if (!user || user.role !== "admin") return
    
    const intervalId = setInterval(() => {
      // Fetch sessions
      fetchSessions()
      
      // Fetch messages for selected session
      if (selectedSession) {
        fetchMessages(selectedSession._id)
      }
      
      // Update last refreshed time
      setLastRefreshed(new Date())
    }, 30000) // 30 seconds
    
    // Initial fetch
    fetchSessions()
    
    return () => clearInterval(intervalId)
  }, [user, selectedSession, fetchSessions, fetchMessages])
  
  // 🔹 Send message via backend API (with optimistic update)
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedSession || !user) return
    
    const tempId = `temp-${Date.now()}`
    // Optimistic message
    const optimisticMessage: ChatMessage = {
      _id: tempId,
      sessionId: selectedSession._id,
      senderId: user.id,
      senderName: user.name || "Admin",
      senderRole: "admin",
      content: newMessage.trim(),
      messageType: "text",
      isRead: true,
      createdAt: new Date().toISOString(),
    }
    
    // Show immediately
    setMessages(prev => [...prev, optimisticMessage])
    setNewMessage("")
    
    try {
      const res = await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          sessionId: selectedSession._id,
          content: optimisticMessage.content,
        }),
      })
      
      if (!res.ok) {
        console.error("Failed to send message:", res.status, await res.text())
        // rollback optimistic message if failed
        setMessages(prev => prev.filter(m => m._id !== tempId))
      } else {
        // If no Pusher, manually refresh messages after sending
        if (!pusher) {
          setTimeout(() => fetchMessages(selectedSession._id), 500)
        }
      }
      // Otherwise: Pusher will deliver the real message with correct _id
      // and it will append to the chat normally.
    } catch (error) {
      console.error("Failed to send message:", error)
      // rollback optimistic message on network error
      setMessages(prev => prev.filter(m => m._id !== tempId))
    }
  }

  // 🔹 Send attachment via backend API (with optimistic update)
  const sendAttachment = async (file: File) => {
    if (!selectedSession || !user) return
    
    try {
      console.log("Admin uploading file:", file.name)
      
      // Upload file first
      const fd = new FormData()
      fd.append("file", file)
      const uploadRes = await fetch("/api/chat/upload", {
        method: "POST",
        body: fd,
        credentials: "include",
      })
      
      if (!uploadRes.ok) {
        console.error("Failed to upload file:", uploadRes.status, await uploadRes.text())
        return
      }
      
      const { url, messageType } = await uploadRes.json()
      console.log("Upload successful:", { url, messageType })
      const type: ChatMessage["messageType"] = messageType === "image" ? "image" : "file"
      
      // Create optimistic message
      const tempId = `temp-${Date.now()}`
      const optimisticMessage: ChatMessage = {
        _id: tempId,
        sessionId: selectedSession._id,
        senderId: user.id,
        senderName: user.name || "Admin",
        senderRole: "admin",
        content: url,
        messageType: type,
        isRead: true,
        createdAt: new Date().toISOString(),
      }
      
      // Show immediately
      setMessages(prev => [...prev, optimisticMessage])
      
      // Send to backend
      const res = await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          sessionId: selectedSession._id,
          content: url,
          messageType: type,
        }),
      })
      
      if (!res.ok) {
        console.error("Failed to send attachment message:", res.status, await res.text())
        // rollback optimistic message if failed
        setMessages(prev => prev.filter(m => m._id !== tempId))
      } else {
        // If no Pusher, manually refresh messages after sending
        if (!pusher) {
          setTimeout(() => fetchMessages(selectedSession._id), 500)
        }
      }
    } catch (error) {
      console.error("Failed to send attachment:", error)
    }
  }
  
  // 🔹 Handle manual refresh
  const handleRefresh = async () => {
    if (isRefreshing) return
    
    setIsRefreshing(true)
    try {
      await fetchSessions()
      if (selectedSession) {
        await fetchMessages(selectedSession._id)
      }
      setLastRefreshed(new Date())
    } finally {
      setIsRefreshing(false)
    }
  }
  
  const handleSessionSelect = (session: ChatSession) => {
    setSelectedSession(session)
    setMessages([])
    fetchMessages(session._id)
    setSessions(prev =>
      prev.map(s => (s._id === session._id ? { ...s, unreadCount: 0 } : s))
    )
  }
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "waiting":
        return "bg-yellow-500"
      case "closed":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-600">Loading chat sessions...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <Users className="h-5 w-5" />
            Chat Sessions
          </h2>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
            <AdminNotificationBell />
          </div>
        </div>
        
        {lastRefreshed && (
          <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
            Last refreshed: {lastRefreshed.toLocaleTimeString()}
          </div>
        )}
        
        <ScrollArea className="flex-1">
          <div className="p-2">
            {sessions.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <p>No chat sessions yet</p>
              </div>
            ) : (
              sessions.map(session => (
                <Card
                  key={session._id}
                  className={`mb-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 ${
                    selectedSession?._id === session._id ? "ring-2 ring-blue-500 dark:ring-blue-400" : ""
                  }`}
                  onClick={() => handleSessionSelect(session)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {session.userName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm text-gray-900 dark:text-gray-100">{session.userName}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{session.userEmail}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge className={`text-xs ${getStatusColor(session.status)}`}>
                          {session.status}
                        </Badge>
                        {session.unreadCount > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {session.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="h-3 w-3" />
                      <span>
                        {formatDistanceToNow(new Date(session.lastMessageAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
      
      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedSession ? (
          <>
            {/* Header - Sticky */}
            <div className="sticky top-0 z-10 p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>
                    {selectedSession.userName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">{selectedSession.userName}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{selectedSession.userEmail}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(selectedSession.status)}>
                  {selectedSession.status}
                </Badge>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => fetchMessages(selectedSession._id)}
                  disabled={isRefreshing}
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>
            
            {/* Messages */}
            <ScrollArea className="flex-1 p-4 bg-gray-50 dark:bg-gray-900">
              <div className="space-y-4">
                {messages.map(message => (
                  <div
                    key={message._id}
                    className={`flex ${
                      message.senderRole === "admin" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.senderRole === "admin"
                          ? "bg-blue-600 dark:bg-blue-700 text-white"
                          : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
                      }`}
                    >
                      {message.messageType === "image" ? (
                        <div className="space-y-2">
                          <img 
                            src={message.content} 
                            alt="Shared image" 
                            className="max-w-48 max-h-48 h-auto rounded-md cursor-pointer object-cover"
                            onClick={() => window.open(message.content, '_blank')}
                          />
                        </div>
                      ) : message.messageType === "file" ? (
                        <div className="space-y-2">
                          <div className={`flex items-center gap-2 p-2 rounded-md ${
                            message.senderRole === "admin" 
                              ? "bg-white/10" 
                              : "bg-gray-100 dark:bg-gray-700"
                          }`}>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                            </svg>
                            <a 
                              href={message.content} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm underline hover:no-underline"
                            >
                              {message.content.split('/').pop() || 'Download File'}
                            </a>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm">{message.content}</p>
                      )}
                      <p
                        className={`text-xs mt-1 ${
                          message.senderRole === "admin"
                            ? "text-blue-100 dark:text-blue-200"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {formatDistanceToNow(new Date(message.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            
            {/* Input */}
            <div className="sticky bottom-0 p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0]
                  if (file && selectedSession && user) {
                    console.log("Admin file selected:", file.name)
                    await sendAttachment(file)
                    e.currentTarget.value = ""
                  }
                }}
              />
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => fileInputRef.current?.click()} 
                disabled={!selectedSession}
                className="shrink-0"
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Input
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                onKeyDown={e => e.key === "Enter" && sendMessage()}
                className="flex-1"
              />
              <Button onClick={sendMessage} disabled={!newMessage.trim() || !isConnected}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            {!isConnected && (
              <div className="px-4 pb-2 bg-white dark:bg-gray-800">
                <p className="text-xs text-red-500 dark:text-red-400">
                  Disconnected from chat server
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
              <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                Select a chat session
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Choose a session from the sidebar to start chatting
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}