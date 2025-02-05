import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new NextResponse("Missing userId parameter", { status: 400 });
    }

    const state = `sb:${userId}`;
    const authUrl = new URL("https://www.facebook.com/v18.0/dialog/oauth");
    authUrl.searchParams.append("response_type", "code");
    authUrl.searchParams.append("client_id", process.env.FACEBOOK_CLIENT_ID!);
    authUrl.searchParams.append("redirect_uri", process.env.FACEBOOK_REDIRECT_URI!);
    authUrl.searchParams.append("state", state);
    authUrl.searchParams.append("scope", "public_profile,pages_manage_posts,pages_read_engagement");

    return NextResponse.redirect(authUrl.toString());
  } catch (error) {
    console.error("Facebook OAuth initialization failed:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 