import { redirect } from "next/navigation"

export default async function PayPalReturn({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>
}) {
  const params = await searchParams
  const orderId = params?.token // PayPal returns `token` for order id

  if (!orderId) {
    throw new Error("Missing PayPal token (orderId)")
  }

  // Capture the order on the server
  const origin = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  const capRes = await fetch(`${origin}/api/paypal/capture-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify({ orderId }),
  })

  const capData = await capRes.json()
  if (!capRes.ok) {
    console.error("PayPal capture failed:", capData)
    throw new Error("PayPal payment capture failed")
  }

  // ✅ Redirect directly to success page with session_id (orderId)
  redirect(`/checkout/success?session_id=${orderId}`)
}
