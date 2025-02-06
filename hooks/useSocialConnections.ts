import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { databases } from '@/config/appwrite';
import { Query } from 'appwrite';
import { SocialPlatform } from '@/config/social-platforms';

interface SocialConnection {
  platform: SocialPlatform;
  isConnected: boolean;
  accessToken: string;
  username?: string;
  $id?: string;
  userId: string;
}

export function useSocialConnections() {
  const { user } = useAuth();
  const [connections, setConnections] = useState<SocialConnection[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConnections = useCallback(async () => {
    if (!user) {
      setConnections([]);
      setLoading(false);
      return;
    }

    try {
      const response = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_SOCIAL_CONNECTIONS_COLLECTION_ID!,
        [Query.equal("userId", user.id)]
      );

      setConnections(
        response.documents.map((doc) => ({
          platform: doc.platform,
          isConnected: doc.isConnected,
          accessToken: doc.accessToken,
          username: doc.username,
          $id: doc.$id,
          userId: doc.userId,
        }))
      );
    } catch (error) {
      console.error('Failed to fetch social connections:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchConnections();
  }, [fetchConnections]);

  return {
    connections,
    loading,
    refreshConnections: fetchConnections,
  };
}