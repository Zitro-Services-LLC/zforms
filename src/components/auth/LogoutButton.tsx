
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";
import { LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LogoutButtonProps {
  className?: string;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ className }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Error logging out:", error);
        toast({
          title: "Logout failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Logged out successfully",
          description: "You have been logged out of your account",
        });
        // Navigate to the landing page after successful logout
        navigate("/");
      }
    } catch (error) {
      console.error("Unexpected error during logout:", error);
      toast({
        title: "Logout failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <button 
      onClick={handleLogout} 
      disabled={isLoggingOut}
      className={`text-sm text-gray-500 hover:text-amber-600 flex items-center gap-1 ${className || ''}`}
    >
      <LogOut className="w-4 h-4" />
      <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
    </button>
  );
};

export default LogoutButton;
