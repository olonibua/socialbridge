import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { databases } from "@/config/appwrite";
import { ID } from "appwrite";

interface ApiError extends Error {
  response?: {
    data?: unknown;
  };
}

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

    // Get user profile with correct API version and fields
    const profileResponse = await axios.get(
      "https://api.linkedin.com/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokenResponse.data.access_token}`,
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
        platform: "LINKEDIN",
        accessToken: tokenResponse.data.access_token,
        isConnected: true,
        platformUserId: profileResponse.data.sub,
        username: profileResponse.data.name,
        expiresAt: new Date(Date.now() + tokenResponse.data.expires_in * 1000).toISOString(),
      }
    );

    const html = `
      <!DOCTYPE html>
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.location.href = '/dashboard?connection=success';
              window.close();
            } else {
              window.location.href = '/dashboard?connection=success';
            }
          </script>
        </body>
      </html>
    `;
    
    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html' },
    });

  } catch (error: unknown) {
    const err = error as ApiError;
    console.error("LinkedIn OAuth callback failed:", err.response?.data || err.message);
    const html = `
      <!DOCTYPE html>
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.location.href = '/dashboard?error=linkedin_auth_failed';
              window.close();
            } else {
              window.location.href = '/dashboard?error=linkedin_auth_failed';
            }
          </script>
        </body>
      </html>
    `;
    
    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html' },
    });
  }
}
