import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

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
  } catch (error: any) {
    console.error("LinkedIn post failed:", error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data || "Failed to post" }, 
      { status: 500 }
    );
  }
} 