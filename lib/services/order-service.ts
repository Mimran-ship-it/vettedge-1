import Order, { IOrder } from "@/lib/models/order"

export class OrderService {
  async createOrder(orderData: Omit<IOrder, "_id" | "createdAt" | "updatedAt">) {
    const now = new Date()
    const newOrder = new Order({
      ...orderData,
      createdAt: now,
      updatedAt: now,
    })
    
    const savedOrder = await newOrder.save()
    return { ...savedOrder.toObject(), id: savedOrder._id.toString() }
  }

  async getOrderById(id: string) {
    const order = await Order.findById(id)
    return order ? { ...order.toObject(), id: order._id.toString() } : null
  }

  async getOrdersByUserId(userId: string) {
    const orders = await Order.find({ userId }).sort({ createdAt: -1 })
    return orders.map((order) => ({ ...order.toObject(), id: order._id.toString() }))
  }

  async getAllOrders() {
    const orders = await Order.find({}).sort({ createdAt: -1 })
    return orders.map((order) => ({ ...order.toObject(), id: order._id.toString() }))
  }

  async updateOrderStatus(id: string, status: IOrder["status"], paymentId?: string) {
    const updateData: any = { status, updatedAt: new Date() }
    if (paymentId) updateData.paymentId = paymentId

    const result = await Order.findByIdAndUpdate(id, updateData, { new: true })
    return result !== null
  }

  async getOrderStats() {
    const stats = await Order.aggregate([
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
