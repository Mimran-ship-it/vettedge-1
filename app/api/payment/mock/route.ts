import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, currency = "USD", paymentMethod } = body

    // Simulate payment processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock successful payment
    const mockPaymentResult = {
      id: `mock_payment_${Date.now()}`,
      status: "succeeded",
      amount,
      currency,
      paymentMethod,
      created: new Date().toISOString(),
      description: "Domain purchase payment",
    }

    return NextResponse.json({
      success: true,
      payment: mockPaymentResult,
    })
  } catch (error) {
    console.error("Mock payment error:", error)
    return NextResponse.json({ success: false, error: "Payment processing failed" }, { status: 500 })
  }
}
