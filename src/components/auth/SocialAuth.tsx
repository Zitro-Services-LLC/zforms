
import React, { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Github, Twitter, Mail } from "lucide-react";

interface SocialAuthProps {
  tab: "login" | "register";
}

const SOCIALS = [
  { name: "Google", key: "google", icon: <Mail className="w-4 h-4" /> },
  { name: "GitHub", key: "github", icon: <Github className="w-4 h-4" /> },
  { name: "Twitter", key: "twitter", icon: <Twitter className="w-4 h-4" /> },
];

const SocialAuth: React.FC<SocialAuthProps> = ({ tab }) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const handleSocialAuth = async (provider: "google" | "github" | "twitter") => {
    setLoading(true);
    
    const { error: socialErr } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        // These redirect URLs must be set in Supabase Auth settings!
        redirectTo: window.location.origin + "/auth",
      },
    });
    
    // for OAuth popup redirects, the page will reload!
    setLoading(false);
    if (socialErr) {
      toast({ title: "Social login failed", description: socialErr.message });
    }
  };

  return (
    <>
      <div className="text-center text-xs text-gray-400 mt-2">
        {tab === "login" ? "or sign in with" : "or sign up with"}
      </div>

      <div className="flex flex-col gap-2">
        {SOCIALS.map(({ name, key, icon }) => (
          <Button
            key={key}
            variant="outline"
            onClick={() => handleSocialAuth(key as any)}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2"
            type="button"
          >
            {icon}
            <span>{name}</span>
          </Button>
        ))}
      </div>
    </>
  );
};

export default SocialAuth;
