import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { SocialPlatform } from '@/config/social-platforms';

interface SocialConnection {
  platform: SocialPlatform;
  isConnected: boolean;
  accessToken: string;
  username?: string;
}

export function useSocialConnections() {
  const { user } = useAuth();
  const [connections, setConnections] = useState<SocialConnection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchConnections() {
      if (!user) {
        setConnections([]);
        setLoading(false);
        return;
      }

      try {
        // Fetch connections from your database
        // This is where you'd integrate with Appwrite
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch social connections:', error);
        setLoading(false);
      }
    }

    fetchConnections();
  }, [user]);

  const getAccessToken = (platform: SocialPlatform) => {
    const connection = connections.find((c) => c.platform === platform);
    return connection?.accessToken;
  };

  return {
    connections,
    loading,
    getAccessToken,
  };
} 