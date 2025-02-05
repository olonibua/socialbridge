"use client";
import { useState, useRef } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { postToSocial } from "@/lib/social-integrations";
import { SOCIAL_PLATFORMS, SocialPlatform } from "@/config/social-platforms";
import { useSocialConnections } from "@/hooks/useSocialConnections";

interface MediaFile {
  file: File;
  preview: string;
  type: "image" | "video";
}

export default function PostCreator() {
  const [content, setContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<SocialPlatform>>(
    new Set()
  );
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { getAccessToken } = useSocialConnections();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newMediaFiles: MediaFile[] = [];
    Array.from(files).forEach((file) => {
      const type = file.type.startsWith("image/") ? "image" : "video";
      newMediaFiles.push({
        file,
        preview: URL.createObjectURL(file),
        type,
      });
    });

    setMediaFiles([...mediaFiles, ...newMediaFiles]);
  };

  const handlePost = async () => {
    if (!content.trim() && mediaFiles.length === 0) {
      toast.error("Please add some content or media to post");
      return;
    }

    if (selectedPlatforms.size === 0) {
      toast.error("Please select at least one platform to post to");
      return;
    }

    setIsPosting(true);
    try {
      const postPromises = Array.from(selectedPlatforms).map(async (platform) => {
        const accessToken = getAccessToken(platform);
        if (!accessToken) {
          throw new Error(`Not connected to ${platform}`);
        }

        return postToSocial({
          platform,
          content: {
            text: content,
            media: mediaFiles.map((media) => ({
              url: media.preview,
              type: media.type,
            })),
          },
          accessToken,
        });
      });

      await Promise.all(postPromises);
      setContent("");
      setMediaFiles([]);
      toast.success("Posted successfully!");
    } catch (error) {
      console.error("Failed to post:", error);
      toast.error("Failed to post. Please try again.");
    } finally {
      setIsPosting(false);
    }
  };

  const togglePlatform = (platform: SocialPlatform) => {
    const newSelected = new Set(selectedPlatforms);
    if (newSelected.has(platform)) {
      newSelected.delete(platform);
    } else {
      newSelected.add(platform);
    }
    setSelectedPlatforms(newSelected);
  };

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
          
          {/* Media Preview */}
          {mediaFiles.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {mediaFiles.map((media, index) => (
                <div key={index} className="relative">
                  {media.type === "image" ? (
                    <img
                      src={media.preview}
                      alt="Preview"
                      className="rounded-md w-full h-32 object-cover"
                    />
                  ) : (
                    <video
                      src={media.preview}
                      className="rounded-md w-full h-32 object-cover"
                      controls
                    />
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1"
                    onClick={() => {
                      const newMediaFiles = [...mediaFiles];
                      newMediaFiles.splice(index, 1);
                      setMediaFiles(newMediaFiles);
                    }}
                  >
                    <Icons.close className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-4">
            {Object.entries(SOCIAL_PLATFORMS).map(([key, value]) => {
              const platform = key as SocialPlatform;
              const Icon = Icons[value.name];
              return (
                <div
                  key={platform}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <Label htmlFor={platform}>{platform}</Label>
                  </div>
                  <Switch
                    id={platform}
                    checked={selectedPlatforms.has(platform)}
                    onCheckedChange={() => togglePlatform(platform)}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
          >
            <Icons.image className="mr-2 h-4 w-4" />
            Add Media
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />
          <Button
            className="flex-1"
            onClick={handlePost}
            disabled={isPosting || (!content.trim() && mediaFiles.length === 0) || selectedPlatforms.size === 0}
          >
            {isPosting ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              "Post"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
