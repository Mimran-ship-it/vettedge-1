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
    const { orderId } = await req.json()
    if (!orderId) return NextResponse.json({ error: "orderId required" }, { status: 400 })

    const { access_token } = await getAccessToken()
 
    const capRes = await fetch(`${BASE}/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    })

    const data = await capRes.json()
    if (!capRes.ok) {
      console.error("PayPal capture error:", data)
      return NextResponse.json({ error: data }, { status: 500 })
    }

    return NextResponse.json({ capture: data })
  } catch (e: any) {
    console.error("/api/paypal/capture-order error:", e)
    return NextResponse.json({ error: e.message || "Unknown error" }, { status: 500 })
  }
}
