import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new NextResponse("Missing userId parameter", { status: 400 });
    }

    const state = `sb:${userId}`;
    const authUrl = new URL("https://www.reddit.com/api/v1/authorize");
    
    const scopes = [
      'identity',
      'submit',
      'edit',
      'flair',
      'modposts',
      'read',
      'report',
      'save',
      'structuredstyles'  // Important for media uploads
    ].join(' ');

    authUrl.searchParams.append("client_id", process.env.REDDIT_CLIENT_ID!);
    authUrl.searchParams.append("response_type", "code");
    authUrl.searchParams.append("state", state);
    authUrl.searchParams.append("redirect_uri", process.env.REDDIT_REDIRECT_URI!);
    authUrl.searchParams.append("duration", "permanent");
    authUrl.searchParams.append("scope", scopes);

    return NextResponse.json({ authUrl: authUrl.toString() });
  } catch (error) {
    console.error("Reddit OAuth initialization failed:", error);
    return NextResponse.json({ error: "Failed to initialize OAuth" }, { status: 500 });
  }
} 