// app/api/domains/route.ts

import { NextRequest, NextResponse } from "next/server";
import  connectDB  from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    const db = await connectDB();
    const domainsCollection = db.collection("domains");

    // Optional: get "search" param from URL
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");

    let query = {};

    if (search) {
      query = {
        name: { $regex: search, $options: "i" },
      };
    }

    const domains = await domainsCollection.find(query).toArray();

    return NextResponse.json(domains);
  } catch (error) {
    console.error("Error fetching domains:", error);
    return NextResponse.json(
      { error: "Failed to fetch domains" },
      { status: 500 }
    );
  }
}
