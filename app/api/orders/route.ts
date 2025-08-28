import { NextResponse } from "next/server"
import Order from "@/lib/models/order"
import dbConnect from "@/lib/mongodb" // utility to connect MongoDB

export async function POST(req: Request) {
  try {
    await dbConnect()
    const body = await req.json()
    const {
      sessionId,
      customerEmail,
      items,
      totalAmount,
      paymentStatus,
      billingInfo,
      userId,
    } = body

    if (!sessionId || !customerEmail || !items || !billingInfo) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      )
    }

    // Prevent duplicate order creation
    const existingOrder = await Order.findOne({ sessionId })
    if (existingOrder) {
      return NextResponse.json(
        { message: "Order already exists" },
        { status: 200 }
      )
    }

    // Handle billingInfo - if it's a string, we need to parse it
    let parsedBillingInfo = billingInfo;
    if (typeof billingInfo === 'string') {
      try {
        // Remove the double braces at the beginning and end
        let jsonString = billingInfo.trim();
        
        // Handle the case with double braces: {{...}}
        if (jsonString.startsWith('{{') && jsonString.endsWith('}}')) {
          // Remove the outer braces
          jsonString = jsonString.substring(2, jsonString.length - 2);
          // Now we have: "firstName":"Admin",...
          // Add braces to make it valid JSON
          jsonString = `{${jsonString}}`;
        }
        
        // Parse the JSON string
        parsedBillingInfo = JSON.parse(jsonString);
      } catch (error) {
        console.error('Error parsing billingInfo string:', error);
        console.log('Original billingInfo:', billingInfo);
        
        // Provide default values if parsing fails
        parsedBillingInfo = {
          firstName: "Unknown",
          lastName: "",
          email: customerEmail || "unknown@example.com",
          phone: "",
          address: "",
          city: "",
          state: "",
          zipCode: "",
          country: ""
        };
      }
    }

    const order = await Order.create({
      sessionId,
      customerEmail,
      items,
      totalAmount,
      paymentStatus,
      billingInfo: parsedBillingInfo,
      userId: userId || "guest",
    })

    return NextResponse.json({ message: "Order saved", order }, { status: 201 })
  } catch (error: any) {
    console.error("Order save error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET() {
  try {
    await dbConnect()
    const orders = await Order.find().sort({ createdAt: -1 }) // latest orders first
    return NextResponse.json({ orders }, { status: 200 })
  } catch (error: any) {
    console.error("Fetching orders error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}