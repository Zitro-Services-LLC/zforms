
import React, { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Eye, EyeOff } from "lucide-react";

interface EmailAuthFormProps {
  tab: "login" | "register";
  setTab: (tab: "login" | "register" | "forgot-password") => void;
}

const EmailAuthForm: React.FC<EmailAuthFormProps> = ({ tab, setTab }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState<"contractor" | "customer">("contractor");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
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
      <div className="relative">
        <Input
          placeholder="Password"
          type={showPassword ? "text" : "password"}
          autoComplete={tab === "login" ? "current-password" : "new-password"}
          value={password}
          disabled={loading}
          onChange={e => setPassword(e.target.value)}
        />
        <button 
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          tabIndex={-1}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
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
  );
};

export default EmailAuthForm;
