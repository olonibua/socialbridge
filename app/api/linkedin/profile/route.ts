import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const accessToken = searchParams.get("accessToken");

    if (!accessToken) {
      return NextResponse.json({ error: "No access token provided" }, { status: 400 });
    }

    const response = await axios.get("https://api.linkedin.com/v2/me", {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Restli-Protocol-Version': '2.0.0',
        'LinkedIn-Version': '202304',
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("LinkedIn profile fetch failed:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
} 