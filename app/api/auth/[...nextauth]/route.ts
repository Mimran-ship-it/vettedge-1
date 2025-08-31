// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { signJwt } from "@/lib/jwt"
import { cookies } from "next/headers"
import UserModel from "@/lib/models/User"
import { connectDB } from "@/lib/db"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    // Runs whenever a user signs in
    async signIn({ user }) {
      await connectDB()

      // Try to find existing user in DB
      let dbUser = await UserModel.findOne({ email: user.email })

      // If user doesn't exist → create them
      if (!dbUser) {
        dbUser = await UserModel.create({
          name: user.name || "Unknown User",
          email: user.email || "",
          oauthProvider: "google",
          role: "customer", // default role
        })
      }

      // ✅ Generate JWT including role
      const token = signJwt({
        userId: dbUser._id,
        email: dbUser.email,
        name: dbUser.name,
        role: dbUser.role || "customer",
      })

      // ✅ Set JWT cookie
      const cookieStore = await cookies()
      cookieStore.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60, // 7 days
      })

      return true
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
