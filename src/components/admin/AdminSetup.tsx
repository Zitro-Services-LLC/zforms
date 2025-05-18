
import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const AdminSetup: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const createDevAdmin = async () => {
    setIsCreating(true);
    try {
      // Create admin user in auth
      const { error: authError } = await supabase.auth.admin.createUser({
        email: 'zitro.admin@example.com',
        password: 'admin790',
        email_confirm: true,
        user_metadata: {
          user_type: 'admin',
          first_name: 'Zitro',
          last_name: 'Admin'
        }
      });
      
      if (authError) throw authError;
      
      toast({
        title: 'Admin created',
        description: 'The admin user zitro.admin@example.com has been created with password admin790',
      });

      // Note: The user will be automatically added to admin_profiles 
      // via the handle_new_user trigger function
      
    } catch (error: any) {
      console.error('Error creating admin:', error);
      toast({
        title: 'Failed to create admin',
        description: error.message || 'An error occurred',
        variant: 'destructive'
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Development Admin Setup</CardTitle>
        <CardDescription>
          Create a development admin account for testing purposes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-4">
          This will create an admin user with the following credentials:
        </p>
        <ul className="list-disc pl-5 mb-4 text-sm">
          <li>Email: zitro.admin@example.com</li>
          <li>Password: admin790</li>
          <li>Role: admin</li>
        </ul>
        <p className="text-sm text-amber-600">
          Note: Use this only for development purposes.
        </p>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={createDevAdmin} 
          disabled={isCreating}
          className="bg-amber-500 hover:bg-amber-600"
        >
          {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Development Admin
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AdminSetup;
