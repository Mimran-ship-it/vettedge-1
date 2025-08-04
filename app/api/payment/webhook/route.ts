import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { orderService } from "@/lib/services/order-service"
import { domainService } from "@/lib/services/domain-service"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature")!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error("Webhook signature verification failed:", err)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent
      const orderId = paymentIntent.metadata.orderId

      if (orderId) {
        // Update order status
        await orderService.updateOrderStatus(orderId, "completed", paymentIntent.id)

        // Mark domains as sold
        const order = await orderService.getOrderById(orderId)
        if (order) {
          for (const domain of order.domains) {
            await domainService.markAsSold(domain.domainId, orderId)
          }
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 })
  }
}
