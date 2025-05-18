
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export function useAdminAuth(redirectOnFail = true) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Listen BEFORE fetching the session to avoid missing events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("Auth state changed for admin:", _event);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Check if user is an admin
        const { data, error } = await supabase
          .from('admin_profiles')
          .select('*')
          .eq('id', session.user.id)
          .eq('is_active', true)
          .single();
        
        if (error || !data) {
          console.error("Not an admin or error fetching admin profile:", error);
          setIsAdmin(false);
          if (redirectOnFail) {
            toast({
              title: "Access denied",
              description: "You don't have admin permissions.",
              variant: "destructive"
            });
            navigate('/auth');
          }
        } else {
          console.log("Admin profile found:", data);
          setIsAdmin(true);
        }
      } else {
        setIsAdmin(false);
        if (redirectOnFail) navigate('/auth');
      }
      
      setLoading(false);
    });
    
    // Then load current session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      console.log("Current admin session:", session ? "Active" : "None");
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        // Check if user is an admin
        const { data, error } = await supabase
          .from('admin_profiles')
          .select('*')
          .eq('id', session.user.id)
          .eq('is_active', true)
          .single();
        
        if (error || !data) {
          console.error("Not an admin or error fetching admin profile:", error);
          setIsAdmin(false);
          if (redirectOnFail) {
            toast({
              title: "Access denied",
              description: "You don't have admin permissions.",
              variant: "destructive"
            });
            navigate('/auth');
          }
        } else {
          console.log("Admin profile found:", data);
          setIsAdmin(true);
        }
      } else {
        setIsAdmin(false);
        if (redirectOnFail) navigate('/auth');
      }
      
      setLoading(false);
    });
    
    return () => subscription.unsubscribe();
  }, [navigate, redirectOnFail, toast]);

  return { session, user, isAdmin, loading };
}
