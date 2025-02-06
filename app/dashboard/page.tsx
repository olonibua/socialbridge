import PostCreator from "@/components/dashboard/PostCreator";
import SocialConnections from "@/components/dashboard/SocialConnections";
import { AuthButtons } from "@/components/auth/AuthButtons";
import { Suspense } from "react";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-end mb-8">
          <AuthButtons />
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">
                Social Media Bridge
              </h1>
              <p className="text-muted-foreground">
                Connect, create, and share across all your social platforms
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-[400px,1fr]">
              <SocialConnections />
              <PostCreator />
            </div>
          </div>
        </Suspense>
      </div>
    </main>
  );
}
