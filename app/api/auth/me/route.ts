// app/api/auth/me/route.ts
import { NextRequest, NextResponse } from "next/server"
import { verifyJwt } from "@/lib/jwt"

export async function GET(req: NextRequest) {
  const token = req.cookies.get("token")?.value

  if (!token) {
    return NextResponse.json({ user: null }, { status: 200 })
  }

  const decoded = verifyJwt(token)
  if (!decoded) {
    return NextResponse.json({ user: null }, { status: 200 })
  }

  return NextResponse.json({ user: decoded }, { status: 200 })
}
 