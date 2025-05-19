import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, RefreshCw } from 'lucide-react';

const AdminSetup: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const { toast } = useToast();
  
  const ADMIN_EMAIL = 'zitro.admin@example.com';
  const ADMIN_PASSWORD = 'admin790';

  const checkAdminExists = async () => {
    try {
      // We can use auth.signInWithPassword to check if credentials work
      // This is safer than querying for users directly (which requires admin privileges)
      const { data, error } = await supabase.auth.signInWithPassword({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD
      });
      
      // If successful login, the admin exists with the current password
      if (data?.user) {
        // Sign out immediately since we're just checking
        await supabase.auth.signOut();
        return { exists: true, passwordValid: true };
      }
      
      // If specific error about invalid credentials, the user might exist but password is wrong
      if (error?.message?.includes("Invalid login credentials")) {
        return { exists: true, passwordValid: false };
      }
      
      // Otherwise, assume the user doesn't exist
      return { exists: false, passwordValid: false };
    } catch (error) {
      console.error("Error checking admin existence:", error);
      return { exists: false, passwordValid: false, error };
    }
  };

  const createDevAdmin = async () => {
    setIsCreating(true);
    try {
      // First, check if admin already exists
      const adminStatus = await checkAdminExists();
      
      if (adminStatus.exists) {
        if (adminStatus.passwordValid) {
          toast({
            title: 'Admin already exists',
            description: `The admin user ${ADMIN_EMAIL} already exists and the password is valid. You can log in with the credentials shown below.`,
          });
        } else {
          toast({
            title: 'Admin already exists',
            description: 'The admin user already exists, but the password may have been changed. Use the Reset Password button to send a reset link.',
            variant: 'destructive'
          });
        }
        setIsCreating(false);
        return;
      }
      
      // Create admin user using standard auth API
      const { error: authError } = await supabase.auth.signUp({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        options: {
          data: {
            user_type: 'admin',
            first_name: 'Zitro',
            last_name: 'Admin'
          },
          emailRedirectTo: window.location.origin
        }
      });
      
      if (authError) throw authError;
      
      toast({
        title: 'Admin created',
        description: `The admin user ${ADMIN_EMAIL} has been created with password ${ADMIN_PASSWORD}. Make sure email verification is disabled in the Supabase Dashboard for development.`,
      });
      
    } catch (error: any) {
      console.error('Error creating admin:', error);
      
      // Better error handling with specific messages
      if (error.message?.includes("User already registered")) {
        toast({
          title: 'Admin already exists',
          description: 'This admin user already exists. You can use the Reset Password button if you need to reset the password.',
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Failed to create admin',
          description: error.message || 'An error occurred',
          variant: 'destructive'
        });
      }
    } finally {
      setIsCreating(false);
    }
  };

  const resetAdminPassword = async () => {
    setIsResetting(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(ADMIN_EMAIL, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      
      if (error) throw error;
      
      toast({
        title: 'Password reset email sent',
        description: `A password reset link has been sent to ${ADMIN_EMAIL}. Check your email inbox.`,
      });
      
    } catch (error: any) {
      console.error('Error resetting password:', error);
      toast({
        title: 'Failed to reset password',
        description: error.message || 'An error occurred',
        variant: 'destructive'
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Development Admin Setup</CardTitle>
        <CardDescription>
          Create or manage a development admin account for testing purposes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-4">
          This will manage an admin user with the following credentials:
        </p>
        <ul className="list-disc pl-5 mb-4 text-sm">
          <li>Email: {ADMIN_EMAIL}</li>
          <li>Password: {ADMIN_PASSWORD}</li>
          <li>Role: admin</li>
        </ul>
        <p className="text-sm text-amber-600">
          Note: Use this only for development purposes.
        </p>
        <p className="text-sm text-amber-600 mt-2">
          Important: For development, disable email verification in the Supabase Console under Authentication &gt; Providers.
        </p>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-3">
        <Button 
          onClick={createDevAdmin} 
          disabled={isCreating || isResetting}
          className="bg-amber-500 hover:bg-amber-600 w-full sm:w-auto"
        >
          {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Development Admin
        </Button>
        <Button 
          onClick={resetAdminPassword} 
          disabled={isCreating || isResetting}
          variant="outline"
          className="border-amber-300 text-amber-700 hover:bg-amber-50 w-full sm:w-auto"
        >
          {isResetting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {!isResetting && <RefreshCw className="mr-2 h-4 w-4" />}
          Reset Admin Password
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AdminSetup;
