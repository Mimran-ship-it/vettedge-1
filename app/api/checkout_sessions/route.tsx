import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe } from "../../../lib/stripe"
import Stripe from "stripe"

export async function POST(req: Request) {
    
  try {
    const headersList = await headers()
    const origin = headersList.get("origin") || ""
    const { items, billingInfo, userId } = await req.json()
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(
        (item: any) => ({
          price_data: {
            currency: "usd", // change to your currency
            product_data: {
              name: item.name,
            },
            unit_amount: Math.round(item.price * 100), // Stripe expects cents
          },
          quantity: item.quantity,
        })
      )
 
    // Create Checkout Session
    const session: Stripe.Checkout.Session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items,
        mode: "payment",
        customer_email: billingInfo.email, // pre-fill email at checkout
        success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/checkout?canceled=true`,
        metadata: {
          userId: userId || "guest",
          billingInfo: JSON.stringify(billingInfo), }
    })

    if (!session.url) {
      throw new Error("Failed to create Stripe session.")
    }

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("❌ Stripe error:", {
      message: err.message,
      type: err.type,
      raw: err.raw,
      stack: err.stack,
    })

    return NextResponse.json(
      { error: err.raw?.message || err.message },
      { status: err.statusCode || 500 }
    )
  }
}
