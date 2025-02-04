"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
// import { Label } from "@/components/ui/label";
// import { Switch } from "@/components/ui/switch";
// import { postToLinkedIn } from "@/lib/social-integrations/linkedin";
import React from "react";

export default function PostCreator() {
  const [content, setContent] = useState("");
  const [media, setMedia] = useState<File | null>(null);
  // const [isPosting, setIsPosting] = useState(false);
  // const [platforms, setPlatforms] = useState({
  //   linkedin: false,
  //   facebook: false,
  //   instagram: false,
  //   reddit: false,
  // });

  // const handlePost = async () => {
  //   if (!content.trim()) return;

  //   setIsPosting(true);
  //   try {
  //     if (platforms.linkedin) {
  //       await postToLinkedIn(content, "user_linkedin_access_token");
  //     }
  //     // Add other platforms
  //     setContent("");
  //     setMedia(null);
  //   } catch (error) {
  //     console.error("Post failed", error);
  //   } finally {
  //     setIsPosting(false);
  //   }
  // };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icons.edit className="h-5 w-5" />
          Create Post
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[120px]"
          />
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.getElementById("media-input")?.click()}
              className="gap-2"
            >
              <Icons.image className="h-4 w-4" />
              {media ? "Change Media" : "Add Media"}
            </Button>
            {media && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMedia(null)}
                className="text-destructive"
              >
                Remove Media
              </Button>
            )}
            <input
              id="media-input"
              type="file"
              accept="image/*,video/*"
              onChange={(e) => setMedia(e.target.files?.[0] || null)}
              className="hidden"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Post to Platforms</h3>
          {/* <div className="grid gap-4 sm:grid-cols-2">
            {Object.entries(platforms).map(([platform, isEnabled]) => (
              <div
                key={platform}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center gap-2">
                  {React.createElement(Icons[platform as keyof typeof Icons], {
                    className: "h-4 w-4",
                  })}
                  <Label htmlFor={platform} className="capitalize">
                    {platform}
                  </Label>
                </div>
                <Switch
                  id={platform}
                  checked={isEnabled}
                  onCheckedChange={(checked) =>
                    setPlatforms((prev) => ({ ...prev, [platform]: checked }))
                  }
                />
              </div>
            ))}
          </div> */}
        </div>

        {/* <Button
          className="w-full"
          size="lg"
          onClick={handlePost}
          disabled={!content.trim() || isPosting}
        >
          {isPosting ? (
            <>
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              Posting...
            </>
          ) : (
            "Post Now"
          )}
        </Button> */}
      </CardContent>
    </Card>
  );
}
