"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, Send, Users, Clock, Bell } from "lucide-react"
import { useSocket } from "@/hooks/use-socket"
import { useAuth } from "@/hooks/use-auth"
import { AdminNotificationBell } from "@/components/admin/admin-notification-bell"
import { formatDistanceToNow } from "date-fns"

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
  const { socket, isConnected } = useSocket()
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (socket && isConnected) {
      // Listen for new messages
      socket.on("new-message", (message: ChatMessage) => {
        if (selectedSession && message.sessionId === selectedSession._id) {
          setMessages(prev => [...prev, message])
        }
      })

      // Listen for new customer messages (notifications)
      socket.on("new-customer-message", ({ sessionId, message, session }: {
        sessionId: string
        message: ChatMessage
        session: ChatSession
      }) => {
        // Update sessions list
        setSessions(prev => prev.map(s => 
          s._id === sessionId ? { ...s, lastMessageAt: message.createdAt, unreadCount: s.unreadCount + 1 } : s
        ))
      })

      return () => {
        socket.off("new-message")
        socket.off("new-customer-message")
      }
    }
  }, [socket, isConnected, selectedSession])

  // Fetch chat sessions
  const fetchSessions = async () => {
    try {
      const response = await fetch("/api/chat/sessions", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setSessions(data.sessions || [])
      }
    } catch (error) {
      console.error("Failed to fetch sessions:", error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch messages for selected session
  const fetchMessages = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/chat/messages?sessionId=${sessionId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages || [])
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error)
    }
  }

  // Send message
  const sendMessage = () => {
    if (!newMessage.trim() || !selectedSession || !socket) return

    socket.emit("send_message", {
      sessionId: selectedSession._id,
      content: newMessage.trim()
    })

    setNewMessage("")
  }

  // Socket event listeners
  useEffect(() => {
    if (socket && isConnected) {
      socket.on("new_message", (message: ChatMessage) => {
        if (selectedSession && message.sessionId === selectedSession._id) {
          setMessages(prev => [...prev, message])
        }
        
        // Update session unread count
        setSessions(prev => 
          prev.map(session => 
            session._id === message.sessionId
              ? { ...session, lastMessageAt: message.createdAt, unreadCount: session.unreadCount + (message.senderRole === "customer" ? 1 : 0) }
              : session
          )
        )
      })

      socket.on("session_joined", () => {
        if (selectedSession) {
          fetchMessages(selectedSession._id)
        }
      })

      return () => {
        socket.off("new_message")
        socket.off("session_joined")
      }
    }
  }, [socket, isConnected, selectedSession])

  // Join session when selected
  useEffect(() => {
    if (socket && selectedSession) {
      socket.emit("join_session", selectedSession._id)
    }
  }, [socket, selectedSession])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Initial data fetch
  useEffect(() => {
    if (user?.role === "admin") {
      fetchSessions()
    }
  }, [user])

  const handleSessionSelect = (session: ChatSession) => {
    setSelectedSession(session)
    setMessages([])
    
    // Mark session as read
    setSessions(prev => 
      prev.map(s => 
        s._id === session._id ? { ...s, unreadCount: 0 } : s
      )
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500"
      case "waiting": return "bg-yellow-500"
      case "closed": return "bg-gray-500"
      default: return "bg-gray-500"
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
    <div className="flex h-screen bg-gray-50">
      {/* Sessions Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Users className="h-5 w-5" />
              Chat Sessions
            </h2>
            <AdminNotificationBell />
          </div>
        </div>
        
        <ScrollArea className="h-[calc(100vh-80px)]">
          <div className="p-2">
            {sessions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No chat sessions yet</p>
              </div>
            ) : (
              sessions.map((session) => (
                <Card
                  key={session._id}
                  className={`mb-2 cursor-pointer transition-colors hover:bg-gray-50 ${
                    selectedSession?._id === session._id ? "ring-2 ring-blue-500" : ""
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
                          <p className="font-medium text-sm">{session.userName}</p>
                          <p className="text-xs text-gray-500">{session.userEmail}</p>
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
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>
                        {formatDistanceToNow(new Date(session.lastMessageAt), { addSuffix: true })}
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
            {/* Chat Header */}
            <div className="p-4 bg-white border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {selectedSession.userName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{selectedSession.userName}</h3>
                    <p className="text-sm text-gray-500">{selectedSession.userEmail}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(selectedSession.status)}>
                  {selectedSession.status}
                </Badge>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message._id}
                    className={`flex ${
                      message.senderRole === "admin" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.senderRole === "admin"
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-900"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.senderRole === "admin" ? "text-blue-100" : "text-gray-500"
                      }`}>
                        {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  className="flex-1"
                />
                <Button onClick={sendMessage} disabled={!newMessage.trim() || !isConnected}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              {!isConnected && (
                <p className="text-xs text-red-500 mt-1">Disconnected from chat server</p>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a chat session</h3>
              <p className="text-gray-500">Choose a session from the sidebar to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
