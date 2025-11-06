import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import DomainFrequency from "@/lib/models/domain-frequency"

// POST /api/frequency
// Body: { id: string; name: string }
export async function POST(req: Request) {
  try {
    await connectDB()
    const { id, name } = await req.json()

    if (!id || !name) {
      return NextResponse.json({ message: "id and name are required" }, { status: 400 })
    }

    const updated = await DomainFrequency.findOneAndUpdate(
      { domainId: id },
      { $set: { name }, $inc: { count: 1 } },
      { upsert: true, new: true }
    )

    return NextResponse.json({ domainId: updated.domainId, name: updated.name, count: updated.count })
  } catch (err: any) {
    console.error("/api/frequency POST error", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
