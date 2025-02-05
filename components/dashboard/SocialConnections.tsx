"use client";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { SOCIAL_PLATFORMS, SocialPlatform } from "@/config/social-platforms";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { databases } from "@/config/appwrite";
import { Query } from "appwrite";
import { useSearchParams } from "next/navigation";

export default function SocialConnections() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [connections, setConnections] = useState<Record<SocialPlatform, boolean>>({
    LINKEDIN: false,
    FACEBOOK: false,
    REDDIT: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchConnections();
    }
  }, [user]);

  useEffect(() => {
    const connection = searchParams.get("connection");
    if (connection === "success") {
      toast.success("Successfully connected!");
      fetchConnections();
    }
  }, [searchParams]);

  const fetchConnections = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const response = await databases.listDocuments(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_SOCIAL_CONNECTIONS_COLLECTION_ID!,
        [Query.equal("userId", user.id)]
      );
      
      const newConnections = { ...connections };
      response.documents.forEach((doc) => {
        newConnections[doc.platform as SocialPlatform] = true;
      });
      setConnections(newConnections);
    } catch (error) {
      console.error("Failed to fetch connections:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (platform: SocialPlatform) => {
    if (!user) {
      toast.error("Please sign in to connect social accounts");
      return;
    }

    try {
      const url = `/api/auth/${platform.toLowerCase()}?userId=${user.id}`;
      window.location.replace(url);
    } catch (error) {
      console.error(`Failed to connect to ${platform}:`, error);
      toast.error(`Failed to connect to ${platform}`);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connected Accounts</CardTitle>
      </CardHeader>
      <div className="p-6 space-y-4">
        {Object.entries(SOCIAL_PLATFORMS).map(([key, value]) => {
          const platform = key as SocialPlatform;
          const isConnected = connections[platform];
          
          return (
            <div
              key={platform}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-2">
                <span className="font-medium">{platform}</span>
              </div>
              <Button
                variant={isConnected ? "outline" : "default"}
                onClick={() => handleConnect(platform)}
                disabled={!user || loading}
                className={isConnected ? "text-green-600" : ""}
              >
                {isConnected ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Connected
                  </>
                ) : (
                  "Connect"
                )}
              </Button>
            </div>
          );
        })}
      </div>
      {!user && (
        <div className="px-6 pb-6 text-sm text-muted-foreground text-center">
          Sign in to connect your social accounts
        </div>
      )}
    </Card>
  );
}
