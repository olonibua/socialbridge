import axios from 'axios';
import { PostContent } from './index';

export async function postToFacebook(content: PostContent, accessToken: string) {
  try {
    // First post text content
    const response = await axios.post(
      'https://graph.facebook.com/v18.0/me/feed',
      {
        message: content.text,
        // If there's media, we'll need to handle it differently
        ...(content.media?.[0] && {
          link: content.media[0].url // For simple link sharing
        })
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Facebook post failed:', error);
    throw error;
  }
} 