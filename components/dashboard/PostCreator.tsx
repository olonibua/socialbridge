"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { getAccessToken, postToSocial } from "@/lib/social-integrations";
import { SOCIAL_PLATFORMS, SocialPlatform } from "@/config/social-platforms";
import { useSocialConnections } from "@/hooks/useSocialConnections";
import { useAuth } from "@/hooks/useAuth";
import { Upload } from "lucide-react";
import Image from 'next/image';

export default function PostCreator() {
  const [content, setContent] = useState("");
  const [media, setMedia] = useState<File[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<SocialPlatform>>(
    new Set()
  );
  const { connections } = useSocialConnections();
  const { user } = useAuth();

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) throw new Error('Upload failed');
    const data = await response.json();
    return data.url;
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setMedia(Array.from(e.target.files));
    }
  };

  const handlePost = async () => {
    if (!content.trim() && media.length === 0) {
      toast.error("Please enter content or add media");
      return;
    }

    if (!user) {
      toast.error("Please sign in to post");
      return;
    }

    setIsPosting(true);
    try {
      const mediaUrls = await Promise.all(
        media.map(async (file) => ({
          url: await uploadFile(file),
          type: file.type.startsWith("image/") ? "image" as const : "video" as const
        }))
      );

      const connectedPlatforms = Array.from(selectedPlatforms);
      
      await Promise.all(
        connectedPlatforms.map(async (platform) => {
          const accessToken = await getAccessToken(user.id, platform);
          if (!accessToken) {
            throw new Error(`No access token for ${platform}`);
          }

          return postToSocial(platform, {
            text: content,
            media: mediaUrls
          }, accessToken);
        })
      );

      toast.success("Posted successfully!");
      setContent("");
      setMedia([]);
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
            rows={4}
          />
          
          <div className="flex items-center gap-4">
            <label className="cursor-pointer">
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleMediaChange}
                className="hidden"
              />
              <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <Upload className="h-4 w-4" />
                {media.length ? `${media.length} files selected` : "Add Media"}
              </div>
            </label>
          </div>

          {media.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {media.map((file, index) => (
                <div key={index} className="relative">
                  <Image 
                    src={URL.createObjectURL(file)}
                    alt={`Upload ${index + 1}`}
                    width={200}
                    height={200}
                    className="h-20 w-20 object-cover rounded"
                  />
                  <button
                    onClick={() => setMedia(media.filter((_, i) => i !== index))}
                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                  >
                    ×
                  </button>
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
            className="flex-1"
            onClick={handlePost}
            disabled={isPosting || (!content.trim() && media.length === 0)}
          >
            {isPosting ? "Posting..." : "Post"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
