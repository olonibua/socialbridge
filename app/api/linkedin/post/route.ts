import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

interface ApiError extends Error {
  response?: {
    data?: unknown;
    status?: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, accessToken } = body;

    // Create the post directly without getting profile
    const response = await axios.post(
      'https://api.linkedin.com/v2/ugcPosts',
      {
        author: "urn:li:person:me",  // Use 'me' instead of ID
        lifecycleState: 'PUBLISHED',
        specificContent: {
          'com.linkedin.ugc.ShareContent': {
            shareCommentary: {
              text: text
            },
            shareMediaCategory: 'NONE'
          }
        },
        visibility: {
          'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'X-Restli-Protocol-Version': '2.0.0',
          'LinkedIn-Version': '202304',
          'Content-Type': 'application/json',
        }
      }
    );

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    const err = error as ApiError;
    console.error("LinkedIn post failed:", err.response?.data || err.message);
    return NextResponse.json(
      { error: err.response?.data || "Failed to post" }, 
      { status: err.response?.status || 500 }
    );
  }
} 