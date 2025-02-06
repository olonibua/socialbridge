"use client";

import { useState } from "react";
import { account } from "@/config/appwrite";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ID } from "appwrite";

interface SignUpModalProps {
  open: boolean;
  onClose: () => void;
}

export function SignUpModal({ open, onClose }: SignUpModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await account.create(ID.unique(), email, password, name);
      await account.createEmailPasswordSession(email, password);
      toast.success("Account created successfully");
      onClose();

    } catch (error: unknown) {
      const err = error as Error;
      console.error('Sign up failed:', err);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm">
      <div className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
        <div className="w-[400px] rounded-lg border bg-card p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Creating account..." : "Sign Up"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 