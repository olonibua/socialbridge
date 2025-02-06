import { NextRequest, NextResponse } from "next/server";
import { Client, Storage, ID } from "appwrite";

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

const storage = new Storage(client);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Upload to Appwrite Storage
    const result = await storage.createFile(
      process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!,
      ID.unique(),
      file
    );

    // Get the file URL
    // Get the file URL
    const fileUrl = storage.getFileView(
      process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!,
      result.$id
    );

    return NextResponse.json({ url: fileUrl });
  } catch (error) {
    console.error("Upload failed:", error);
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    );
  }
} 