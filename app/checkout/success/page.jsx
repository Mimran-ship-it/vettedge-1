import { redirect } from "next/navigation"
import { stripe } from "../../../lib/stripe"

export default async function Success({ searchParams }) {
  const { session_id } = await searchParams

  if (!session_id) {
    throw new Error("Please provide a valid session_id.")
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

  // 🧠 Detect payment method based on session_id format
  const isStripeSession = session_id.startsWith("cs_") // Stripe checkout sessions always start with 'cs_'

  let customerEmail = ""
  let items = []
  let totalAmount = 0
  let status = "COMPLETED"
  let billingInfo = null

  if (isStripeSession) {
    // ✅ STRIPE LOGIC
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items", "payment_intent"],
    })

    const {
      status: stripeStatus,
      customer_details: { email },
    } = session
    const line_items = session.line_items

    if (stripeStatus === "open") {
      return redirect("/")
    }

    if (stripeStatus === "complete") {
      customerEmail = email
      billingInfo = session.metadata?.billingInfo
      items = line_items.data.map((li) => ({
        name: li.description,
        price: li.price.unit_amount / 100,
        quantity: li.quantity,
      }))
      totalAmount = line_items.data.reduce(
        (acc, li) => acc + li.amount_total / 100,
        0
      )
      status = stripeStatus
    } else {
      throw new Error("Stripe payment not completed.")
    }
  } else {
    // ✅ PAYPAL LOGIC
    const capRes = await fetch(`${origin}/api/paypal/capture-order`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: session_id }),
      cache: "no-store",
    })

    const capData = await capRes.json()
    if (!capRes.ok) {
      console.error("PayPal capture fetch failed:", capData)
      throw new Error("Failed to retrieve PayPal order details")
    }

    const capture = capData.capture
    customerEmail =
      capture?.payer?.email_address ||
      capture?.payment_source?.paypal?.email_address ||
      ""

    const firstUnit = Array.isArray(capture?.purchase_units)
      ? capture.purchase_units[0]
      : null

    items = Array.isArray(firstUnit?.items)
      ? firstUnit.items.map((it) => ({
          name: it.name,
          price: parseFloat(it.unit_amount?.value || "0"),
          quantity: parseInt(it.quantity || "1", 10),
        }))
      : []

    totalAmount = firstUnit?.amount?.value
      ? parseFloat(firstUnit.amount.value)
      : items.reduce((s, it) => s + it.price * it.quantity, 0)

    status = capture?.status || "COMPLETED"
    billingInfo = { email: customerEmail }
  }

  // ✅ Save order in DB
  await fetch(`${origin}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: session_id,
      customerEmail,
      items,
      totalAmount,
      paymentStatus: status,
      billingInfo,
      domainTransfer: "pending",
    }),
  })

  // ✅ Get total orders count (for order number)
  const ordersRes = await fetch(`${origin}/api/orders`)
  const ordersData = await ordersRes.json()
  const orderNumber = ordersData.orders?.length || 0

  // ✅ Notify user with order number included
  await fetch(`${origin}/api/orderMail`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sessionId: session_id,
      customerEmail,
      items,
      totalAmount,
      paymentStatus: status,
      billingInfo,
      orderNumber,
      domainTransfer: "pending",
    }),
  })

  // ✅ Mark purchased domains as sold
  for (const li of items) {
    const domainName = li.name
    await fetch(`${origin}/api/domains`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: domainName,
        isSold: true,
      }),
    })
  }

  // ✅ Redirect to transfer process page
  redirect(`/transfer-process`)
}
