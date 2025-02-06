import axios from 'axios';
import { PostContent } from './index';

export async function postToReddit(content: PostContent, accessToken: string) {
  try {
    if (content.media?.length) {
      // For media posts, we need to upload to Reddit's media endpoint first
      const mediaResponse = await axios.post(
        'https://oauth.reddit.com/api/media/asset.json',
        {
          filepath: content.media[0].url,
          mimetype: content.media[0].type === 'image' ? 'image/jpeg' : 'video/mp4'
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'User-Agent': 'socialbridge:v1.0.0'
          }
        }
      );

      // Submit as link post with the media
      return axios.post(
        'https://oauth.reddit.com/api/submit',
        new URLSearchParams({
          kind: 'link',
          sr: 'test', // Subreddit to post to
          title: content.text.slice(0, 300),
          url: mediaResponse.data.asset.url
        }),
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'socialbridge:v1.0.0'
          }
        }
      );
    }

    // Text-only post
    return axios.post(
      'https://oauth.reddit.com/api/submit',
      new URLSearchParams({
        kind: 'self',
        sr: 'test',
        title: content.text.slice(0, 300),
        text: content.text
      }),
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent': 'socialbridge:v1.0.0'
        }
      }
    );
  } catch (error) {
    console.error('Reddit post failed:', error);
    throw error;
  }
} 