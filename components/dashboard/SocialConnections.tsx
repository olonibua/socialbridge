"use client";

import {  SocialPlatform } from "@/config/social-platforms";
import { useEffect } from "react";
import { toast } from "sonner";

import { useSearchParams } from "next/navigation";
import { useSocialConnections } from "@/hooks/useSocialConnections";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import SocialConnection from "./SocialConnection";

export default function SocialConnections() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const { connections, loading, refreshConnections } = useSocialConnections();

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
      await refreshConnections();
    } catch (error) {
      console.error("Failed to fetch connections:", error);
    }
  };

  const handleConnect = async (platform: SocialPlatform) => {
    if (!user) {
      toast.error("Please sign in to connect social accounts");
      return;
    }

    try {
      window.location.href = `/api/auth/${platform.toLowerCase()}?userId=${user.id}`;
    } catch (error) {
      console.error(`Failed to connect to ${platform}:`, error);
      toast.error(`Failed to connect to ${platform}`);
    }
  };

  const handleDisconnect = async (platform: SocialPlatform) => {
    await refreshConnections();
  };

  if (loading) {
    return <div>Loading connections...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connected Accounts</CardTitle>
      </CardHeader>
      <div className="p-6 space-y-4">
        <div className="space-y-3">
          {Object.values(SocialPlatform).map((platform) => {
            const connection = connections.find(
              (conn) => conn.platform === platform
            );
            return (
              <SocialConnection
                key={platform}
                platform={platform}
                isConnected={!!connection?.isConnected}
                connectionId={connection?.$id}
                onConnect={handleConnect}
                onDisconnect={handleDisconnect}
              />
            );
          })}
        </div>
      </div>
      {!user && (
        <div className="px-6 pb-6 text-sm text-muted-foreground text-center">
          Sign in to connect your social accounts
        </div>
      )}
    </Card>
  );
}
