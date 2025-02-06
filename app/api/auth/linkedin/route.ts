import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new NextResponse("Missing userId parameter", { status: 400 });
    }

    const state = `sb:${userId}`;
    const authUrl = new URL("https://www.linkedin.com/oauth/v2/authorization");
    
    authUrl.searchParams.append("response_type", "code");
    authUrl.searchParams.append("client_id", process.env.LINKEDIN_CLIENT_ID!);
    authUrl.searchParams.append("redirect_uri", process.env.LINKEDIN_REDIRECT_URI!);
    authUrl.searchParams.append("state", state);
    authUrl.searchParams.append("scope", "openid profile email w_member_social");

    // Return the URL instead of redirecting
    return NextResponse.json({ authUrl: authUrl.toString() });
  } catch (error) {
    console.error("LinkedIn OAuth initialization failed:", error);
    return NextResponse.json({ error: "Failed to initialize OAuth" }, { status: 500 });
  }
} 