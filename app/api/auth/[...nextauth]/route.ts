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
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile", // Ensure profile scope is included
        },
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture, // Google provides 'picture' field
        }
      },
    }),
  ],

  callbacks: {
    // Runs whenever a user signs in
    async signIn({ user, account, profile }: any) {
      console.log("Google Sign In - User:", user)
      console.log("Google Sign In - Profile:", profile)
      await connectDB()

      // Try to find existing user in DB
      let dbUser = await UserModel.findOne({ email: user.email })

      // If user doesn't exist → create them
      if (!dbUser) {
        console.log("Creating new user with image:", user.image)
        dbUser = await UserModel.create({
          name: user.name || "Unknown User",
          email: user.email || "",
          image: user.image, // Save Google profile picture
          oauthProvider: "google",
          role: "customer", // default role
        })
      } else {
        // Always update the image if Google provides one (in case it changed)
        if (user.image && user.image !== dbUser.image) {
          console.log("Updating user image:", user.image)
          dbUser.image = user.image
          await dbUser.save()
        }
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
