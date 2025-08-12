import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Blog from "@/lib/models/blog";

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  try {
    await connectDB();
    const { id } = context.params;
    const blog = await Blog.findById(id);
    if (!blog) return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    return NextResponse.json(blog);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch blog" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, context: { params: { id: string } }) {
  try {
    await connectDB();
    const { id } = context.params;
    const updates = await request.json();
    const updated = await Blog.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!updated) return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update blog" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
  try {
    await connectDB();
    const { id } = context.params;
    const deleted = await Blog.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 });
  }
}