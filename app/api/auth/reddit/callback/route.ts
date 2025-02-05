import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { databases } from "@/config/appwrite";
import { ID } from "appwrite";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (!code || !state) {
      console.error("Missing required parameters");
      return NextResponse.redirect(new URL("/dashboard?error=missing_params", request.url));
    }

    const userId = state.replace("sb:", "");

    // Exchange code for access token
    const tokenResponse = await axios.post(
      "https://www.reddit.com/api/v1/access_token",
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.REDDIT_REDIRECT_URI!,
      }),
      {
        auth: {
          username: process.env.REDDIT_CLIENT_ID!,
          password: process.env.REDDIT_CLIENT_SECRET!,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    // Get user info
    const userResponse = await axios.get("https://oauth.reddit.com/api/v1/me", {
      headers: {
        Authorization: `Bearer ${tokenResponse.data.access_token}`,
        "User-Agent": "socialbridge:v1.0.0",
      },
    });

    // Save to Appwrite
    await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_SOCIAL_CONNECTIONS_COLLECTION_ID!,
      ID.unique(),
      {
        userId,
        platform: "REDDIT",
        accessToken: tokenResponse.data.access_token,
        refreshToken: tokenResponse.data.refresh_token,
        isConnected: true,
        platformUserId: userResponse.data.name,
        username: userResponse.data.name,
        expiresAt: new Date(Date.now() + tokenResponse.data.expires_in * 1000).toISOString(),
      }
    );

    return NextResponse.redirect(new URL("/dashboard?connection=success", request.url));
  } catch (error) {
    console.error("Reddit OAuth callback failed:", error);
    return NextResponse.redirect(new URL("/dashboard?error=reddit_auth_failed", request.url));
  }
} 