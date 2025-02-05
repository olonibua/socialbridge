export const SOCIAL_PLATFORMS = {
  LINKEDIN: {
    name: 'linkedin',
    scopes: ['openid', 'profile', 'w_member_social', 'email'],
    authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
    tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
  },
  FACEBOOK: {
    name: 'facebook',
    scopes: ['public_profile', 'pages_manage_posts', 'pages_read_engagement'],
    authUrl: 'https://www.facebook.com/v18.0/dialog/oauth',
    tokenUrl: 'https://graph.facebook.com/v18.0/oauth/access_token',
  },
  REDDIT: {
    name: 'reddit',
    scopes: ['identity', 'submit', 'edit'],
    authUrl: 'https://www.reddit.com/api/v1/authorize',
    tokenUrl: 'https://www.reddit.com/api/v1/access_token',
  }
} as const;

export type SocialPlatform = keyof typeof SOCIAL_PLATFORMS; 