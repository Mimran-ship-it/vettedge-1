// app/api/domains/route.ts

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Domain from "@/lib/models/domain";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    const query = search
      ? { name: { $regex: search, $options: "i" } }
      : {};

    const domains = await Domain.find(query).sort({ createdAt: -1 });

    return NextResponse.json(domains);
  } catch (error) {
    console.error("Error fetching domains:", error);
    return NextResponse.json({ error: "Failed to fetch domains" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    // Move images to image field if provided
    if (body.images && Array.isArray(body.images)) {
      body.image = body.images;
    }

    const newDomain = await Domain.create(body);

    return NextResponse.json(newDomain, { status: 201 });
  } catch (error) {
    console.error("Error creating domain:", error);
    return NextResponse.json({ error: "Failed to create domain" }, { status: 500 });
  }
}

 export async function PATCH(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, isSold } = body;

    if (!name) {
      return NextResponse.json({ error: "Domain name is required" }, { status: 400 });
    }

    const updatedDomain = await Domain.findOneAndUpdate(
      { name },              // 🔎 find by name
      { isSold },            // ✅ update isSold
      { new: true }          // return updated doc
    );

    if (!updatedDomain) {
      return NextResponse.json({ error: "Domain not found" }, { status: 404 });
    }

    return NextResponse.json(updatedDomain);
  } catch (error) {
    console.error("Error updating domain:", error);
    return NextResponse.json({ error: "Failed to update domain" }, { status: 500 });
  }
}
