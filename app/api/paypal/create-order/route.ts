import { NextRequest, NextResponse } from "next/server"

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID! 
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET!
const PAYPAL_ENV = process.env.PAYPAL_ENV || "sandbox" // or "live"
const BASE = PAYPAL_ENV === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com"

async function getAccessToken() {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64")
  const res = await fetch(`${BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "client_credentials" }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`PayPal OAuth failed: ${res.status} ${err}`)
  }
  return res.json() as Promise<{ access_token: string }>
}

export async function POST(req: NextRequest) {
  try {
    const { items, billingInfo, userId, currency = "USD" } = await req.json()

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 })
    }

    const total = items.reduce((sum: number, it: any) => sum + (it.price * it.quantity), 0)

    const { access_token } = await getAccessToken()

    // Infer origin for return/cancel URLs
    const origin = process.env.NEXT_PUBLIC_SITE_URL || req.headers.get("origin") || "http://localhost:3000"

    const orderRes = await fetch(`${BASE}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: currency,
              value: total.toFixed(2),
              breakdown: {
                item_total: { currency_code: currency, value: total.toFixed(2) },
              },
            },
            items: items.map((it: any) => ({
              name: it.name,
              quantity: String(it.quantity),
              unit_amount: { currency_code: currency, value: Number(it.price).toFixed(2) },
            })),
            custom_id: userId || "guest",
          },
        ],
        application_context: {
          brand_name: "Vettedge Domains",
          shipping_preference: "NO_SHIPPING",
          user_action: "PAY_NOW",
          return_url: `${origin}/checkout/paypal-return`,
          cancel_url: `${origin}/checkout?canceled=true`,
        },
        // pass-through metadata in custom_id
        payer: billingInfo?.email ? { email_address: billingInfo.email } : undefined,
      }),
    })

    const data = await orderRes.json()
    if (!orderRes.ok) {
      console.error("PayPal create order error:", data)
      return NextResponse.json({ error: data }, { status: 500 })
    }

    // Extract approval link
    const approveLink = Array.isArray(data.links)
      ? data.links.find((l: any) => l.rel === "approve")?.href
      : undefined

    return NextResponse.json({ id: data.id, approveUrl: approveLink })
  } catch (e: any) {
    console.error("/api/paypal/create-order error:", e)
    return NextResponse.json({ error: e.message || "Unknown error" }, { status: 500 })
  }
}
