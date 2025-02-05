"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SignInModal } from "./SignInModal";
import { SignUpModal } from "./SignUpModal";
import { useAuth } from "@/hooks/useAuth";

export function AuthButtons() {
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const { user, logout } = useAuth();

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">
          {user.email}
        </span>
        <Button variant="outline" onClick={logout}>
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={() => setShowSignIn(true)}>
          Sign In
        </Button>
        <Button onClick={() => setShowSignUp(true)}>
          Sign Up
        </Button>
      </div>
      <SignInModal open={showSignIn} onClose={() => setShowSignIn(false)} />
      <SignUpModal open={showSignUp} onClose={() => setShowSignUp(false)} />
    </>
  );
} 