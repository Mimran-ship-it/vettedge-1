import { redirect } from 'next/navigation'

import { stripe } from '../../../lib/stripe'

export default async function Success({ searchParams }) {
  const { session_id } = await searchParams

  if (!session_id)
    throw new Error('Please provide a valid session_id (`cs_test_...`)')

  const {
    status,
    customer_details: { email: customerEmail }
  } = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['line_items', 'payment_intent']
  }) 
  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['line_items', 'payment_intent']
  });
  const line_items = session.line_items;
  if (status === 'open') {
    return redirect('/')
  }

  if (status === "complete") {
    // Get the full URL for API
    const origin = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  
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
        billingInfo:session.metadata.billingInfo
      }),
    });
  
    return (
      <section id="success">
        <p>
          We appreciate your business! A confirmation email will be sent to {customerEmail}.
        </p>
        <a href="mailto:orders@example.com">orders@example.com</a>.
      </section>
    );
  }
  
  
}