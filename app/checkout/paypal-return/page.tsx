import { redirect } from "next/navigation"

export default async function PayPalReturn({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
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

  const capture = capData.capture

  // Extract useful info
  const payerEmail = capture?.payer?.email_address || capture?.payment_source?.paypal?.email_address
  const units = Array.isArray(capture?.purchase_units) ? capture.purchase_units : []
  const firstUnit = units[0]

  // Derive items if available from purchase_units
  const items = Array.isArray(firstUnit?.items)
    ? firstUnit.items.map((it: any) => ({
        name: it.name,
        price: parseFloat(it.unit_amount?.value || "0"),
        quantity: parseInt(it.quantity || "1", 10),
      }))
    : []

  // Total from unit amount if present, otherwise sum items
  const totalAmount = firstUnit?.amount?.value
    ? parseFloat(firstUnit.amount.value)
    : items.reduce((s: number, it: any) => s + it.price * it.quantity, 0)

  const status = capture?.status || "COMPLETED"

  // Save order to DB
  await fetch(`${origin}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: orderId,
      customerEmail: payerEmail,
      items,
      totalAmount,
      paymentStatus: status,
      billingInfo: { email: payerEmail },
    }),
  })

  // Mark purchased domains as sold (by name)
  if (Array.isArray(items)) {
    for (const li of items) {
      const domainName = li.name
      if (domainName) {
        await fetch(`${origin}/api/domains`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: domainName, isSold: true }),
        })
      }
    }
  }

  // Redirect to transfer process page
  redirect(`/transfer-process`)
}
