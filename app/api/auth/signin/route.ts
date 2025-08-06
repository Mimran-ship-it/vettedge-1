import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import User from "@/lib/models/User"
import { signJwt } from "@/lib/jwt"

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 })
    }

    const user = await User.findOne({ email }).select("+password")
    if (!user || !(await user.comparePassword(password))) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 })
    }

    // Update last login timestamp
    user.lastLogin = new Date()
    await user.save()

    // Sign JWT (omit sensitive info)
    const token = signJwt({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    })

    const response = NextResponse.json(
      {
        success: true,
        message: "Signed in successfully.",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    )

    // Set HttpOnly cookie
    response.cookies.set("token", token, {
      httpOnly: true, // ❗ allow middleware to read it
      secure: process.env.NODE_ENV === "production",
      maxAge: 12 * 60 * 60,
      sameSite: "lax",
      path: "/",
    })
    

    return response
  } catch (error) {
    console.error("Sign in error:", error)
    return NextResponse.json({ error: "Internal server error." }, { status: 500 })
  }
}
