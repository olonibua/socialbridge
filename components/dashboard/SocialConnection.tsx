"use client";

import { Button } from "@/components/ui/button";
import { SocialPlatform } from "@/config/social-platforms";
import { databases } from "@/config/appwrite";
import { toast } from "sonner";
import { useSocialConnections } from "@/hooks/useSocialConnections";
import { useAuth } from "@/hooks/useAuth";

interface SocialConnectionProps {
  platform: SocialPlatform;
  isConnected: boolean;
  connectionId?: string;
  onConnect: (platform: SocialPlatform) => void;
  onDisconnect: (platform: SocialPlatform) => void;
}

export default function SocialConnection({
  platform,
  isConnected,
  connectionId,
  onConnect,
  onDisconnect,
}: SocialConnectionProps) {
  const { user } = useAuth();
  const { refreshConnections } = useSocialConnections();

  const handleLinkedInConnect = async (userId: string) => {
    try {
      // Get the auth URL from the backend
      const response = await fetch(`/api/auth/linkedin?userId=${userId}`);
      const data = await response.json();
      
      if (!data.authUrl) {
        throw new Error("Failed to get auth URL");
      }

      // Open popup window
      const width = 600;
      const height = 700;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      
      const popup = window.open(
        data.authUrl,
        "LinkedIn Login",
        `width=${width},height=${height},left=${left},top=${top},toolbar=0,scrollbars=1,status=1,resizable=1,location=1,menuBar=0`
      );

      // Poll for popup closure and check for success
      const pollTimer = setInterval(() => {
        if (popup?.closed) {
          clearInterval(pollTimer);
          // Check URL parameters for success/error
          const urlParams = new URLSearchParams(window.location.search);
          if (urlParams.get("connection") === "success") {
            toast.success("Successfully connected to LinkedIn!");
            refreshConnections();
          } else if (urlParams.get("error")) {
            toast.error("Failed to connect to LinkedIn");
          }
        }
      }, 500);
    } catch (error) {
      console.error("Failed to connect to LinkedIn:", error);
      toast.error("Failed to connect to LinkedIn");
    }
  };

  const handleDisconnect = async () => {
    try {
      if (!connectionId) {
        throw new Error("No connection ID found");
      }

      await databases.deleteDocument(
        process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
        process.env.NEXT_PUBLIC_APPWRITE_SOCIAL_CONNECTIONS_COLLECTION_ID!,
        connectionId
      );

      await refreshConnections();
      toast.success(`Disconnected from ${platform}`);
      onDisconnect(platform);
    } catch (error) {
      console.error(`Failed to disconnect from ${platform}:`, error);
      toast.error(`Failed to disconnect from ${platform}`);
    }
  };

  const handleConnect = async (userId: string | undefined) => {
    if (!userId) {
      toast.error("User not authenticated");
      return;
    }

    if (platform === "LINKEDIN") {
      await handleLinkedInConnect(userId);
    } else {
      onConnect(platform);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center gap-3">
        <div className="font-medium">{platform}</div>
        {isConnected && <span className="text-sm text-green-500">• Connected</span>}
      </div>
      <Button
        variant={isConnected ? "destructive" : "default"}
        onClick={isConnected ? handleDisconnect : () => handleConnect(user?.id)}
      >
        {isConnected ? "Disconnect" : "Connect"}
      </Button>
    </div>
  );
}