import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "@/lib/jwt";
import { connectDB } from "@/lib/db";
import { SavedFilter } from "@/lib/models/saved-filter";

// GET - Fetch all saved filters for the authenticated user
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const decoded = verifyJwt(token);
    if (!decoded || !decoded.email) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    await connectDB();
    
    const savedFilters = await SavedFilter.find({ userId: decoded.email })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(savedFilters);
  } catch (error: any) {
    console.error("Error fetching saved filters:", error);
    return NextResponse.json(
      { error: "Failed to fetch saved filters" },
      { status: 500 }
    );
  }
}

// POST - Create a new saved filter
export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    const decoded = verifyJwt(token);
    if (!decoded || !decoded.email) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, filters } = body;

    if (!name || !filters) {
      return NextResponse.json(
        { error: "Name and filters are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if a filter with the same name already exists for this user
    const existingFilter = await SavedFilter.findOne({
      userId: decoded.email,
      name: name,
    });

    if (existingFilter) {
      return NextResponse.json(
        { error: "A filter with this name already exists" },
        { status: 409 }
      );
    }

    const savedFilter = await SavedFilter.create({
      userId: decoded.email,
      name,
      filters,
    });

    return NextResponse.json(savedFilter, { status: 201 });
  } catch (error: any) {
    console.error("Error creating saved filter:", error);
    return NextResponse.json(
      { error: "Failed to create saved filter" },
      { status: 500 }
    );
  }
}
