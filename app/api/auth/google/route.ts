// pages/api/auth/google.ts
import type { NextApiRequest, NextApiResponse } from "next"
import jwt from "jsonwebtoken"
import { OAuth2Client } from "google-auth-library"
import connectDB from "@/lib/mongodb"
import UserModel from "@/lib/models/User"

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end()

  const { credential } = req.body

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    })
    const payload = ticket.getPayload()
    if (!payload) throw new Error("Invalid Google token")

    await connectDB()
    let user = await UserModel.findOne({ email: payload.email })
    if (!user) {
      user = await UserModel.create({
        name: payload.name,
        email: payload.email,
        provider: "google",
        avatar: payload.picture,
      })
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, { expiresIn: "7d" })
    res.setHeader("Set-Cookie", `token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict`)

    res.status(200).json({ user })
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
}
