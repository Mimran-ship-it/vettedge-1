// app/api/subscribe/route.ts
import { NextResponse } from "next/server"
import User from "@/lib/models/User"  // adjust import path
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const { domain } = await req.json()

    // Fetch all users from DB
    const users = await User.find({}, "email name")
    if (!users.length) {
      return NextResponse.json({ message: "No users to notify" }, { status: 200 })
    }

    // Send individual emails (personalized)
    for (const user of users) {
      await resend.emails.send({
        from: 'vettedge.domains@resend.dev',
        to: user.email,
        subject: `🚀 New Domain Available: ${domain.name || "Fresh Domain"}`,
        html: `
          <h2>Hello ${user.name || "there"},</h2>
          <p>A new domain has just been added to our marketplace:</p>
          <ul>
            <li><strong>Name:</strong> ${domain.name}</li>
            <li><strong>Price:</strong> $${domain.price}</li>
            <li><strong>Age:</strong> ${domain.metrics.age} years</li>
            <li><strong>Language:</strong> ${domain.metrics.language}</li>
          </ul>
          <p><a href="${process.env.NEXT_PUBLIC_BASE_URL}/domains" target="_blank">
            🔗 View Domain Now
          </a></p>
        `,
      })
    }

    return NextResponse.json({ message: "Emails sent successfully" }, { status: 200 })
  } catch (error) {
    console.error("Resend error:", error)
    return NextResponse.json({ error: "Failed to send emails" }, { status: 500 })
  }
}
