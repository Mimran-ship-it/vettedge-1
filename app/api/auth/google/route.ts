// pages/api/auth/google.ts
import type { NextApiRequest, NextApiResponse } from "next"
import jwt from "jsonwebtoken"
import { OAuth2Client } from "google-auth-library"
import connectDB from "@/lib/mongodb"
import UserModel from "@/lib/models/User"

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" })

  const { credential } = req.body
  if (!credential) return res.status(400).json({ error: "Missing Google credential" })

  try {
    // 1. Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    })
    const payload = ticket.getPayload()
    if (!payload || !payload.email) throw new Error("Invalid Google token")

    // 2. Connect DB
    await connectDB()

    // 3. Find or create user
    let user = await UserModel.findOne({ email: payload.email })
    if (!user) {
      user = await UserModel.create({
        name: payload.name,
        email: payload.email,
        provider: "google",
        avatar: payload.picture,
        role: "customer", // ✅ default role for Google signups
      })
    }

    // 4. Sign JWT
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "7d" }
    )

    // 5. Set cookie
    res.setHeader("Set-Cookie", `token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${7 * 24 * 60 * 60}`)

    // ✅ Return user object
    res.status(200).json({
      user: {
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
    })
  } catch (err: any) {
    console.error("❌ Google Auth Error:", err.message)
    res.status(400).json({ error: err.message })
  }
}
