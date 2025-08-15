"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { 
  MessageSquare, 
  Send, 
  Clock, 
  User, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  Search,
  Filter
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useSocket } from "@/hooks/use-socket"
import { formatDistanceToNow } from "date-fns"

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
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isTyping, setIsTyping] = useState(false)
  const [typingUsers, setTypingUsers] = useState<string[]>([])
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
          s._id === sessionId ? { ...s, ...session } : s
        ))

        // Show browser notification if permission granted
        if (Notification.permission === "granted") {
          new Notification(`New message from ${message.senderName}`, {
            body: message.content,
            icon: "/logo.jpg"
          })
        }
      })

      // Listen for session updates
      socket.on("session-updated", (session: ChatSession) => {
        setSessions(prev => prev.map(s => 
          s._id === session._id ? session : s
        ))
      })

      // Listen for typing indicators
      socket.on("user-typing", ({ userId, userName, isTyping }: {
        userId: string
        userName: string
        isTyping: boolean
      }) => {
        if (isTyping) {
          setTypingUsers(prev => [...prev.filter(u => u !== userName), userName])
        } else {
          setTypingUsers(prev => prev.filter(u => u !== userName))
        }
      })

      return () => {
        socket.off("new-message")
        socket.off("new-customer-message")
        socket.off("session-updated")
        socket.off("user-typing")
      }
    }
  }, [socket, isConnected, selectedSession])

  useEffect(() => {
    fetchSessions()
    requestNotificationPermission()
  }, [])

  const requestNotificationPermission = async () => {
    if ("Notification" in window && Notification.permission === "default") {
      await Notification.requestPermission()
    }
  }

  const fetchSessions = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch("/api/chat/sessions", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setSessions(data.sessions)
      }
    } catch (error) {
      console.error("Error fetching sessions:", error)
    }
  }

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
      }
    } catch (error) {
      console.error("Error fetching messages:", error)
    }
  }

  const handleSessionSelect = (session: ChatSession) => {
    setSelectedSession(session)
    setMessages([])
    fetchMessages(session._id)
    
    if (socket && isConnected) {
      socket.emit("join-session", session._id)
    }
  }

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedSession || !socket) return

    socket.emit("send-message", {
      sessionId: selectedSession._id,
      content: newMessage,
      messageType: "text"
    })

    setNewMessage("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleStatusChange = (sessionId: string, status: string) => {
    if (socket && isConnected) {
      socket.emit("update-session-status", { sessionId, status })
    }
  }

  const handleTyping = (isTyping: boolean) => {
    if (socket && selectedSession && isTyping !== isTyping) {
      setIsTyping(isTyping)
      socket.emit("typing", { sessionId: selectedSession._id, isTyping })
    }
  }

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || session.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <CheckCircle className="h-4 w-4 text-green-500" />
      case "waiting": return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "closed": return <XCircle className="h-4 w-4 text-gray-500" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800"
      case "waiting": return "bg-yellow-100 text-yellow-800"
      case "closed": return "bg-gray-100 text-gray-800"
      default: return "bg-blue-100 text-blue-800"
    }
  }

  return (
    <div className="flex-1 h-screen flex">
      {/* Sessions List */}
      <div className="w-80 border-r bg-gray-50/50 flex flex-col">
        <div className="p-4 border-b bg-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <SidebarTrigger />
              <h2 className="text-lg font-semibold">Live Chat Support</h2>
            </div>
            <Badge variant={isConnected ? "default" : "destructive"}>
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search sessions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 border rounded-md text-sm"
            >
              <option value="all">All Sessions</option>
              <option value="waiting">Waiting</option>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-2">
            {filteredSessions.map((session) => (
              <Card
                key={session._id}
                className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                  selectedSession?._id === session._id ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => handleSessionSelect(session)}
              >
                <CardContent className="p-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="font-medium text-sm truncate">
                          {session.userName}
                        </span>
                        {session.unreadCount > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {session.unreadCount}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-1">
                        {session.userEmail}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <Badge className={`text-xs ${getStatusColor(session.status)}`}>
                          {getStatusIcon(session.status)}
                          <span className="ml-1">{session.status}</span>
                        </Badge>
                        <span className="text-xs text-gray-400">
                          {formatDistanceToNow(new Date(session.lastMessageAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 flex flex-col">
        {selectedSession ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{selectedSession.userName}</h3>
                    <p className="text-sm text-gray-500">{selectedSession.userEmail}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <select
                    value={selectedSession.status}
                    onChange={(e) => handleStatusChange(selectedSession._id, e.target.value)}
                    className="px-3 py-1 border rounded-md text-sm"
                  >
                    <option value="waiting">Waiting</option>
                    <option value="active">Active</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message._id}
                    className={`flex ${message.senderRole === "admin" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.senderRole === "admin"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.senderRole === "admin" ? "text-blue-100" : "text-gray-500"
                        }`}
                      >
                        {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
                
                {typingUsers.length > 0 && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 px-4 py-2 rounded-lg">
                      <p className="text-sm text-gray-600">
                        {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing...
                      </p>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t bg-white">
              <div className="flex space-x-2">
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value)
                    handleTyping(e.target.value.length > 0)
                  }}
                  onKeyPress={handleKeyPress}
                  onBlur={() => handleTyping(false)}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage} 
                  disabled={!newMessage.trim() || !isConnected}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Select a chat session
              </h3>
              <p className="text-gray-500">
                Choose a session from the list to start chatting with customers
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
