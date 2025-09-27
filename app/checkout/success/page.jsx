import { redirect } from "next/navigation"
import { stripe } from "../../../lib/stripe"

export default async function Success({ searchParams }) {
  const { session_id } = await searchParams
  if (!session_id) {
    throw new Error("Please provide a valid session_id (`cs_test_...`)")
  }

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent"],
  })

  const {
    status,
    customer_details: { email: customerEmail },
  } = session
  const line_items = session.line_items

  if (status === "open") {
    return redirect("/")
  }

  if (status === "complete") {
    const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

    // Save the order in DB
    await fetch(`${origin}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: session_id,
        customerEmail,
        items: line_items.data.map((li) => ({
          name: li.description,
          price: li.price.unit_amount / 100,
          quantity: li.quantity,
        })),
        totalAmount: line_items.data.reduce(
          (acc, li) => acc + li.amount_total / 100,
          0
        ),
        paymentStatus: status,
        billingInfo: session.metadata?.billingInfo,
        domainTransfer: 'pending', // Added domainTransfer field
      }),
    })

    // 🔔 Get total orders count to calculate order number
    const ordersRes = await fetch(`${origin}/api/orders`)
    const ordersData = await ordersRes.json()
    const orderNumber = (ordersData.orders?.length || 0) 

    // 🔔 Notify user with order number included
    await fetch(`${origin}/api/orderMail`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: session_id,
        customerEmail,
        items: line_items.data.map((li) => ({
          name: li.description,
          price: li.price.unit_amount / 100,
          quantity: li.quantity,
        })),
        totalAmount: line_items.data.reduce(
          (acc, li) => acc + li.amount_total / 100,
          0
        ),
        paymentStatus: status,
        billingInfo: session.metadata?.billingInfo,
        orderNumber, // ✅ added
        domainTransfer: 'pending', // Added domainTransfer field
      }),
    })

    // ✅ Mark purchased domains as sold
    for (const li of line_items.data) {
      const domainName = li.description
      await fetch(`${origin}/api/domains`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: domainName,
          isSold: true,
        }),
      })
    }

    redirect(`/transfer-process`)
  }
}