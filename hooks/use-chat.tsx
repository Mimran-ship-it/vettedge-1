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
  sendAttachment: (file: File) => Promise<void>;
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

  // visibility ref (used to decide whether to increment unread)
  const isPageVisibleRef = useRef<boolean>(true);

  // reset dedupe when session changes
  useEffect(() => {
    processedMessageIds.current = new Set();
  }, [currentSession?._id]);

  // track page visibility (do not cause re-subscribes)
  useEffect(() => {
    const handleVisibility = () => {
      const visible = document.visibilityState === "visible";
      isPageVisibleRef.current = visible;
      // optionally clear unread when user returns to the page
      if (visible) {
        setUnreadCount(0);
      }
    };
    // set initial
    isPageVisibleRef.current = typeof document !== "undefined" ? document.visibilityState === "visible" : true;
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

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
        // We reset unread since we're explicitly fetching messages for the session
       
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
    if (!currentSession) return;
    
    // If no pusher, just return early (basic functionality without real-time)
    if (!pusher) {
      console.log("No Pusher connection, using basic chat mode");
      return;
    }

    const channelName = `session-${currentSession._id}`;
    const channel = pusher.subscribe(channelName) as any;

    const onNewMessage = (msg: ChatMessage) => {
      // dedupe
      if (processedMessageIds.current.has(msg._id)) return;
      processedMessageIds.current.add(msg._id);

      // If message belongs to this session, append it
      if (msg.sessionId === currentSession._id) {
        setMessages((prev) => {
          // avoid duplicates in state
          if (prev.some((m) => m._id === msg._id)) return prev;
          return [...prev, msg];
        });

        // If it's from the other party and the page is not visible, count as unread
        const isFromOtherParty = !!user && msg.senderId !== user.id;
        if (isFromOtherParty && !isPageVisibleRef.current) {
          setUnreadCount((s) => s + 1);
        }
      } else {
        // Message for other session:
        // increment unread if it's from the opposite role
        if (user?.role === "admin" && msg.senderRole === "customer") {
          setUnreadCount((s) => s + 1);
        } else if (user?.role === "customer" && msg.senderRole === "admin") {
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
    // note: we intentionally do not include isPageVisibleRef in deps (it's a ref)
  }, [pusher, currentSession, user]);

  // Admins: subscribe to admins channel for notifications about new customer messages
  useEffect(() => {
    if (!user || user.role !== "admin") return;
    
    // If no pusher, skip real-time admin notifications
    if (!pusher) {
      console.log("No Pusher connection, admin notifications disabled");
      return;
    }

    const adminChannel = pusher.subscribe("admins") as any;

    const onNewCustomer = (payload: { sessionId: string; customerName?: string; content?: string }) => {
      console.log("admin received new_customer_message:", payload);
      // Increment unread unless page is visible and admin is viewing that session.
      // We can't reliably know if admin is viewing that specific session here, so increment.
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
    console.log("createSession called:", { user: !!user, isCreatingSession });
    if (!user || isCreatingSession) return;
    setIsCreatingSession(true);
    try {
      console.log("Creating session via API...");
      const res = await fetch("/api/chat/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      console.log("Create session response status:", res.status);
      if (!res.ok) {
        console.error("Failed to create session:", res.status, await res.text());
        setIsCreatingSession(false);
        return;
      }
      const data = await res.json();
      console.log("Create session response data:", data);
      const session: ChatSession = data.session;
      if (session && session._id) {
        console.log("Joining session:", session._id);
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
    console.log("sendMessage called with:", { content, user: !!user, currentSession: !!currentSession });
    
    if (!user) {
      console.warn("sendMessage: user not signed in");
      return;
    }
    if (!currentSession) {
      console.warn("sendMessage: no current session, attempting to create one...");
      console.log("Available data:", { user: user?.email, isConnected, isCreatingSession });
      
      // Try to create a session first
      if (!isCreatingSession && user.role === "customer") {
        try {
          await createSession();
          // Wait a moment for the session to be set
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // Try again after session creation
          if (currentSession) {
            return sendMessage(content);
          }
        } catch (err) {
          console.error("Failed to create session for message:", err);
        }
      }
      return;
    }

    console.log("Creating optimistic message for session:", currentSession._id);
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
    console.log("Adding optimistic message:", optimisticMessage);
    setMessages((prev) => [...prev, optimisticMessage]);

    try {
      console.log("Sending message to API...");
      const res = await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, sessionId: currentSession._id }),
        credentials: "include",
      });
      console.log("API response status:", res.status);
      if (!res.ok) {
        console.error("Failed to send message:", res.status, await res.text());
        setMessages((prev) => prev.filter((m) => m._id !== tempId));
      } else {
        // If no Pusher, manually refresh messages after sending
        if (!pusher) {
          setTimeout(() => fetchMessages(currentSession._id), 500);
        }
      }
    } catch (err) {
      console.error("Failed to send message (network):", err);
      setMessages((prev) => prev.filter((m) => m._id !== tempId));
    }
  };

  const sendAttachment = async (file: File): Promise<void> => {
    console.log("sendAttachment called with:", { fileName: file.name, user: !!user, currentSession: !!currentSession });
    
    if (!user) {
      console.warn("sendAttachment: user not signed in");
      return;
    }
    if (!currentSession) {
      console.warn("sendAttachment: no current session, attempting to create one...");
      
      // Try to create a session first
      if (!isCreatingSession && user.role === "customer") {
        try {
          await createSession();
          // Wait a moment for the session to be set
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // Try again after session creation
          if (currentSession) {
            return sendAttachment(file);
          }
        } catch (err) {
          console.error("Failed to create session for attachment:", err);
        }
      }
      return;
    }

    try {
      console.log("Uploading file to /api/chat/upload...");
      const fd = new FormData();
      fd.append("file", file);
      const uploadRes = await fetch("/api/chat/upload", {
        method: "POST",
        body: fd,
        credentials: "include",
      });
      console.log("Upload response status:", uploadRes.status);
      if (!uploadRes.ok) {
        console.error("Failed to upload file:", uploadRes.status, await uploadRes.text());
        return;
      }
      const { url, messageType } = await uploadRes.json();
      console.log("Upload successful:", { url, messageType });
      const type: ChatMessage["messageType"] = messageType === "image" ? "image" : "file";

      const tempId = `temp-${Date.now()}`;
      const optimisticMessage: ChatMessage = {
        _id: tempId,
        sessionId: currentSession._id,
        senderId: user.id,
        senderName: user.name || "You",
        senderRole: user.role,
        content: url,
        messageType: type,
        isRead: true,
        createdAt: new Date().toISOString(),
      };
      console.log("Adding attachment message:", optimisticMessage);
      setMessages((prev) => [...prev, optimisticMessage]);

      console.log("Sending attachment message to API...");
      const res = await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: url, sessionId: currentSession._id, messageType: type }),
        credentials: "include",
      });
      console.log("Message API response status:", res.status);
      if (!res.ok) {
        console.error("Failed to send attachment message:", res.status, await res.text());
        setMessages((prev) => prev.filter((m) => m._id !== tempId));
      } else {
        // If no Pusher, manually refresh messages after sending
        if (!pusher) {
          setTimeout(() => fetchMessages(currentSession._id), 500);
        }
      }
    } catch (err) {
      console.error("sendAttachment error:", err);
    }
  };

  const refreshMessages = async (): Promise<void> => {
    if (currentSession) {
      await fetchMessages(currentSession._id);
    }
  };

  /* ----------------------- Auto-create for customers ----------------------- */
  useEffect(() => {
    console.log("Auto-create session effect:", { 
      user: !!user, 
      userRole: user?.role, 
      currentSession: !!currentSession, 
      pusher: !!pusher, 
      isConnected, 
      isCreatingSession 
    });
    
    if (
      user &&
      user.role === "customer" &&
      !currentSession &&
      !isCreatingSession
    ) {
      console.log("Auto-creating session for customer...");
      createSession().catch((e) => console.error("auto create session error:", e));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, currentSession, isCreatingSession]);

  /* ------------------------- Context value ------------------------- */
  const contextValue: ChatContextType = {
    messages,
    currentSession,
    unreadCount,
    isConnected,
    sendMessage,
    sendAttachment,
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
