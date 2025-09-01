"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useRef,
  useCallback,
} from "react";
import { useAuth } from "@/hooks/use-auth";
import { useRealtime } from "@/hooks/use-pusher";

/* ----------------------------- Types ----------------------------- */
interface ChatMessage {
  _id: string;
  sessionId: string;
  senderId: string;
  senderName: string;
  senderRole: "admin" | "customer";
  content: string;
  messageType: "text" | "image" | "file";
  isRead: boolean;
  createdAt: string;
}

interface ChatSession {
  _id: string;
  userId: string;
  userName: string;
  userEmail: string;
  status: "active" | "closed" | "waiting";
  unreadCount: number;
  lastMessageAt: string;
  createdAt: string;
  updatedAt: string;
}

interface ChatContextType {
  messages: ChatMessage[];
  currentSession: ChatSession | null;
  unreadCount: number;
  isConnected: boolean;
  sendMessage: (content: string) => Promise<void>;
  createSession: () => Promise<void>;
  joinSession: (sessionId: string) => Promise<void>;
  refreshMessages: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

/* --------------------------- Provider ----------------------------- */
export function ChatProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { pusher, isConnected } = useRealtime();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  
  // dedupe incoming messages
  const processedMessageIds = useRef<Set<string>>(new Set());
  
  // reset dedupe when session changes
  useEffect(() => {
    processedMessageIds.current = new Set();
  }, [currentSession?._id]);

