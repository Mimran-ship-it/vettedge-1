import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { connectDB } from "@/lib/db"
import User from "@/lib/models/User"
import { verifyJwt } from "@/lib/jwt"

export async function PUT(request: NextRequest) {
  try {
    await connectDB()

    // Verify user is authenticated
    const token = request.cookies.get("token")?.value
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const decoded = verifyJwt(token)
    if (!decoded) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      )
    }

    const { name, email, password, billingAddress } = await request.json()

    // The JWT stores userId, not id
    const userId = decoded.userId || decoded.id

    // Find user
    const user = await User.findById(userId)
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Update fields
    if (name) user.name = name
    if (email) {
      // Check if email is already taken by another user
      const existingUser = await User.findOne({ email, _id: { $ne: userId } })
      if (existingUser) {
        return NextResponse.json(
          { error: "Email already in use" },
          { status: 409 }
        )
      }
      user.email = email
    }
    
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 12)
      user.password = hashedPassword
    }

    if (billingAddress) {
      user.billingAddress = billingAddress
    }

    await user.save()

    // Return updated user data (excluding password)
    return NextResponse.json(
      {
        success: true,
        message: "User updated successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          billingAddress: user.billingAddress,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Update User Error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
