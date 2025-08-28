


// import NextAuth from "next-auth"
// import GoogleProvider from "next-auth/providers/google"
// import { createUserIfNotExists } from "@/lib/helpers/createUserIfNotExists"

// const handler =  NextAuth({
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//   ],
//   callbacks: {
//     async signIn({ user, profile }) {
//       try {
//         await createUserIfNotExists({
//           name: user.name || profile?.name || "Unknown User",
//           email: user.email || "",
//           oauthProvider: "google"
//         })
//         return true
//       } catch (err) {
//         console.error("Google user creation error:", err)
//         return false
//       }
//     },
//   },
// })


// export { handler as GET, handler as POST }
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { signJwt } from "@/lib/jwt"
import { createUserIfNotExists } from "@/lib/helpers/createUserIfNotExists"
import { cookies } from "next/headers"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, profile }) {
      await createUserIfNotExists({
        name: user.name || profile?.name || "Unknown User",
        email: user.email || "",
        oauthProvider: "google"
      })
      return true
    },
  },
  events: {
    async signIn({ user }) {
      const token = signJwt({ email: user.email!, name: user.name })
      const cookieStore = await cookies()   // 👈 await here
      cookieStore.set("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      })
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
