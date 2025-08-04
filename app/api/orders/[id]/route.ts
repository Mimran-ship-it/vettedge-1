import { type NextRequest, NextResponse } from "next/server"

// Mock order data for demo
const mockOrders: any = {}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const orderId = params.id

    // Return mock order data
    const mockOrder = mockOrders[orderId] || {
      id: orderId,
      total: 2500,
      status: "completed",
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
