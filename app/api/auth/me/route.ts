// app/api/auth/me/route.ts
import { NextRequest, NextResponse } from "next/server"
import { verifyJwt } from "@/lib/jwt"
import { connectDB } from "@/lib/db"
import User from "@/lib/models/User"

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value

  if (!token) {
    return NextResponse.json({ user: null }, { status: 200 })
  }

  const decoded = verifyJwt(token)
  if (!decoded) {
    return NextResponse.json({ user: null }, { status: 200 })
  }

  try {
    await connectDB()
    
    // The JWT stores userId, not id
    const userId = decoded.userId || decoded.id
    
    if (!userId) {
      console.error("No userId found in token:", decoded)
      return NextResponse.json({ user: null }, { status: 200 })
    }
    
    // Fetch full user data from database
    const user = await User.findById(userId).select("-password")
    
    if (!user) {
      console.error("User not found in database for userId:", userId)
      return NextResponse.json({ user: null }, { status: 200 })
    }

    return NextResponse.json({ 
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
        billingAddress: user.billingAddress,
      }
    }, { status: 200 })
  } catch (error) {
    console.error("Error fetching user:", error)
    // Fallback to decoded token data with proper id mapping
    const fallbackUser = {
      id: decoded.userId || decoded.id,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
    }
    return NextResponse.json({ user: fallbackUser }, { status: 200 })
  }
}