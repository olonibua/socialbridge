import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { PostContent } from "@/lib/social-integrations";

export async function POST(request: NextRequest) {
  try {
    const { content, accessToken } = await request.json();

    const response = await axios.post(
      'https://oauth.reddit.com/api/submit',
      new URLSearchParams({
        kind: 'self',
        sr: 'test',
        title: content.text.slice(0, 300),
        text: content.text,
      }),
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'socialbridge:v1.0.0'
        }
      }
    );

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    const err = error as Error;
    console.error('Reddit post failed:', err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
