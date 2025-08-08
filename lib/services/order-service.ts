import  connectDB  from "@/lib/mongodb"
import type { Order } from "@/lib/models/domain"
import { ObjectId } from "mongodb"

export class OrderService {
  private async getCollection() {
    const db = await connectDB()
    return db.collection<Order>("orders")
  }

  async createOrder(orderData: Omit<Order, "_id" | "id" | "createdAt" | "updatedAt">) {
    const collection = await this.getCollection()
    const now = new Date()

    const result = await collection.insertOne({
      ...orderData,
      createdAt: now,
      updatedAt: now,
    })

    return { ...orderData, id: result.insertedId.toString(), createdAt: now, updatedAt: now }
  }

  async getOrderById(id: string) {
    const collection = await this.getCollection()
    const order = await collection.findOne({ _id: new ObjectId(id) })
    return order ? { ...order, id: order._id?.toString() } : null
  }

  async getOrdersByUserId(userId: string) {
    const collection = await this.getCollection()
    const orders = await collection.find({ userId }).sort({ createdAt: -1 }).toArray()
    return orders.map((order) => ({ ...order, id: order._id?.toString() }))
  }

  async getAllOrders() {
    const collection = await this.getCollection()
    const orders = await collection.find({}).sort({ createdAt: -1 }).toArray()
    return orders.map((order) => ({ ...order, id: order._id?.toString() }))
  }

  async updateOrderStatus(id: string, status: Order["status"], paymentId?: string) {
    const collection = await this.getCollection()
    const updateData: any = { status, updatedAt: new Date() }
    if (paymentId) updateData.paymentId = paymentId

    const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: updateData })
    return result.modifiedCount > 0
  }

  async getOrderStats() {
    const collection = await this.getCollection()
    const stats = await collection
      .aggregate([
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalRevenue: { $sum: "$totalAmount" },
            completedOrders: {
              $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
            },
            pendingOrders: {
              $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
            },
          },
        },
      ])
      .toArray()

    return (
      stats[0] || {
        totalOrders: 0,
        totalRevenue: 0,
        completedOrders: 0,
        pendingOrders: 0,
      }
    )
  }
}

export const orderService = new OrderService()
