import { databases } from "@/config/appwrite";
import { ID, Query } from "appwrite";
import { SocialPlatform } from "@/config/social-platforms";

interface TokenData {
  accessToken: string;
  refreshToken?: string;
  expiresAt: Date;
  platform: SocialPlatform;
  platformUserId: string;
  username?: string;
}

const COLLECTION_ID = "social_connections"; // Create this collection in Appwrite
const DATABASE_ID = "your_database_id"; // Your Appwrite database ID

export async function saveTokens(userId: string, tokenData: TokenData) {
  try {
    // Check if connection already exists
    const existing = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("userId", userId),
      Query.equal("platform", tokenData.platform),
    ]);

    const data = {
      userId,
      platform: tokenData.platform,
      accessToken: tokenData.accessToken,
      refreshToken: tokenData.refreshToken,
      expiresAt: tokenData.expiresAt.toISOString(),
      platformUserId: tokenData.platformUserId,
      username: tokenData.username,
      isConnected: true,
    };

    if (existing.documents.length > 0) {
      // Update existing connection
      await databases.updateDocument(
        DATABASE_ID,
        COLLECTION_ID,
        existing.documents[0].$id,
        data
      );
    } else {
      // Create new connection
      await databases.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), data);
    }
  } catch (error) {
    console.error("Failed to save tokens:", error);
    throw error;
  }
}

export async function getTokens(userId: string, platform: SocialPlatform) {
  try {
    const result = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("userId", userId),
      Query.equal("platform", platform),
      Query.equal("isConnected", true),
    ]);

    if (result.documents.length === 0) {
      return null;
    }

    const connection = result.documents[0];
    return {
      accessToken: connection.accessToken,
      refreshToken: connection.refreshToken,
      expiresAt: new Date(connection.expiresAt),
      platformUserId: connection.platformUserId,
      username: connection.username,
    };
  } catch (error) {
    console.error("Failed to get tokens:", error);
    throw error;
  }
} 