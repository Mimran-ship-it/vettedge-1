import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Domain from "@/lib/models/domain"

export async function GET() {
  try {
    await connectDB()

    // Fetch all domain names from the database
    const domains = await Domain.find({}, { name: 1, _id: 0 })

    // Extract unique TLDs
    const tldSet = new Set<string>()

    domains.forEach((domain) => {
      const domainName = domain.name
      // Find the last occurrence of '.' to get the TLD
      const lastDotIndex = domainName.lastIndexOf('.')
      
      if (lastDotIndex !== -1) {
        // Extract TLD including the dot (e.g., ".com", ".net")
        const tld = domainName.substring(lastDotIndex)
        tldSet.add(tld.toLowerCase())
      }
    })

    // Convert Set to Array and sort alphabetically
    const uniqueTlds = Array.from(tldSet).sort()

    return NextResponse.json({ tlds: uniqueTlds }, { status: 200 })
  } catch (error) {
    console.error("Error fetching TLDs:", error)
    return NextResponse.json(
      { error: "Failed to fetch TLDs" },
      { status: 500 }
    )
  }
}
