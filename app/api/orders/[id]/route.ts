import { NextRequest, NextResponse } from "next/server"
import { verifyJwt } from "@/lib/jwt"
import { orderService } from "@/lib/services/order-service"

// Mock order data for demo
const mockOrders: any = {}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const orderId = params.id

    // Return mock order data
    const mockOrder = mockOrders[orderId] || {
      id: orderId,
      total: 2500,
      status: "Completed",
      createdAt: new Date().toISOString(),
      items: [
        {
          domain: {
            name: "example.com",
            price: 1500,
            category: "Technology",
          },
        },
        {
          domain: {
            name: "demo.com",
            price: 1000,
            category: "Business",
          },
        },
      ],
    }

    return NextResponse.json(mockOrder)
  } catch (error) {
    console.error("Error fetching order:", error)
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyJwt(token)
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { status } = body

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 })
    }

    const success = await orderService.updateOrderStatus(params.id, status)
    
    if (success) {
      return NextResponse.json({ message: "Order status updated successfully" })
    } else {
      return NextResponse.json({ error: "Failed to update order status" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error updating order status:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
