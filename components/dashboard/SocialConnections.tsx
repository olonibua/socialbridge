"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import React from "react";

interface PlatformConnection {
  platform: string;
  isConnected: boolean;
  username?: string;
  icon: keyof typeof Icons;
}

export default function SocialConnections() {
  const { user } = useAuth();
  const [connections, setConnections] = useState<PlatformConnection[]>([
    { platform: "LinkedIn", isConnected: false, icon: "linkedin" },
    { platform: "Facebook", isConnected: false, icon: "facebook" },
    { platform: "Instagram", isConnected: false, icon: "instagram" },
    { platform: "Reddit", isConnected: false, icon: "reddit" },
  ]);

  const handleConnect = async (platform: string) => {
    console.log(`Connect to ${platform} - functionality temporarily disabled`);

    // switch (platform.toLowerCase()) {
    //   case "linkedin":
    //     window.location.href = `/api/auth/linkedin?userId=${user?.id}`;
    //     break;
    //   case "facebook":
    //     window.location.href = `/api/auth/facebook?userId=${user?.id}`;
    //     break;
    //   // Add other platforms similarly
    // }
  };

  const handleDisconnect = async (platform: string) => {
    try {
      const response = await fetch(
        `/api/disconnect/${platform.toLowerCase()}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user?.id }),
        }
      );

      if (response.ok) {
        setConnections((prev) =>
          prev.map((conn) =>
            conn.platform.toLowerCase() === platform.toLowerCase()
              ? { ...conn, isConnected: false, username: undefined }
              : conn
          )
        );
      }
    } catch (error) {
      console.error(`Failed to disconnect ${platform}:`, error);
    }
  };

  useEffect(() => {
    const fetchConnections = async () => {
      if (!user?.id) return;

      try {
        const response = await fetch(`/api/connections/${user.id}`);
        const data = await response.json();
        setConnections(data);
      } catch (error) {
        console.error("Failed to fetch connections:", error);
      }
    };

    fetchConnections();
  }, [user?.id]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icons.connection className="h-5 w-5" />
          Connected Platforms
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {connections.map(({ platform, isConnected, username, icon }) => {
          return (
            <div
              key={platform}
              className="flex items-center justify-between p-4 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-muted">
                  {React.createElement(Icons[icon], { className: "h-4 w-4" })}
                </div>
                <div>
                  <h3 className="font-medium">{platform}</h3>
                  {isConnected && username && (
                    <p className="text-sm text-muted-foreground">@{username}</p>
                  )}
                </div>
              </div>
              <Button
                variant={isConnected ? "destructive" : "default"}
                size="sm"
                onClick={() =>
                  isConnected
                    ? handleDisconnect(platform)
                    : handleConnect(platform)
                }
              >
                {isConnected ? "Disconnect" : "Connect"}
              </Button>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
