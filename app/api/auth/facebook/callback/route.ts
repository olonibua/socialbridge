import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { saveTokens } from "@/utils/token-manager";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (!code || !state) {
      return new NextResponse("Missing required parameters", { status: 400 });
    }

    // Extract userId from state
    const userId = state.replace("sb:", "");

    // Exchange code for access token
    const tokenResponse = await axios.get(
      "https://graph.facebook.com/v18.0/oauth/access_token",
      {
        params: {
          client_id: process.env.FACEBOOK_CLIENT_ID,
          client_secret: process.env.FACEBOOK_CLIENT_SECRET,
          redirect_uri: process.env.FACEBOOK_REDIRECT_URI,
          code,
        },
      }
    );

    // Get user profile
    const profileResponse = await axios.get(
      "https://graph.facebook.com/me",
      {
        params: {
          fields: "id,name",
          access_token: tokenResponse.data.access_token,
        },
      }
    );

    // Save tokens
    await saveTokens(userId, {
      platform: "FACEBOOK",
      accessToken: tokenResponse.data.access_token,
      expiresAt: new Date(Date.now() + tokenResponse.data.expires_in * 1000),
      platformUserId: profileResponse.data.id,
      username: profileResponse.data.name,
    });

    // Redirect back to app
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } catch (error) {
    console.error("Facebook OAuth callback failed:", error);
    return NextResponse.redirect(
      new URL("/dashboard?error=facebook_auth_failed", request.url)
    );
  }
} 