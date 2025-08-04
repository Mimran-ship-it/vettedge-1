import { type NextRequest, NextResponse } from "next/server";
import { domainService } from "@/lib/services/domain-service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") || undefined;
    const tldsParam = searchParams.get("tlds");
    const tlds = tldsParam ? tldsParam.split(",").filter(Boolean) : undefined;

    const priceMin = searchParams.get("priceMin");
    const priceMax = searchParams.get("priceMax");
    const availability = searchParams.get("availability");
    const category = searchParams.get("category") || undefined;

    const filters: any = {};
    if (search) filters.search = search;
    if (tlds?.length) filters.tlds = tlds;
    if (!isNaN(Number(priceMin)) && !isNaN(Number(priceMax))) {
      filters.priceRange = [parseInt(priceMin), parseInt(priceMax)];
    }
    if (availability) filters.availability = availability === "true";
    if (category) filters.category = category;

    const domains = await domainService.getAllDomains(filters);
    return NextResponse.json(domains);
  } catch (error) {
    console.error("Error fetching domains:", error);
    return NextResponse.json({ error: "Failed to fetch domains" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const domainData = await request.json();
    const domain = await domainService.createDomain(domainData);
    return NextResponse.json(domain, { status: 201 });
  } catch (error) {
    console.error("Error creating domain:", error);
    return NextResponse.json({ error: "Failed to create domain" }, { status: 500 });
  }
}
