import { NextRequest, NextResponse } from "next/server";
import Blog from "@/lib/models/blog";
import connectDB from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");
    const search = searchParams.get("search");

    if (slug) {
      const blog = await Blog.findOne({ slug });
      if (!blog) return NextResponse.json({ error: "Blog not found" }, { status: 404 });
      return NextResponse.json(blog);
    }

    const query = search ? { title: { $regex: search, $options: "i" } } : {};
    const blogs = await Blog.find(query).sort({ createdAt: -1 });
    return NextResponse.json(blogs);
  } catch (error: any) {
    console.error("GET /api/blogs - Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
      errors: error.errors
    });
    return NextResponse.json({ error: "Failed to fetch blogs", message: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    
    // Log the incoming data for debugging
    console.log("POST /api/blogs - Incoming data:", JSON.stringify(body, null, 2));
    
    // Validate required fields
    const requiredFields = ['title', 'excerpt', 'content', 'slug', 'category', 'image'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      console.error("Missing required fields:", missingFields);
      return NextResponse.json({ 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      }, { status: 400 });
    }
    
    // Add missing id field if not provided
    if (!body.id) {
      body.id = body.slug; // Use slug as id if not provided
    }
    
    // Handle readTime vs readingTime field mismatch
    if (body.readingTime !== undefined && body.readTime === undefined) {
      body.readTime = `${body.readingTime} min read`;
    }
    
    // Ensure publishedAt is a Date
    if (body.publishedAt && typeof body.publishedAt === 'string') {
      body.publishedAt = new Date(body.publishedAt);
    }
    
    console.log("POST /api/blogs - Processed data:", JSON.stringify(body, null, 2));
    
    const created = await Blog.create(body);
    console.log("POST /api/blogs - Successfully created blog:", created._id);
    
    return NextResponse.json(created, { status: 201 });
  } catch (error: any) {
    // Enhanced error logging
    console.error("POST /api/blogs - Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
      errors: error.errors
    });
    
    // Handle specific Mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json({ 
        error: "Validation failed", 
        details: validationErrors 
      }, { status: 400 });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json({ 
        error: `Duplicate ${field}. Please use a unique value.` 
      }, { status: 409 });
    }
    
    return NextResponse.json({ 
      error: "Failed to create blog",
      message: error.message 
    }, { status: 500 });
  }
}