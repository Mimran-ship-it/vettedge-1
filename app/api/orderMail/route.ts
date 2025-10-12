import { NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const {
      sessionId,
      customerEmail,
      items,
      totalAmount,
      paymentStatus,
      billingInfo,
      orderNumber, // ✅ order number from Success.tsx
    } = await req.json()

    // Use billingInfo.email if available, otherwise fallback to customerEmail
    const userEmail = billingInfo?.email || customerEmail

    if (!userEmail) {
      return NextResponse.json({ error: "No email address provided" }, { status: 400 })
    }

    // Send confirmation email to the customer
    await resend.emails.send({
      from: "Vettedge Domains <support@vettedge.domains>",
      to: userEmail,
      subject: `🎉 Order #${orderNumber} Confirmed – Thank You for Your Purchase!`,
      text: `
Hello,

Thank you for your purchase from Vettedge Domains! We're excited to help you get started with your new domain.

Order Number: ${orderNumber}

Order Details:
${items.map((item: { name: any; price: any; quantity: any }, index: number) => `
${index + 1}. ${item.name}
   Price: $${item.price}
   Quantity: ${item.quantity}
`).join('')}

Total Amount: $${totalAmount}
Payment Status: ${paymentStatus}
     
Please Contact Us After Payment:
To begin the transfer process quickly, contact us via Live Chat or our Contact Form as soon as your payment is complete. Provide us with:
1. Your order number (#${orderNumber})
2. The domain name you purchased
3. Your preferred registrar and account details (if known)

⚡ The sooner we hear from you, the faster we can start your transfer!

Thank you for choosing Vettedge Domains!

Best regards,  
The Vettedge Team
      `,
      html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; color: #333; line-height: 1.6;">
  <h2 style="color: #0070f3;">🎉 Thank You for Your Purchase!</h2>
  <p>We're excited to help you get started with your new domain.</p>

  <h3 style="margin-top: 16px;">Order Number: <span style="color:#0070f3;">#${orderNumber}</span></h3>

  <h3 style="margin-top: 24px; margin-bottom: 16px;">Order Details</h3>
  <table style="border-collapse: collapse; margin: 16px 0; width: 100%; font-size: 14px;">
    <thead>
      <tr style="background-color: #f8f9fa;">
        <th style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd;">Item</th>
        <th style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd;">Price</th>
        <th style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd;">Quantity</th>
      </tr>
    </thead>
    <tbody>
      ${items.map((item: { name: any; price: any; quantity: any }, index: number) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #ddd;">${index + 1}. ${item.name}</td>
          <td style="padding: 12px; border-bottom: 1px solid #ddd;">$${item.price}</td>
          <td style="padding: 12px; border-bottom: 1px solid #ddd;">${item.quantity}</td>
        </tr>
      `).join('')}
    </tbody>
    <tfoot>
      <tr>
        <td colspan="2" style="padding: 12px; text-align: right; font-weight: bold;">Total Amount:</td>
        <td style="padding: 12px; font-weight: bold;">$${totalAmount}</td>
      </tr>
      <tr>
        <td colspan="2" style="padding: 12px; text-align: right;">Payment Status:</td>
        <td style="padding: 12px;">${paymentStatus}</td>
      </tr>
    </tfoot>
  </table>

  <h3 style="margin-top: 24px; margin-bottom: 16px;">Please Contact Us After Payment</h3>
  <p>To begin the transfer process quickly, please contact us via <strong>Live Chat</strong> or our 
  <a href="https://vettedge.domains/contact" style="color: #0070f3;">Contact Form</a> as soon as your payment is complete. Let us know:</p>
  <ul style="padding-left: 20px;">
    <li>Your order number (<strong>#${orderNumber}</strong>)</li>
    <li>The domain name you purchased</li>
    <li>Your preferred registrar and account details (if known)</li>
  </ul>

  <p style="margin-top: 16px; font-weight: bold;">⚡ The sooner we hear from you, the faster we can start your transfer!</p>

  <p style="margin-top: 24px;">Thank you for choosing Vettedge Domains!</p>

  <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;" />

  <p style="font-size: 13px; color: #777;">
    This email contains important information about your purchase. Please keep it for your records.
  </p>
</div>
      `,
    })

    return NextResponse.json({ message: "Confirmation email sent successfully" }, { status: 200 })
  } catch (error) {
    console.error("Resend error:", error)
    return NextResponse.json({ error: "Failed to send confirmation email" }, { status: 500 })
  }
}
