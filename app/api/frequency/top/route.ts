import { NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import DomainFrequency from "@/lib/models/domain-frequency"
import Domain from "@/lib/models/domain"

// GET /api/frequency/top -> { id, name, count } | { id: null }
// Returns the traffic domain with the highest frequency count
export async function GET() {
  try {
    await connectDB()

    // Get all frequency records
    const frequencies = await DomainFrequency.find().sort({ count: -1, updatedAt: -1 })

    // Find the traffic domain with highest count
    for (const freq of frequencies) {
      try {
        const domain = await Domain.findById(freq.domainId)
        if (domain && domain.type === 'traffic') {
          console.log('Found top traffic domain:', { id: freq.domainId, name: freq.name, count: freq.count, type: domain.type })
          return NextResponse.json({
            id: freq.domainId,
            name: freq.name,
            count: freq.count
          })
        }
      } catch (err) {
        console.warn('Error fetching domain for frequency:', freq.domainId, err)
      }
    }

    console.log('No traffic domains found in frequency data')
    return NextResponse.json({ id: null })
  } catch (err: any) {
    console.error("/api/frequency/top GET error", err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
