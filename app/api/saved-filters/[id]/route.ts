import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "@/lib/jwt";
import { connectDB } from "@/lib/db";
import { SavedFilter } from "@/lib/models/saved-filter";

// DELETE - Delete a saved filter
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const savedFilter = await SavedFilter.findOne({
      _id: params.id,
      userId: decoded.email,
    });

    if (!savedFilter) {
      return NextResponse.json(
        { error: "Saved filter not found" },
        { status: 404 }
      );
    }

    await SavedFilter.deleteOne({ _id: params.id });

    return NextResponse.json(
      { message: "Saved filter deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting saved filter:", error);
    return NextResponse.json(
      { error: "Failed to delete saved filter" },
      { status: 500 }
    );
  }
}
