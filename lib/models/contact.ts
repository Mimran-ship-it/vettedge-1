import mongoose, { Schema, Document, model, models } from "mongoose"

export interface IContact extends Document {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  status: "new" | "read" | "replied" | "resolved"
  createdAt: Date
  updatedAt: Date
}

const ContactSchema = new Schema<IContact>({
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    minlength: [2, "Name must be at least 2 characters long"],
    maxlength: [100, "Name cannot exceed 100 characters"]
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"]
  },
  phone: {
    type: String,
    trim: true,
    maxlength: [20, "Phone number cannot exceed 20 characters"]
  },
  subject: {
    type: String,
    required: [true, "Subject is required"],
    trim: true,
    minlength: [3, "Subject must be at least 3 characters long"],
    maxlength: [200, "Subject cannot exceed 200 characters"]
  },
  message: {
    type: String,
    required: [true, "Message is required"],
    trim: true,
    minlength: [10, "Message must be at least 10 characters long"],
    maxlength: [2000, "Message cannot exceed 2000 characters"]
  },
  status: {
    type: String,
    enum: ["new", "read", "replied", "resolved"],
    default: "new"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

// Update the updatedAt field before saving
ContactSchema.pre('save', function(next) {
  this.updatedAt = new Date()
  next()
})

const ContactModel = models.Contact || model<IContact>("Contact", ContactSchema)

export default ContactModel
