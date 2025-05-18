
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AdminProfile } from '@/types/admin';
import { UserPlus } from 'lucide-react';
import AdminCreateDialog from './AdminCreateDialog';
import AdminsTable from './AdminsTable';

interface AdminAccountsManagerProps {
  adminAccounts: AdminProfile[];
  onRefresh: () => void;
}

const AdminAccountsManager: React.FC<AdminAccountsManagerProps> = ({ 
  adminAccounts,
  onRefresh
}) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Admin Accounts</CardTitle>
            <CardDescription>Manage administrator accounts</CardDescription>
          </div>
          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-amber-500 hover:bg-amber-600"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add Admin
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <AdminsTable adminAccounts={adminAccounts} />
          </div>
        </CardContent>
      </Card>

      <AdminCreateDialog 
        isOpen={isCreateDialogOpen} 
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={onRefresh}
      />
    </>
  );
};

export default AdminAccountsManager;
