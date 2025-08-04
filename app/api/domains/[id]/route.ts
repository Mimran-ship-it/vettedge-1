import { type NextRequest, NextResponse } from "next/server"
import { domainService } from "@/lib/services/domain-service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const domain = await domainService.getDomainById(params.id)
    if (!domain) {
      return NextResponse.json({ error: "Domain not found" }, { status: 404 })
    }
    return NextResponse.json(domain)
  } catch (error) {
    console.error("Error fetching domain:", error)
    return NextResponse.json({ error: "Failed to fetch domain" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updates = await request.json()
    const success = await domainService.updateDomain(params.id, updates)
    if (!success) {
      return NextResponse.json({ error: "Domain not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating domain:", error)
    return NextResponse.json({ error: "Failed to update domain" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const success = await domainService.deleteDomain(params.id)
    if (!success) {
      return NextResponse.json({ error: "Domain not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting domain:", error)
    return NextResponse.json({ error: "Failed to delete domain" }, { status: 500 })
  }
}
