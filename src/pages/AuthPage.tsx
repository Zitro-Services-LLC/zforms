
import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { Loader2, Github, Twitter, Mail, User as UserIcon } from "lucide-react";
import ForgotPasswordForm from "@/components/auth/ForgotPasswordForm";

const SOCIALS = [
  { name: "Google", key: "google", icon: <Mail className="w-4 h-4" /> },
  { name: "GitHub", key: "github", icon: <Github className="w-4 h-4" /> },
  { name: "Twitter", key: "twitter", icon: <Twitter className="w-4 h-4" /> },
];

const TABS = [
  { label: "Sign In", value: "login" },
  { label: "Sign Up", value: "register" },
];

export default function AuthPage() {
  const [tab, setTab] = useState<"login" | "register" | "forgot-password">("login");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { session, user } = useSupabaseAuth();

  // If already logged in, redirect to dashboard
  React.useEffect(() => {
    if (session && user) {
      window.location.replace(
        user.user_metadata?.user_type === "customer"
          ? "/customer/dashboard"
          : "/dashboard"
      );
    }
  }, [session, user]);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState<"contractor" | "customer">("contractor");
  const [error, setError] = useState<string | null>(null);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!email || !password) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    if (tab === "register") {
      // user_type metadata for signup
      const { error: signupErr } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { user_type: userType }, // Pass to profiles trigger
        },
      });
      setLoading(false);
      if (signupErr) {
        setError(signupErr.message);
        toast({ title: "Registration failed", description: signupErr.message });
      } else {
        toast({ title: "Check your email!", description: "Please confirm your email to login." });
      }
    } else {
      // LOGIN
      const { error: loginErr } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      setLoading(false);
      if (loginErr) {
        setError(loginErr.message);
        toast({ title: "Login failed", description: loginErr.message });
      }
    }
  };

  const handleSocialAuth = async (provider: "google" | "github" | "twitter") => {
    setLoading(true);
    setError(null);
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
      setError(socialErr.message);
      toast({ title: "Social login failed", description: socialErr.message });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-2">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md space-y-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          <UserIcon className="w-8 h-8 text-amber-500" />
          <span className="text-2xl font-bold text-gray-900">zforms</span>
        </div>
        <div className="flex justify-center gap-2 mb-6">
          {TABS.map(t => (
            <button
              key={t.value}
              onClick={() => setTab(t.value as "login" | "register")}
              className={`px-4 py-2 font-medium rounded-t ${
                tab === t.value
                  ? "bg-amber-100 text-amber-600"
                  : "bg-gray-50 text-gray-500 hover:text-amber-600"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "forgot-password" ? (
          <ForgotPasswordForm onCancel={() => setTab("login")} />
        ) : (
          <>
            {/* Email/password form */}
            <form onSubmit={handleEmailAuth} className="space-y-4">
              <div>
                <Input
                  placeholder="Email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  disabled={loading}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div>
                <Input
                  placeholder="Password"
                  type="password"
                  autoComplete={tab === "login" ? "current-password" : "new-password"}
                  value={password}
                  disabled={loading}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
              {tab === "register" && (
                <div className="flex gap-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      checked={userType === "contractor"}
                      name="user_type"
                      value="contractor"
                      onChange={() => setUserType("contractor")}
                      disabled={loading}
                      className="mr-1"
                    />
                    Contractor
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      checked={userType === "customer"}
                      name="user_type"
                      value="customer"
                      onChange={() => setUserType("customer")}
                      disabled={loading}
                      className="mr-1"
                    />
                    Customer
                  </label>
                </div>
              )}
              {error && <div className="text-sm text-red-600">{error}</div>}
              <Button
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600"
                disabled={loading}
              >
                {loading ? <Loader2 className="animate-spin w-4 h-4" /> : tab === "login" ? "Sign In" : "Sign Up"}
              </Button>
              
              {tab === "login" && (
                <div className="text-center">
                  <button 
                    type="button" 
                    onClick={() => setTab("forgot-password")}
                    className="text-sm text-amber-600 hover:text-amber-700"
                  >
                    Forgot your password?
                  </button>
                </div>
              )}
            </form>

            <div className="text-center text-xs text-gray-400 mt-2">
              {tab === "login" ? "or sign in with" : "or sign up with"}
            </div>

            {/* Social Login */}
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
        )}

        <Separator />

        <div className="text-center text-xs text-gray-400">
          By using this app you agree to our Terms of Service and Privacy Policy.
        </div>
      </div>
    </div>
  );
}
