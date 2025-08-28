// import { type NextRequest, NextResponse } from "next/server"

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json()
//     const { amount, currency = "USD", paymentMethod } = body

//     // Simulate payment processing delay
//     await new Promise((resolve) => setTimeout(resolve, 2000))

//     // Mock successful payment
//     const mockPaymentResult = {
//       id: `mock_payment_${Date.now()}`,
//       status: "succeeded",
//       amount,
//       currency,
//       paymentMethod,
//       created: new Date().toISOString(),
//       description: "Domain purchase payment",
//     }

//     return NextResponse.json({
//       success: true,
//       payment: mockPaymentResult,
//     })
//   } catch (error) {
//     console.error("Mock payment error:", error)
//     return NextResponse.json({ success: false, error: "Payment processing failed" }, { status: 500 })
//   }
// }


import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-07-30.basil",
})


export async function POST(request: NextRequest) {
  try {
    const { amount, currency = "usd" } = await request.json()

    // Stripe expects amount in cents → 10 USD = 1000
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: { enabled: true },
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (error: any) {
    console.error("Stripe error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
