import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { PostContent } from "@/lib/social-integrations";

export async function POST(request: NextRequest) {
  try {
    const { content, accessToken } = await request.json();

    // Get LinkedIn user ID
    const profileResponse = await axios.get('https://api.linkedin.com/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    const linkedInUserId = profileResponse.data.sub;

    // Create post
    const postData = {
      author: `urn:li:person:${linkedInUserId}`,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: {
            text: content.text
          },
          shareMediaCategory: "NONE"
        }
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
      }
    };

    const response = await axios.post(
      'https://api.linkedin.com/v2/ugcPosts',
      postData,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0'
        }
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('LinkedIn post failed:', error.response?.data || error);
    return NextResponse.json(
      { error: error.response?.data || error.message },
      { status: error.response?.status || 500 }
    );
  }
} 