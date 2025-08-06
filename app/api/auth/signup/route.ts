import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import connectDB from "@/lib/mongodb"
import User from "@/lib/models/User" // Make sure path matches

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const { name, email, password } = await request.json()

    // Validate fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields (name, email, password) are required." },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists." },
        { status: 409 }
      )
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12)


    // Create new user with default role = 'customer'
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "customer",
    })

    // Return created user data (excluding password)
    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully.",
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Signup Error:", error)
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    )
  }
}
