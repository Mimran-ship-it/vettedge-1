// pages/api/socket.ts
import { NextApiRequest, NextApiResponse } from "next"
import { Server as NetServer } from "http"
import { Server as SocketIOServer, Socket } from "socket.io"
import jwt from "jsonwebtoken"
import { connectDB } from "@/lib/db"
import UserModel from "@/lib/models/User"
import { ChatSession, ChatMessage } from "@/lib/models/chat"
import { getSocketToken } from "@/lib/token"

// Extend Socket interface to include custom properties
interface CustomSocket extends Socket {
  userId?: string
  userRole?: string
  userName?: string
  currentSession?: string
}

export type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: NetServer & {
      io: SocketIOServer
    }
  }
}

// Singleton database connection
let dbConnected = false;
async function ensureDBConnection() {
  if (!dbConnected) {
    console.log("🔌 Connecting to database...")
    await connectDB();
    dbConnected = true;
    console.log("✅ Database connected")
  }
}

const SocketHandler = async (req: NextApiRequest, res: NextApiResponseServerIO) => {
  console.log("📥 Socket API request received")
  
  if (res.socket.server.io) {
    console.log("🔄 Socket is already running")
    res.end()
    return
  }
  
  console.log("🚀 Socket is initializing")
  
  // Verify JWT_SECRET is configured
  if (!process.env.JWT_SECRET) {
    console.error("❌ JWT_SECRET is not defined in environment variables");
    res.status(500).end("Server configuration error");
    return;
  }
  
  console.log("✅ JWT_SECRET is configured")
  
  const io = new SocketIOServer(res.socket.server, {
    path: "/api/socket",
    addTrailingSlash: false,
    cors: {
      origin: process.env.NODE_ENV === "production" 
        ? process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:3000"] 
        : "*",
      methods: ["GET", "POST"],
      credentials: true
    },
    pingTimeout: 60000,
    pingInterval: 25000,
    connectTimeout: 45000,
    transports: ["websocket", "polling"]
  })

  console.log("✅ Socket.IO server created")

  // Authentication middleware with timeout
  io.use(async (socket: CustomSocket, next) => {
    try {
      console.log("🔐 Authentication middleware called")
      
      const token = getSocketToken(socket.handshake);
      if (!token) {
        console.error("❌ Authentication error: No token provided");
        return next(new Error("Authentication error: No token provided"));
      }
      
      console.log("🔑 Token found, attempting to verify")
      
      // Add timeout for authentication
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Authentication timeout")), 5000);
      });
      
      const authPromise = (async () => {
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
        console.log("✅ Token verified, user ID:", decoded.userId);
        
        await ensureDBConnection();
        console.log("✅ Database connected");
        
        const user = await UserModel.findById(decoded.userId).lean().exec();
        if (!user) {
          console.error("❌ User not found in database");
          throw new Error("User not found");
        }
        
        socket.userId = user._id.toString();
        socket.userRole = user.role;
        socket.userName = user.name;
        
        console.log(`✅ User authenticated: ${socket.userName} (${socket.userId})`);
      })();
      
      await Promise.race([authPromise, timeoutPromise]);
      next();
    } catch (err) {
      console.error("❌ Socket auth error:", err);
      next(new Error(err instanceof Error ? err.message : "Authentication error"));
    }
  })

  io.on("connection", (socket: CustomSocket) => {
    console.log(`🔌 User connected: ${socket.userId} (${socket.userName})`)
    
    // Join user to their personal room
    socket.join(`user:${socket.userId}`)
    
    // Join admins to admin room
    if (socket.userRole === "admin") {
      socket.join("admins")
    }
    
    // Join session
    socket.on("join_session", async (sessionId: string) => {
      try {
        console.log(`🔗 User ${socket.userName} attempting to join session ${sessionId}`);
        await ensureDBConnection();
        
        const session = await ChatSession.findById(sessionId);
        if (!session) {
          console.error(`❌ Session not found: ${sessionId}`);
          socket.emit("error", { message: "Session not found" });
          return;
        }
        
        // Check if user has access to this session
        if (socket.userRole !== "admin" && session.userId.toString() !== socket.userId) {
          console.error(`❌ Access denied for user ${socket.userName} to session ${sessionId}`);
          socket.emit("error", { message: "Access denied" });
          return;
        }
        
        socket.currentSession = sessionId;
        socket.join(`session:${sessionId}`);
        
        console.log(`✅ User ${socket.userName} joined session ${sessionId}`);
        socket.emit("session_joined", { sessionId });
      } catch (error) {
        console.error("❌ Join session error:", error);
        socket.emit("error", { 
          message: "Failed to join session",
          details: error instanceof Error ? error.message : "Unknown error"
        });
      }
    })
    
    // Send message
    socket.on("send_message", async (data: { sessionId?: string; content: string }) => {
      try {
        console.log(`📨 Message from ${socket.userName}:`, data);
        await ensureDBConnection();
        
        let session;
        if (data.sessionId) {
          session = await ChatSession.findById(data.sessionId);
          if (!session) {
            console.error(`❌ Session not found: ${data.sessionId}`);
            socket.emit("error", { message: "Session not found" });
            return;
          }
        } else {
          // Find or create session for this user
          session = await ChatSession.findOne({ 
            userId: socket.userId, 
            status: { $in: ["active", "waiting"] }
          });
          
          if (!session) {
            console.log(`🆕 Creating new session for user: ${socket.userName}`);
            session = new ChatSession({
              userId: socket.userId,
              userName: socket.userName,
              userEmail: "unknown@example.com",
              status: "waiting"
            });
            await session.save();
            console.log(`✅ New session created: ${session._id}`);
          }
        }
        
        // Check access
        if (socket.userRole !== "admin" && session.userId.toString() !== socket.userId) {
          console.error(`❌ Access denied for user ${socket.userName} to session ${session._id}`);
          socket.emit("error", { message: "Access denied" });
          return;
        }
        
        // Create message
        const message = new ChatMessage({
          sessionId: session._id,
          senderId: socket.userId,
          senderName: socket.userName,
          senderRole: socket.userRole,
          content: data.content,
          messageType: "text",
          isRead: false
        });
        await message.save();
        console.log(`✅ Message saved: ${message._id}`);
        
        // Update session
        await ChatSession.findByIdAndUpdate(session._id, {
          lastMessageAt: new Date(),
          $inc: { unreadCount: socket.userRole === "admin" ? 0 : 1 }
        });
        
        console.log(`📡 Emitting new_message to session room: session:${session._id}`);
        
        // Emit to session room (this will reach all participants including sender)
        io.to(`session:${session._id}`).emit("new_message", {
          _id: message._id,
          sessionId: session._id,
          senderId: socket.userId,
          senderName: socket.userName,
          senderRole: socket.userRole,
          content: data.content,
          messageType: "text",
          isRead: false,
          createdAt: message.createdAt
        });
        
        // Notify admins if customer sent message
        if (socket.userRole === "customer") {
          io.to("admins").emit("new_customer_message", {
            sessionId: data.sessionId,
            customerName: socket.userName,
            content: data.content
          });
        }
      } catch (error) {
        console.error("❌ Send message error:", error);
        socket.emit("error", { 
          message: "Failed to send message",
          details: error instanceof Error ? error.message : "Unknown error"
        });
      }
    })
    
    // Typing indicator
    socket.on("typing", (data: { sessionId: string; isTyping: boolean }) => {
      socket.to(`session:${data.sessionId}`).emit("user_typing", {
        userId: socket.userId,
        userName: socket.userName,
        isTyping: data.isTyping
      });
    })
    
    // Update session status (admin only)
    socket.on("update_session_status", async (data: { sessionId: string; status: string }) => {
      if (socket.userRole !== "admin") {
        console.error(`❌ Unauthorized status update attempt by ${socket.userName}`);
        socket.emit("error", { message: "Access denied" });
        return;
      }
      
      try {
        await ensureDBConnection();
        const session = await ChatSession.findByIdAndUpdate(
          data.sessionId,
          { status: data.status },
          { new: true }
        );
        
        if (session) {
          console.log(`✅ Session ${data.sessionId} status updated to ${data.status}`);
          io.to(`session:${data.sessionId}`).emit("session_status_updated", {
            sessionId: data.sessionId,
            status: data.status
          });
        } else {
          console.error(`❌ Session not found for status update: ${data.sessionId}`);
        }
      } catch (error) {
        console.error("❌ Update session status error:", error);
        socket.emit("error", { 
          message: "Failed to update session status",
          details: error instanceof Error ? error.message : "Unknown error"
        });
      }
    })
    
    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${socket.userId} (${socket.userName})`)
    })
  })
  
  res.socket.server.io = io
  console.log("✅ Socket.IO server attached to response")
  res.end()
}

export default SocketHandler

export const config = {
  api: {
    bodyParser: false,
  },
}