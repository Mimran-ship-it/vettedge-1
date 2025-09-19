// import { redirect } from "next/navigation"
// import { stripe } from "../../../lib/stripe"

// export default async function Success({ searchParams }) {
//   const { session_id } = await searchParams

//   if (!session_id) {
//     throw new Error("Please provide a valid session_id (`cs_test_...`)")
//   }

//   const session = await stripe.checkout.sessions.retrieve(session_id, {
//     expand: ["line_items", "payment_intent"],
//   })

//   const {
//     status,
//     customer_details: { email: customerEmail },
//   } = session

//   const line_items = session.line_items

//   if (status === "open") {
//     return redirect("/")
//   }

//   if (status === "complete") {
//     // Get the full URL for API
//     const origin = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

//     // Save the order
//     await fetch(`${origin}/api/orders`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         sessionId: session_id,
//         customerEmail,
//         items: line_items.data.map((li) => ({
//           name: li.description,
//           price: li.price.unit_amount / 100,
//           quantity: li.quantity,
//         })),
//         totalAmount: line_items.data.reduce(
//           (acc, li) => acc + li.amount_total / 100,
//           0
//         ),
//         paymentStatus: status,
//         billingInfo: session.metadata?.billingInfo,
//       }),
//     })

//     // ✅ Mark purchased domains as sold
//     for (const li of line_items.data) {
//       const domainName = li.description
//       await fetch(`${origin}/api/domains`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name: domainName, // find by name
//           isSold: true,
//         }),
//       })
//     }

//     return (
//       <section id="success" className="p-6 text-center">
//         <p className="text-lg font-semibold">
//           We appreciate your business! A confirmation email will be sent to{" "}
//           <span className="text-[#33BDC7]">{customerEmail}</span>.
//         </p>
//         <p className="mt-2">
//           If you have any issues, contact us at{" "}
//           <a
//             href="support@vettedge.domains"
//             className="text-blue-600 hover:underline"
//           >
//             support@vettedge.domains
//           </a>
//           .
//         </p>
//       </section>
//     )
//   }
// }

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
    // Get the full URL for API
    const origin = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    
    // Save the order
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
      }),
    })
    
    // ✅ Mark purchased domains as sold
    for (const li of line_items.data) {
      const domainName = li.description
      await fetch(`${origin}/api/domains`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: domainName, // find by name
          isSold: true,
        }),
      })
    }
    
    // Redirect to transfer process page
    redirect(`/transfer-process`)
  }
}