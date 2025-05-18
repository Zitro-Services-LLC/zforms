
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import AdminAccountsManager from '@/components/admin/AdminAccountsManager';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AdminProfile } from '@/types/admin';
import { Skeleton } from '@/components/ui/skeleton';

const AdminManagementPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [adminProfiles, setAdminProfiles] = useState<AdminProfile[]>([]);
  const { toast } = useToast();

  const fetchAdminProfiles = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('admin_profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setAdminProfiles(data || []);
    } catch (error: any) {
      console.error('Error fetching admin profiles:', error);
      toast({
        title: 'Error',
        description: 'Failed to load admin accounts',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminProfiles();
  }, [toast]);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Management</h1>
          <p className="text-muted-foreground">Manage administrator accounts and permissions.</p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        ) : (
          <AdminAccountsManager 
            adminAccounts={adminProfiles} 
            onRefresh={fetchAdminProfiles} 
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminManagementPage;
