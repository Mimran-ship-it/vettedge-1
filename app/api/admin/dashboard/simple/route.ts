import { NextRequest, NextResponse } from "next/server"
import { verifyJwt } from "@/lib/jwt"
import UserModel from "@/lib/models/User"
import Domain from "@/lib/models/domain"

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decoded = verifyJwt(token)
    if (!decoded || decoded.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("Simple dashboard test - starting...")

    // Test basic database connectivity
    try {
      const domainCount = await Domain.countDocuments()
      console.log("Domain count:", domainCount)
    } catch (error) {
      console.error("Error counting domains:", error)
    }

    try {
      const userCount = await UserModel.countDocuments()
      console.log("User count:", userCount)
    } catch (error) {
      console.error("Error counting users:", error)
    }

    const testData = {
      message: "Simple dashboard test successful",
      timestamp: new Date().toISOString()
    }

    console.log("Simple dashboard test - returning data:", testData)
    return NextResponse.json(testData)
  } catch (error) {
    console.error("Simple dashboard test error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
