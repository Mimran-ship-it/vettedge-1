// app/api/subscribe/route.ts
import { NextResponse } from "next/server"
import User from "@/lib/models/User"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const { domain } = await req.json()

    const users = await User.find({}, "email name")
    if (!users.length) {
      return NextResponse.json({ message: "No users to notify" }, { status: 200 })
    }

    const domainUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/domains`

    for (const user of users) {
      await resend.emails.send({
        from: "Vettedge Domains <support@vettedge.domains>",
        to: user.email,
        subject: `🔥 New Domain Just Dropped: ${domain.name}`,
        text: `
Hello ${user.name || "there"},

A new premium domain is now available in our marketplace:

- Name: ${domain.name}
- Price: $${domain.price}
- Age: ${domain.metrics.age} years
- Domain Authority: ${domain.metrics.domainAuthority}
- Referring Domains: ${domain.metrics.referringDomains}
- Language: ${domain.metrics.language}

👉 View it here: ${domainUrl}

Best regards,  
The Vettedge Team

(Unsubscribe: ${process.env.NEXT_PUBLIC_BASE_URL}/unsubscribe?email=${encodeURIComponent(user.email)})
        `,
        html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; color: #333; line-height: 1.6;">
  <!-- Logo -->
  <div style="text-align: center; margin-bottom: 20px;">
    <img src="${process.env.NEXT_PUBLIC_SITE_URL}/logo.png" alt="Vettedge Domains" style="max-width: 180px;" />
  </div>

  <h2 style="color: #0070f3;">🚀 New Domain Opportunity</h2>
  <p>Hi ${user.name || "there"},</p>
  <p>We’re excited to let you know that a new premium domain has just been listed:</p>

  <table style="border-collapse: collapse; margin: 16px 0; width: 100%;">
    <tr><td><strong>Name:</strong></td><td>${domain.name}</td></tr>
    <tr><td><strong>Price:</strong></td><td>$${domain.price}</td></tr>
    <tr><td><strong>Age:</strong></td><td>${domain.metrics.age} years</td></tr>
    <tr><td><strong>Domain Authority (DA):</strong></td><td>${domain.metrics.domainAuthority}</td></tr>
    <tr><td><strong>Referring Domains:</strong></td><td>${domain.metrics.referringDomains}</td></tr>
    <tr><td><strong>Language:</strong></td><td>${domain.metrics.language}</td></tr>
  </table>

  <p>
    <a href="${domainUrl}" 
       style="display: inline-block; background: #0070f3; color: #fff; padding: 12px 18px; border-radius: 6px; text-decoration: none; font-weight: bold;">
      🔗 View Domain
    </a>
  </p>

  <hr style="margin: 24px 0; border: none; border-top: 1px solid #eee;" />

  <p style="font-size: 13px; color: #777;">
    You’re receiving this update because you subscribed to Vettedge Domains.  
    If you’d prefer not to get these emails, you can  
    <a href="${process.env.NEXT_PUBLIC_BASE_URL}/unsubscribe?email=${encodeURIComponent(user.email)}">unsubscribe here</a>.
  </p>
</div>
        `,
      })
    }

    return NextResponse.json({ message: "Emails sent successfully" }, { status: 200 })
  } catch (error) {
    console.error("Resend error:", error)
    return NextResponse.json({ error: "Failed to send emails" }, { status: 500 })
  }
}
