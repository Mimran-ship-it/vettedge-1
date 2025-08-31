"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useRef,
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
  markSessionRead: (sessionId?: string) => Promise<void>;
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

  /* ------------------- Helper: normalize user id/name ------------------- */
  const getUserId = () => {
    // tolerant to different auth shapes
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const u = user as any;
    return (u?._id ?? u?.id ?? "") as string;
  };
  const getUserName = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const u = user as any;
    return (u?.name ?? u?.fullName ?? "You") as string;
  };

  /* ------------------- Subscribe to session channel ------------------- */
  useEffect(() => {
    if (!pusher || !currentSession) return;

    const channelName = `session-${currentSession._id}`;
    const channel = pusher.subscribe(channelName) as any;
    const onNewMessage = (msg: ChatMessage) => {
      if (!msg || !msg._id) return;
    
      // dedupe
      if (processedMessageIds.current.has(msg._id)) return;
      processedMessageIds.current.add(msg._id);
    
      const isCurrent = msg.sessionId === currentSession?._id;
    
      setMessages((prev) => {
        if (isCurrent) {
          // replace optimistic
          const optIndex = prev.findIndex(
            (m) =>
              m._id.startsWith("temp-") &&
              m.senderId === msg.senderId &&
              m.content === msg.content
          );
    
          if (optIndex > -1) {
            const next = [...prev];
            next[optIndex] = msg;
            return next;
          }
    
          if (!prev.some((m) => m._id === msg._id)) {
            return [...prev, msg];
          }
          return prev;
        }
        return prev;
      });
    
      /* ---------- UNREAD COUNT LOGIC ---------- */
      if (user?.role === "customer") {
        if (msg.senderRole === "admin") {
          const pageVisible =
            typeof document !== "undefined" && document.visibilityState === "visible";
      
          // increment if not current OR (current but chat not actively open)
          const shouldIncrement = !isCurrent || !pageVisible;
      
          if (shouldIncrement) {
            setUnreadCount((s) => s + 1);
          }
        }
      }
      
      else if (user?.role === "admin") {
        // Admin receives from customer
        if (msg.senderRole === "customer") {
          const pageVisible =
            typeof document !== "undefined" && document.visibilityState === "visible";
          if (!isCurrent || !pageVisible) {
            setUnreadCount((s) => s + 1);
          }
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

  /* ---------------- Admin-channel notifications ---------------- */
  useEffect(() => {
    if (!pusher || !user || user.role !== "admin") return;

    const adminChannel = pusher.subscribe("admins") as any;

    const onNewCustomer = (payload: { sessionId: string; customerName?: string; content?: string }) => {
      // admin UI might show overall unread badge
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

  const fetchMessages = async (sessionId: string) => {
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
        // seed processed ids to avoid duplicate re-processing
        data.messages.forEach((m: ChatMessage) => processedMessageIds.current.add(m._id));
        setMessages(data.messages);
        // when fetching messages for the session we consider them read
        setUnreadCount(0);
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  // Try to fetch full session object. If not found, return a minimal (safe) session object.
  const fetchSessionData = async (sessionId: string): Promise<ChatSession | null> => {
    try {
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

    // fetched messages => clear unread
    setUnreadCount(0);

    // optionally notify server that messages were read
    try {
      await fetch("/api/chat/mark-read", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
    } catch (e) {
      // ignore server errors (non-critical)
    }
  };

  const sendMessage = async (content: string): Promise<void> => {
    if (!user) {
      console.warn("sendMessage: user not signed in");
      return;
    }
    if (!currentSession) {
      console.log('useer',user)
      console.warn("sendMessage: no current session");
      return;
    }

    // Create a temp (optimistic) message
    const tempId = `temp-${Date.now()}`;
    const optimisticMessage: ChatMessage = {
      _id: tempId,
      sessionId: currentSession._id,
      senderId: getUserId(),
      senderName: getUserName(),
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
        // Optionally mark optimistic message as failed (remove it)
        setMessages((prev) => prev.filter((m) => m._id !== tempId));
      }
      // We rely on Pusher to publish the stored message and our subscription to replace the optimistic msg
    } catch (err) {
      console.error("Failed to send message (network):", err);
      // Rollback optimistic message on error
      setMessages((prev) => prev.filter((m) => m._id !== tempId));
    }
  };

  /* ------------------ Clear / mark read ------------------ */

  const markSessionRead = async (sessionId?: string): Promise<void> => {
    const sid = sessionId ?? currentSession?._id;
    if (!sid) {
      setUnreadCount(0);
      return;
    }
    setUnreadCount(0);
    try {
      await fetch("/api/chat/mark-read", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: sid }),
      });
    } catch (e) {
      // ignore server errors for now
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, currentSession, pusher, isConnected, isCreatingSession]);

  /* ------------------ Visibility: quick UX improvement ------------------ */
  useEffect(() => {
    const onVisibility = () => {
      try {
        // If page becomes visible, clear unread for customers (they're likely to see messages)
        if (typeof document !== "undefined" && document.visibilityState === "visible") {
          if (user?.role === "customer") {
            setUnreadCount(0);
            // optionally call server to mark read for current session
            if (currentSession?._id) {
              fetch("/api/chat/mark-read", {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sessionId: currentSession._id }),
              }).catch(() => {});
            }
          }
        }
      } catch (e) {
        /* ignore */
      }
    };

    if (typeof document !== "undefined") {
      document.addEventListener("visibilitychange", onVisibility);
      return () => document.removeEventListener("visibilitychange", onVisibility);
    }
  }, [user, currentSession]);

  /* ------------------------- Context value ------------------------- */

  const contextValue: ChatContextType = {
    messages,
    currentSession,
    unreadCount,
    isConnected,
    sendMessage,
    createSession,
    joinSession,
    markSessionRead,
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
