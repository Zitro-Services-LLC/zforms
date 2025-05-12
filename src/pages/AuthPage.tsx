
import React, { useState, useEffect } from "react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { Separator } from "@/components/ui/separator";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";
import AuthHeader from "@/components/auth/AuthHeader";
import AuthTabs from "@/components/auth/AuthTabs";
import EmailAuthForm from "@/components/auth/EmailAuthForm";
import SocialAuth from "@/components/auth/SocialAuth";

export default function AuthPage() {
  const [tab, setTab] = useState<"login" | "register" | "forgot-password">("login");
  const { session, user } = useSupabaseAuth();

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (session && user) {
      window.location.replace(
        user.user_metadata?.user_type === "customer"
          ? "/customer/dashboard"
          : "/dashboard"
      );
    }
  }, [session, user]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-2">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md space-y-6">
        <AuthHeader />
        
        <AuthTabs tab={tab} setTab={setTab} />

        {tab === "forgot-password" ? (
          <ForgotPasswordForm onCancel={() => setTab("login")} />
        ) : (
          <>
            <EmailAuthForm tab={tab} setTab={setTab} />
            <SocialAuth tab={tab} />
          </>
        )}

        <Separator />

        <div className="text-center text-xs text-gray-400">
          By using this app you agree to our Terms of Service and Privacy Policy.
        </div>
      </div>
    </div>
  );
}
