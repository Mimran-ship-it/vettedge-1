import bcrypt from "bcryptjs"
import User from "@/lib/models/User"
import { connectDB } from "@/lib/db"

interface CreateUserParams {
  name: string
  email: string
  password?: string
  role?: string
  oauthProvider?: "google"
}

export async function createUserIfNotExists({
  name,
  email,
  password,
  role = "customer",
  oauthProvider,
}: CreateUserParams) {
  await connectDB()

  // Check if user exists
  const existingUser = await User.findOne({ email })
  if (existingUser) return existingUser

  // Use dummy password for OAuth users
  const finalPassword = password || (oauthProvider ? "oauth_dummy_" + Date.now() : undefined)
  const hashedPassword = finalPassword ? await bcrypt.hash(finalPassword, 12) : undefined

  // Create user
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
    oauthProvider,
  })

  return newUser
}
