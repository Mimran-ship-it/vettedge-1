import { type NextRequest, NextResponse } from "next/server"
import { orderService } from "@/lib/services/order-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (userId) {
      const orders = await orderService.getOrdersByUserId(userId)
      return NextResponse.json(orders)
    } else {
      const orders = await orderService.getAllOrders()
      return NextResponse.json(orders)
    }
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json()
    const order = await orderService.createOrder(orderData)
    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
