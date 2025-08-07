import { NextRequest, NextResponse } from "next/server"
import connectDB from "@/lib/mongodb"
import Domain from "@/lib/models/domain" // Make sure this is your Mongoose model

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  try {
    await connectDB()
    const { id } = context.params

    const domain = await Domain.findById(id)

    if (!domain) {
      return NextResponse.json({ error: "Domain not found" }, { status: 404 })
    }

    return NextResponse.json(domain)
  } catch (error) {
    console.error("❌ GET Error:", error)
    return NextResponse.json({ error: "Failed to fetch domain" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, context: { params: { id: string } }) {
  try {
    await connectDB();
    const { id } = context.params;
    const updates = await request.json();

    const updatedDomain = await Domain.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedDomain) {
      return NextResponse.json({ error: "Domain not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, domain: updatedDomain });
  } catch (error) {
    console.error("❌ PUT Error:", error);
    return NextResponse.json({ error: "Failed to update domain" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
  try {
    await connectDB()
    const { id } = context.params

    const deletedDomain = await Domain.findByIdAndDelete(id)

    if (!deletedDomain) {
      return NextResponse.json({ error: "Domain not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("❌ DELETE Error:", error)
    return NextResponse.json({ error: "Failed to delete domain" }, { status: 500 })
  }
}
