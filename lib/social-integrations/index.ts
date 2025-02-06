import { postToLinkedIn } from './linkedin';
import { postToFacebook } from './facebook';
import { postToReddit } from './reddit';
import { databases } from '@/config/appwrite';

export type PostContent = {
  text: string;
  media?: Array<{
    url: string;
    type: 'image' | 'video';
  }>;
  // Add other content types as needed
};

export async function getAccessToken(userId: string, platform: string) {
  try {
    const connections = await databases.listDocuments(
      process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
      process.env.NEXT_PUBLIC_APPWRITE_SOCIAL_CONNECTIONS_COLLECTION_ID!
    );

    const connection = connections.documents.find(
      conn => conn.userId === userId && conn.platform === platform && conn.isConnected
    );

    return connection?.accessToken;
  } catch (error) {
    console.error(`Failed to get access token for ${platform}:`, error);
    return null;
  }
}

export async function postToSocial(platform: string, content: PostContent, accessToken: string) {
  try {
    console.log(`Posting to ${platform}:`, { content, accessToken });
    
    switch (platform) {
      case 'LINKEDIN':
        return await postToLinkedIn(content, accessToken);
      case 'FACEBOOK':
        return await postToFacebook(content, accessToken);
      case 'REDDIT':
        return await postToReddit(content, accessToken);
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
  } catch (error) {
    console.error(`Failed to post to ${platform}:`, error);
    throw error;
  }
} 