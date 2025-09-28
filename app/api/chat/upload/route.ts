import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { promises as fs } from "fs";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    console.log("Upload API called");
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      console.log("No file in form data");
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    console.log("File received:", { name: file.name, size: file.size, type: file.type });

    // Determine type from mime
    const mime = file.type || "application/octet-stream";
    const isImage = mime.startsWith("image/");
    const messageType: "image" | "file" = isImage ? "image" : "file";

    // Prepare output path
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public", "uploads", "chat");
    console.log("Creating upload directory:", uploadDir);
    await fs.mkdir(uploadDir, { recursive: true });

    // Sanitize filename and make unique
    const origName = file.name || `upload-${Date.now()}`;
    const ext = path.extname(origName) || (isImage ? ".png" : "");
    const base = path.basename(origName, ext).replace(/[^a-zA-Z0-9-_]/g, "_");
    const filename = `${base}-${Date.now()}${ext}`;
    const filepath = path.join(uploadDir, filename);

    console.log("Writing file to:", filepath);
    await fs.writeFile(filepath, buffer);

    const publicUrl = `/uploads/chat/${filename}`;
    console.log("Upload successful, returning URL:", publicUrl);

    return NextResponse.json({ url: publicUrl, messageType });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Failed to upload" }, { status: 500 });
  }
}
