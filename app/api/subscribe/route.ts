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

    for (const user of users) {
      const domainUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/domains`

      await resend.emails.send({
        from: "Shoaib@vettedge.domains",
        to: user.email,
        subject: `New Domain Available: ${domain.name}`,
        text: `Hello ${user.name || "there"}, A new domain is available: ${domain.name} for $${domain.price} in our marketplace.`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
                       <table style="border-collapse: collapse; margin: 12px 0;">
              <tr><td><strong>Name:</strong></td><td>${domain.name}</td></tr>
              <tr><td><strong>Price:</strong></td><td>$${domain.price}</td></tr>
              <tr><td><strong>Age:</strong></td><td>${domain.metrics.age} years</td></tr>
              <tr><td><strong>Domain Authority (DA):</strong></td><td>${domain.metrics.domainAuthority}</td></tr>
              <tr><td><strong>Trust Flow (TF):</strong></td><td>${domain.metrics.trustFlow}</td></tr>
              <tr><td><strong>Citation Flow (CF):</strong></td><td>${domain.metrics.citationFlow}</td></tr>
              <tr><td><strong>Referring Domains:</strong></td><td>${domain.metrics.referringDomains}</td></tr>
              <tr><td><strong>Language:</strong></td><td>${domain.metrics.language}</td></tr>
            </table>

            <p>
              <a href="${domainUrl}" 
                 style="background: #0070f3; color: #fff; padding: 10px 16px; border-radius: 6px; text-decoration: none;">
                🔗 View Domain
              </a>
            </p>

            <p style="font-size: 12px; color: #888;">
              If you don’t want to receive these updates, you can 
              <a href="${process.env.NEXT_PUBLIC_BASE_URL}/unsubscribe?email=${encodeURIComponent(user.email)}">
                unsubscribe here
              </a>.
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
