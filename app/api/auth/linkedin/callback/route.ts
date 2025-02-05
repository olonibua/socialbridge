import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { databases } from "@/config/appwrite";
import { ID } from "appwrite";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    console.log("Callback received:", { code, state, error }); // Debug log

    if (error) {
      console.error("LinkedIn OAuth error:", error);
      return NextResponse.redirect(new URL("/dashboard?error=linkedin_auth_failed", request.url));
    }

    if (!code || !state) {
      console.error("Missing required parameters");
      return NextResponse.redirect(new URL("/dashboard?error=missing_params", request.url));
    }

    const userId = state.replace("sb:", "");

    // Exchange code for access token
    const tokenResponse = await axios.post(
      "https://www.linkedin.com/oauth/v2/accessToken",
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: process.env.LINKEDIN_REDIRECT_URI!,
        client_id: process.env.LINKEDIN_CLIENT_ID!,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log("Token received"); // Debug log

    // Save to Appwrite
    await databases.createDocument(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_SOCIAL_CONNECTIONS_COLLECTION_ID!,
      ID.unique(),
      {
        userId,
        platform: "LINKEDIN",
        isConnected: true,
        accessToken: tokenResponse.data.access_token,
        expiresAt: new Date(Date.now() + tokenResponse.data.expires_in * 1000).toISOString(),
      }
    );

    return NextResponse.redirect(new URL("/dashboard?connection=success", request.url));
  } catch (error) {
    console.error("LinkedIn OAuth callback failed:", error);
    return NextResponse.redirect(new URL("/dashboard?error=linkedin_auth_failed", request.url));
  }
} 