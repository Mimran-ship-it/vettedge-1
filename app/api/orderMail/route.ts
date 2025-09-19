import { NextResponse } from "next/server"
import User from "@/lib/models/User"
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
      billingInfo
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
      subject: `🎉 Thank You for Your Purchase! Order Confirmation`,
      text: `
Hello,

Thank you for your purchase from Vettedge Domains! We're excited to help you get started with your new domain.

Order Details:
${items.map((item, index) => `
${index + 1}. ${item.name}
   Price: $${item.price}
   Quantity: ${item.quantity}
`).join('')}

Total Amount: $${totalAmount}
Payment Status: ${paymentStatus}

What happens next?
1. You'll receive a separate email with transfer instructions for your domain(s)
2. Our team will verify your payment and initiate the domain transfer process
3. You'll receive updates throughout the transfer process

If you have any questions about your order, please reply to this email or contact our support team at support@vettedge.domains.

Thank you for choosing Vettedge Domains!

Best regards,  
The Vettedge Team
        `,
      html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; color: #333; line-height: 1.6;">
  <h2 style="color: #0070f3;">🎉 Thank You for Your Purchase!</h2>
  <p>Thank you for your purchase from Vettedge Domains! We're excited to help you get started with your new domain.</p>

  <h3 style="margin-top: 24px; margin-bottom: 16px;">Order Details</h3>
  <table style="border-collapse: collapse; margin: 16px 0; width: 100%;">
    <thead>
      <tr style="background-color: #f8f9fa;">
        <th style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd;">Item</th>
        <th style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd;">Price</th>
        <th style="padding: 12px; text-align: left; border-bottom: 1px solid #ddd;">Quantity</th>
      </tr>
    </thead>
    <tbody>
      ${items.map((item, index) => `
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

  <h3 style="margin-top: 24px; margin-bottom: 16px;">What happens next?</h3>
  <ol style="padding-left: 20px;">
    <li>You'll receive a separate email with transfer instructions for your domain(s)</li>
    <li>Our team will verify your payment and initiate the domain transfer process</li>
    <li>You'll receive updates throughout the transfer process</li>
  </ol>

  <p style="margin-top: 24px;">
    If you have any questions about your order, please reply to this email or contact our support team at 
    <a href="mailto:support@vettedge.domains" style="color: #0070f3;">support@vettedge.domains</a>.
  </p>

  <p style="margin-top: 24px;">
    Thank you for choosing Vettedge Domains!
  </p>

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