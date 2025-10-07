import { NextRequest, NextResponse } from "next/server";
// We will forward uploads directly to Cloudinary to avoid storing files locally

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

    // Forward to Cloudinary unsigned upload, mirroring admin/domains/new/page.tsx
    // If you want to change cloud, preset, or folder, adjust below constants
    const CLOUD_NAME = "dcday5wio"; // same as used in admin domain page
    const UPLOAD_PRESET = "domain"; // reuse existing unsigned preset
    const FOLDER = "chat"; // separate folder for chat uploads

    const cloudForm = new FormData();
    // Provide filename explicitly to preserve name when possible
    cloudForm.append("file", file, (file as any).name || "upload");
    cloudForm.append("upload_preset", UPLOAD_PRESET);
    cloudForm.append("folder", FOLDER);

    const cloudUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`;
    const cloudRes = await fetch(cloudUrl, {
      method: "POST",
      body: cloudForm,
      // No credentials for unsigned uploads
    });

    if (!cloudRes.ok) {
      const errText = await cloudRes.text();
      console.error("Cloudinary upload failed:", cloudRes.status, errText);
      return NextResponse.json({ error: "Cloud upload failed" }, { status: 502 });
    }

    const cloudData = await cloudRes.json();
    const secureUrl: string | undefined = cloudData?.secure_url;

    if (!secureUrl) {
      console.error("Cloudinary response missing secure_url:", cloudData);
      return NextResponse.json({ error: "Invalid cloud response" }, { status: 500 });
    }

    console.log("Cloudinary upload successful, returning URL:", secureUrl);
    return NextResponse.json({ url: secureUrl, messageType });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Failed to upload" }, { status: 500 });
  }
}

