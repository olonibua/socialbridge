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
      return NextResponse.redirect(new URL("/dashboard?error=missing_params", request.url));
    }

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

    // Save to Appwrite
    await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_SOCIAL_CONNECTIONS_COLLECTION_ID!,
      ID.unique(),
      {
        userId,
        platform: "FACEBOOK",
        accessToken: tokenResponse.data.access_token,
        isConnected: true,
        platformUserId: profileResponse.data.id,
        username: profileResponse.data.name,
        expiresAt: new Date(Date.now() + tokenResponse.data.expires_in * 1000).toISOString(),
      }
    );

    return NextResponse.redirect(new URL("/dashboard?connection=success", request.url));
  } catch (error) {
    console.error("Facebook OAuth callback failed:", error);
    return NextResponse.redirect(new URL("/dashboard?error=facebook_auth_failed", request.url));
  }
} 