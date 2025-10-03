// /checkout/success page
import { redirect } from "next/navigation"
import { stripe } from "../../../lib/stripe"

export default async function Success({ searchParams }) {
  const { session_id } = searchParams

  if (!session_id) {
    throw new Error("Please provide a valid session_id.")
  }

  const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  const isStripeSession = session_id.startsWith("cs_") // Stripe sessions start with 'cs_'

  let customerEmail = ""
  let items = []
  let totalAmount = 0
  let status = "COMPLETED"
  let billingInfo = null

  if (isStripeSession) {
    // ✅ STRIPE LOGIC (unchanged)
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items", "payment_intent"],
    })

    const {
      payment_status,
      customer_details: { email },
      metadata,
    } = session
    const line_items = session.line_items

    if (payment_status !== "paid") {
      console.error("❌ Payment not completed. Current status:", payment_status)
      throw new Error(`Stripe payment not completed. Current status: ${payment_status}`)
    }

    customerEmail = email
    billingInfo = metadata?.billingInfo || {}
    items = line_items.data.map((li) => ({
      name: li.description,
      price: li.price.unit_amount / 100,
      quantity: li.quantity,
    }))
    totalAmount = line_items.data.reduce((acc, li) => acc + li.amount_total / 100, 0)
    status = "COMPLETED"
  } else {
    // ✅ PAYPAL LOGIC (updated)
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
    
    // Extract payer information from the correct location
    const payer = capture?.payer || {}
    const payerName = payer.name || {}
    const payerAddress = payer.address || {}
    
    customerEmail = payer.email_address || ""
    
    // Extract purchase units and items
    const purchaseUnits = capture?.purchase_units || []
    const firstUnit = purchaseUnits[0] || {}
    
    items = firstUnit.items?.map((it) => ({
      name: it.name,
      price: parseFloat(it.unit_amount?.value || "0"),
      quantity: parseInt(it.quantity || "1", 10),
    })) || []
    
    totalAmount = parseFloat(firstUnit.amount?.value || "0")
    status = capture.status || "COMPLETED"
    
    // Construct billing info with all available details
    billingInfo = {
      email: customerEmail,
      name: `${payerName.given_name || ""} ${payerName.surname || ""}`.trim(),
      payerId: payer.payer_id,
      address: {
        country_code: payerAddress.country_code,
        address_line_1: payerAddress.address_line_1,
        address_line_2: payerAddress.address_line_2,
        admin_area_1: payerAddress.admin_area_1,
        admin_area_2: payerAddress.admin_area_2,
        postal_code: payerAddress.postal_code,
      },
      phone: payer.phone?.phone_number?.national_number,
      birth_date: payer.birth_date,
    }
  }

  // ✅ Save order in DB
  console.log("📦 Saving order in DB...")
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