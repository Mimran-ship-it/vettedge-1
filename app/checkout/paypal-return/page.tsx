import { redirect } from "next/navigation"

export default async function PayPalReturn({
  searchParams,
}: {
  searchParams: Record<string, string>
}) {
  // ✅ Get PayPal order ID
  const orderId =
    searchParams?.token || searchParams?.orderId || searchParams?.paymentId

  if (!orderId) {
    return redirect("/checkout/error?reason=missing_order_id")
  }

  // ✅ Capture the order
  const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  const capRes = await fetch(`${origin}/api/paypal/capture-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    body: JSON.stringify({ orderId }),
  })

  const capData = await capRes.json()

  if (!capRes.ok) {
    console.error("❌ PayPal capture failed:", capData)
    return redirect("/checkout/error?reason=capture_failed")
  }

  // ✅ If successful, redirect without try/catch
  const meta = searchParams?.meta ? `&meta=${encodeURIComponent(searchParams.meta)}` : ""
  return redirect(`/checkout/success?session_id=${orderId}${meta}`)
}
