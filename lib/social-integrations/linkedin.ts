import axios from "axios";
import { PostContent } from './index';

export interface LinkedInPostData {
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
      }>;
    };
  };
  visibility: {
    "com.linkedin.ugc.MemberNetworkVisibility": string;
  };
}

export async function postToLinkedIn(content: PostContent, accessToken: string) {
  try {
    // const postData: LinkedInPostData = {
    //   author: '',
    //   lifecycleState: '',
    //   specificContent: {
    //     "com.linkedin.ugc.ShareContent": {
    //       shareCommentary: {
    //         text: ''
    //       },
    //       shareMediaCategory: '',
    //       media: []
    //     }
    //   },
    //   visibility: {
    //     "com.linkedin.ugc.MemberNetworkVisibility": ''
    //   }
    // };
    const response = await axios.post('/api/social/linkedin/post', {
      content,
      accessToken
    });
    return response.data;
  } catch (error) {
    console.error('Failed to post to LinkedIn:', error);
    throw error;
  }
}
