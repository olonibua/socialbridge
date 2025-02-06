import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

interface ApiError extends Error {
  response?: {
    data?: unknown;
    status?: number;
  };
}

interface LinkedInPostData {
  author: string;
  lifecycleState: string;
  specificContent: {
    "com.linkedin.ugc.ShareContent": {
      shareCommentary: {
        text: string;
      };
      shareMediaCategory: string;
      media?: Array<{
        status: string;
        description: {
          text: string;
        };
        media: string;
        title: {
          text: string;
        };
      }>;
    };
  };
  visibility: {
    "com.linkedin.ugc.MemberNetworkVisibility": string;
  };
}

interface MediaItem {
  url: string;
  type: "image" | "video";
}

async function uploadMediaToLinkedIn(
  mediaUrl: string,
  accessToken: string,
  userId: string
) {
  // Register media upload with correct owner
  const registerUpload = await axios.post(
    "https://api.linkedin.com/v2/assets?action=registerUpload",
    {
      registerUploadRequest: {
        recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
        owner: `urn:li:person:${userId}`, // Use the actual user ID
        serviceRelationships: [
          {
            relationshipType: "OWNER",
            identifier: "urn:li:userGeneratedContent",
          },
        ],
      },
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  const uploadUrl =
    registerUpload.data.value.uploadMechanism[
      "com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"
    ].uploadUrl;
  const asset = registerUpload.data.value.asset;

  // Upload the media
  const mediaResponse = await axios.get(mediaUrl, {
    responseType: "arraybuffer",
  });
  await axios.put(uploadUrl, mediaResponse.data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "image/jpeg", // Adjust based on media type
    },
  });

  return asset;
}

export async function POST(request: NextRequest) {
  try {
    const { content, accessToken } = await request.json();

    // Get LinkedIn user ID first
    const profileResponse = await axios.get(
      "https://api.linkedin.com/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const linkedInUserId = profileResponse.data.sub;

    // Base post data
    const postData: LinkedInPostData = {
      author: `urn:li:person:${linkedInUserId}`,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: {
            text: content.text,
          },
          shareMediaCategory: "NONE",
        },
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
      },
    };

    // Handle media if present
    if (content.media && content.media.length > 0) {
      const mediaAssets = await Promise.all(
        content.media.map((item: MediaItem) =>
          uploadMediaToLinkedIn(item.url, accessToken, linkedInUserId)
        )
      );

      postData.specificContent[
        "com.linkedin.ugc.ShareContent"
      ].shareMediaCategory = "IMAGE";
      postData.specificContent["com.linkedin.ugc.ShareContent"].media =
        mediaAssets.map((asset) => ({
          status: "READY",
          description: {
            text: "Media",
          },
          media: asset,
          title: {
            text: "Media",
          },
        }));
    }

    // Create post
    const response = await axios.post(
      "https://api.linkedin.com/v2/ugcPosts",
      postData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-Restli-Protocol-Version": "2.0.0",
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    const err = error as ApiError;
    console.error("LinkedIn post failed:", err.response?.data || err);
    return NextResponse.json(
      { error: err.response?.data || err.message },
      { status: err.response?.status || 500 }
    );
  }
}
