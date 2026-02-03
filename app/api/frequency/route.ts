import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import DomainFrequency from "@/lib/models/domain-frequency";
import Domain from "@/lib/models/domain";

// GET /api/frequency -> Returns all domain frequencies with type info sorted by count
export async function GET() {
  try {
    await connectDB();

    // Get all frequency records
    const frequencies = await DomainFrequency.find().sort({ count: -1, updatedAt: -1 })

    // Add type information for each frequency record
    const frequenciesWithType = await Promise.all(
      frequencies.map(async (freq) => {
        try {
          const domain = await Domain.findById(freq.domainId)
          return {
            domainId: freq.domainId,
            name: freq.name,
            count: freq.count,
            createdAt: freq.createdAt,
            updatedAt: freq.updatedAt,
            type: domain ? domain.type : 'unknown'
          }
        } catch (err) {
          return {
            domainId: freq.domainId,
            name: freq.name,
            count: freq.count,
            createdAt: freq.createdAt,
            updatedAt: freq.updatedAt,
            type: 'unknown'
          }
        }
      })
    );

    return NextResponse.json({
      success: true,
      data: frequenciesWithType,
      total: frequenciesWithType.length,
    });
  } catch (err: any) {
    console.error("/api/frequency GET error", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/frequency
// Body: { id: string; name: string }
export async function POST(req: Request) {
  try {
    await connectDB();
    const { id, name } = await req.json();

    if (!id || !name) {
      return NextResponse.json(
        { message: "id and name are required" },
        { status: 400 },
      );
    }

    const updated = await DomainFrequency.findOneAndUpdate(
      { domainId: id },
      { $set: { name }, $inc: { count: 1 } },
      { upsert: true, new: true },
    );

    return NextResponse.json({
      domainId: updated.domainId,
      name: updated.name,
      count: updated.count,
    });
  } catch (err: any) {
    console.error("/api/frequency POST error", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
