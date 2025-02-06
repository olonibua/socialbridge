import axios from 'axios';
import { PostContent } from '.';

export async function postToReddit(content: PostContent, accessToken: string) {
  try {
    const response = await axios.post('/api/social/reddit/post', {
      content,
      accessToken
    });
    
    if (response.data.error) {
      throw new Error(response.data.error);
    }
    
    return response.data;
  } catch (error) {
    console.error('Failed to post to Reddit:', error);
    throw error;
  }
} 