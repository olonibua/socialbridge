import axios from 'axios';
import { PostContent } from './index';

export async function postToReddit(content: PostContent, accessToken: string) {
  try {
    // You'll need to specify a subreddit to post to
    const response = await axios.post(
      'https://oauth.reddit.com/api/submit',
      {
        kind: 'self', // or 'link' for link posts
        title: content.text.slice(0, 300), // Reddit requires a title
        text: content.text,
        sr: 'test', // subreddit name, you might want to make this configurable
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('Reddit post failed:', error);
    throw error;
  }
} 