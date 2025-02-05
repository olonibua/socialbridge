import { postToLinkedIn } from './linkedin';
import { postToFacebook } from './facebook';
import { postToReddit } from './reddit';
import { SocialPlatform } from '@/config/social-platforms';

export interface PostContent {
  text: string;
  media?: {
    url: string;
    type: 'image' | 'video';
  }[];
}

export interface SocialPost {
  platform: SocialPlatform;
  content: PostContent;
  accessToken: string;
}

export async function postToSocial({ platform, content, accessToken }: SocialPost) {
  try {
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