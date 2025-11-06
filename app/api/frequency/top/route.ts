import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import DomainFrequency from "@/lib/models/domain-frequency"

// GET /api/frequency/top -> { id, name, count } | { id: null }
export async function GET() {
  try {
    await connectDB()
    const top = await DomainFrequency.find().sort({ count: -1, updatedAt: -1 }).limit(1)
    if (!top.length) {
      return NextResponse.json({ id: null })
    }
    const d = top[0]
    return NextResponse.json({ id: d.domainId, name: d.name, count: d.count })
  } catch (err: any) {
    console.error("/api/frequency/top GET error", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
