import mongoose, { Schema, Document, model, models } from "mongoose"

export interface IChatSession extends Document {
  userId: mongoose.Types.ObjectId
  userName: string
  userEmail: string
  status: "active" | "closed" | "waiting"
  createdAt: Date
  updatedAt: Date
  lastMessageAt: Date
  unreadCount: number
}

export interface IChatMessage extends Document {
  sessionId: mongoose.Types.ObjectId
  senderId: mongoose.Types.ObjectId
  senderName: string
  senderRole: "admin" | "customer"
  content: string
  messageType: "text" | "image" | "file"
  isRead: boolean
  createdAt: Date
}

const ChatSessionSchema = new Schema<IChatSession>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "closed", "waiting"],
    default: "active",
  },
  unreadCount: {
    type: Number,
    default: 0,
  },
  lastMessageAt: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
})

const ChatMessageSchema = new Schema<IChatMessage>({
  sessionId: {
    type: Schema.Types.ObjectId,
    ref: "ChatSession",
    required: true,
  },
  senderId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  senderName: {
    type: String,
    required: true,
  },
  senderRole: {
    type: String,
    enum: ["admin", "customer"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  messageType: {
    type: String,
    enum: ["text", "image", "file"],
    default: "text",
  },
  isRead: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
})

export const ChatSession = models.ChatSession || model<IChatSession>("ChatSession", ChatSessionSchema)
export const ChatMessage = models.ChatMessage || model<IChatMessage>("ChatMessage", ChatMessageSchema)
