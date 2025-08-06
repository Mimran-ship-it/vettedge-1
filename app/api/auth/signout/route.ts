import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ message: "Signed out successfully" })

  // Clear the token by setting it to empty and expiring it
  response.cookies.set("token", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0), // immediately expire
  })

  return response
}
