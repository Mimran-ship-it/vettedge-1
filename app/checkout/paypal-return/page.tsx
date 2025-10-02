import { redirect } from "next/navigation"

export default async function PayPalReturn({
  searchParams,
}: {
  searchParams: Record<string, string>
}) {
  try {
    // ✅ Get PayPal order ID from query params
    const orderId = searchParams?.token // PayPal returns `token` for order ID

    if (!orderId) {
      throw new Error("Missing PayPal token (orderId)")
    }

    // ✅ Define your backend origin (fallback to localhost for dev)
    const origin = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

    // ✅ Capture the order via your API
    const capRes = await fetch(`${origin}/api/paypal/capture-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
      body: JSON.stringify({ orderId }),
    })

    const capData = await capRes.json()

    if (!capRes.ok) {
      console.error("❌ PayPal capture failed:", capData)
      throw new Error("PayPal payment capture failed.")
    }

    // ✅ Redirect to checkout success page with orderId as session_id
    redirect(`/checkout/success?session_id=${orderId}`)
  } catch (error) {
    console.error("⚠️ PayPal return error:", error)

    // Redirect to a fallback error page (optional)
    redirect("/checkout/error?reason=paypal_failed")
  }
}
