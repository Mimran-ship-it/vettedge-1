import mongoose, { Schema, Document, model, models } from "mongoose"

export interface IOrder extends Document {
  userId: string
  customerName: string
  customerEmail: string
  domainName: string
  domainId: string
  totalAmount: number
  status: "pending" | "completed" | "cancelled" | "failed"
  paymentId?: string
  paymentMethod: string
  createdAt: Date
  updatedAt: Date
}

const OrderSchema = new Schema<IOrder>({
  userId: {
    type: String,
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  customerEmail: {
    type: String,
    required: true,
  },
  domainName: {
    type: String,
    required: true,
  },
  domainId: {
    type: String,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "cancelled", "failed"],
    default: "pending",
  },
  paymentId: {
    type: String,
  },
  paymentMethod: {
    type: String,
    required: true,
    default: "stripe",
  },
}, {
  timestamps: true,
})

export const Order = models.Order || model<IOrder>("Order", OrderSchema)
export default Order