  // Fetch messages with useCallback to stabilize the function
  const fetchMessages = useCallback(async (sessionId: string) => {
    try {
      const res = await fetch(`/api/chat/messages?sessionId=${encodeURIComponent(sessionId)}`, {
        credentials: "include",
      });
      if (!res.ok) {
        console.error("Failed to fetch messages:", res.status, await res.text());
        return;
      }
      const data = await res.json();
      if (Array.isArray(data.messages)) {
        data.messages.forEach((m: ChatMessage) => processedMessageIds.current.add(m._id));
        setMessages(data.messages);
        setUnreadCount(0);
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  }, []);

  // Auto-refresh messages every 30 seconds when session is active
  useEffect(() => {
    if (!currentSession || !isConnected) return;
    
    const intervalId = setInterval(() => {
      fetchMessages(currentSession._id);
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(intervalId);
  }, [currentSession, isConnected, fetchMessages]);

  // Subscribe to session channel (and update messages) when pusher + session are available
  useEffect(() => {
    if (!pusher || !currentSession) return;
    
    const channelName = `session-${currentSession._id}`;
    const channel = pusher.subscribe(channelName) as any;
    
    const onNewMessage = (msg: ChatMessage) => {
      // dedupe
      if (processedMessageIds.current.has(msg._id)) return;
      processedMessageIds.current.add(msg._id);
      
      // if belongs to this session, append
      if (msg.sessionId === currentSession._id) {
        setMessages((prev) => {
          // avoid duplicates in state
          if (prev.some((m) => m._id === msg._id)) return prev;
          return [...prev, msg];
        });
      } else {
        // messages for other sessions increase unread if customer
        if (msg.senderRole === "admin" && user?.role === "customer") {
          setUnreadCount((s) => s + 1);
        }
      }
    };
    
    const onSessionStatus = (payload: { sessionId: string; status: ChatSession["status"] }) => {
      if (payload?.sessionId === currentSession._id) {
        setCurrentSession((prev) => (prev ? { ...prev, status: payload.status } : prev));
      }
    };
    
    channel.bind("new_message", onNewMessage);
    channel.bind("session_status_updated", onSessionStatus);
    
    return () => {
      try {
        channel.unbind("new_message", onNewMessage);
        channel.unbind("session_status_updated", onSessionStatus);
        pusher.unsubscribe(channelName);
      } catch (e) {
        /* ignore */
      }
    };
  }, [pusher, currentSession, user]);

  // Admins: subscribe to admins channel for notifications about new customer messages
  useEffect(() => {
    if (!pusher || !user || user.role !== "admin") return;
    
    const adminChannel = pusher.subscribe("admins") as any;
    
    const onNewCustomer = (payload: { sessionId: string; customerName?: string; content?: string }) => {
      console.log("admin received new_customer_message:", payload);
      // you can implement UI logic here (e.g., show badge), for now we increment unread
      setUnreadCount((s) => s + 1);
    };
    
    adminChannel.bind("new_customer_message", onNewCustomer);
    
    return () => {
      try {
        adminChannel.unbind("new_customer_message", onNewCustomer);
        pusher.unsubscribe("admins");
      } catch (e) {
        /* ignore */
      }
    };
  }, [pusher, user]);

  /* -------------------------- Helpers -------------------------- */
  
  // Try to fetch full session object. If not found, return a minimal (safe) session object.
  const fetchSessionData = async (sessionId: string): Promise<ChatSession | null> => {
    try {
      // try GET /api/chat/sessions/:id
      let res = await fetch(`/api/chat/sessions/${encodeURIComponent(sessionId)}`, {
        credentials: "include",
      });
      if (!res.ok) {
        // fallback to query-style endpoint if the id route is not implemented
        res = await fetch(`/api/chat/sessions?sessionId=${encodeURIComponent(sessionId)}`, {
          credentials: "include",
        });
      }
      if (!res.ok) {
        return null;
      }
      const data = await res.json();
      // accept `data.session` or `data` shaped like the session
      const session: ChatSession | undefined = data.session ?? data;
      if (session && session._id) return session;
      return null;
    } catch (err) {
      console.warn("fetchSessionData error (returning null):", err);
      return null;
    }
  };

  /* -------------------------- Actions -------------------------- */
  const createSession = async (): Promise<void> => {
    if (!user || isCreatingSession) return;
    setIsCreatingSession(true);
    try {
      const res = await fetch("/api/chat/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!res.ok) {
        console.error("Failed to create session:", res.status, await res.text());
        return;
      }
      const data = await res.json();
      const session: ChatSession = data.session;
      if (session && session._id) {
        // set session and fetch messages
        await joinSession(session._id);
      } else {
        console.error("createSession: server did not return session");
      }
    } catch (err) {
      console.error("Error creating session:", err);
    } finally {
      setIsCreatingSession(false);
    }
  };

  const joinSession = async (sessionId: string): Promise<void> => {
    if (!sessionId) return;
    // fetch messages first (so messages appear quickly)
    await fetchMessages(sessionId);
    // fetch session data if available
    const sessionData = await fetchSessionData(sessionId);
    if (sessionData) {
      setCurrentSession(sessionData);
    } else {
      // fallback minimal session (safe, fully typed)
      const fallback: ChatSession = {
        _id: sessionId,
        userId: "",
        userName: "",
        userEmail: "",
        status: "active",
        unreadCount: 0,
        lastMessageAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setCurrentSession(fallback);
    }
  };

  const sendMessage = async (content: string): Promise<void> => {
    if (!user) {
      console.warn("sendMessage: user not signed in");
      return;
    }
    if (!currentSession) {
      console.warn("sendMessage: no current session");
      console.log('user is',user)
      return;
    }
  
    // Create a temp (optimistic) message
    const tempId = `temp-${Date.now()}`;
    const optimisticMessage: ChatMessage = {
      _id: tempId,
      sessionId: currentSession._id,
      senderId: user.id,
      senderName: user.name || "You",
      senderRole: user.role,
      content,
      messageType: "text",
      isRead: true,
      createdAt: new Date().toISOString(),
    };
  
    // Push immediately to UI
    setMessages((prev) => [...prev, optimisticMessage]);
  
    try {
      const res = await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, sessionId: currentSession._id }),
        credentials: "include",
      });
  
      if (!res.ok) {
        console.error("Failed to send message:", res.status, await res.text());
        // Optionally mark optimistic message as failed
        setMessages((prev) => prev.filter((m) => m._id !== tempId));
      }
      // Otherwise we rely on Pusher to replace this optimistic message with the real one
    } catch (err) {
      console.error("Failed to send message (network):", err);
      // Rollback optimistic message on error
      setMessages((prev) => prev.filter((m) => m._id !== tempId));
    }
  };

  // Function to manually refresh messages
  const refreshMessages = async (): Promise<void> => {
    if (currentSession) {
      await fetchMessages(currentSession._id);
    }
  };
  
  /* ----------------------- Auto-create for customers ----------------------- */
  useEffect(() => {
    if (
      user &&
      user.role === "customer" &&
      !currentSession &&
      pusher &&
      isConnected &&
      !isCreatingSession
    ) {
      // auto-create session if none
      createSession().catch((e) => console.error("auto create session error:", e));
    }
    // we intentionally don't want createSession as dependency (it is stable here)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, currentSession, pusher, isConnected, isCreatingSession]);

  /* ------------------------- Context value ------------------------- */
  const contextValue: ChatContextType = {
    messages,
    currentSession,
    unreadCount,
    isConnected,
    sendMessage,
    createSession,
    joinSession,
    refreshMessages,
  };

  return <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>;
}

/* --------------------------- Hook export --------------------------- */
export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within a ChatProvider");
  return ctx;
}

export { ChatContext };