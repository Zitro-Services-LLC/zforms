
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { AdminProfile } from '@/types/admin';
import { UserPlus, Check, X } from 'lucide-react';

interface AdminAccountsManagerProps {
  adminAccounts: AdminProfile[];
  onRefresh: () => void;
}

const AdminAccountsManager: React.FC<AdminAccountsManagerProps> = ({ 
  adminAccounts,
  onRefresh
}) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: 'admin' as 'super_admin' | 'admin' | 'support'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleCreateAdmin = async () => {
    if (!newAdmin.email) {
      toast({
        title: 'Missing information',
        description: 'Please provide an email address',
        variant: 'destructive'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Create admin in auth
      const { error: authError } = await supabase.auth.admin.inviteUserByEmail(newAdmin.email, {
        data: {
          user_type: 'admin',
          first_name: newAdmin.firstName,
          last_name: newAdmin.lastName
        }
      });
      
      if (authError) throw authError;
      
      // Find the user in the auth profiles
      const { data: authUser, error: profileError } = await supabase.auth.admin.getUserByEmail(newAdmin.email);
      
      if (profileError) throw profileError;
      
      if (!authUser.user) {
        throw new Error('User was not created properly');
      }
      
      // Create admin profile
      const { error: adminProfileError } = await supabase
        .from('admin_profiles')
        .insert({
          id: authUser.user.id,
          email: newAdmin.email,
          first_name: newAdmin.firstName || null,
          last_name: newAdmin.lastName || null,
          role: newAdmin.role,
          is_active: true
        });
      
      if (adminProfileError) throw adminProfileError;
      
      toast({
        title: 'Admin account created',
        description: `Invitation sent to ${newAdmin.email}`,
        variant: 'default'
      });
      
      setIsCreateDialogOpen(false);
      setNewAdmin({
        email: '',
        firstName: '',
        lastName: '',
        role: 'admin'
      });
      onRefresh();
    } catch (error: any) {
      toast({
        title: 'Failed to create admin',
        description: error.message || 'An error occurred',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'super_admin':
        return <Badge className="bg-purple-500">Super Admin</Badge>;
      case 'admin':
        return <Badge className="bg-blue-500">Admin</Badge>;
      case 'support':
        return <Badge className="bg-green-500">Support</Badge>;
      default:
        return <Badge className="bg-gray-500">{role}</Badge>;
    }
  };

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
            <div className="rounded-md border">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {adminAccounts.map((admin) => (
                    <tr key={admin.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {admin.first_name} {admin.last_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {admin.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getRoleBadge(admin.role)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {admin.is_active ? (
                          <div className="flex items-center">
                            <Check className="h-4 w-4 text-green-500 mr-1" />
                            <span>Active</span>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <X className="h-4 w-4 text-red-500 mr-1" />
                            <span>Inactive</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Admin Account</DialogTitle>
            <DialogDescription>
              Add a new administrator to the system. An invitation will be sent to their email.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="email">
                Email *
              </label>
              <Input
                id="email"
                placeholder="admin@example.com"
                value={newAdmin.email}
                onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="firstName">
                  First Name
                </label>
                <Input
                  id="firstName"
                  placeholder="First Name"
                  value={newAdmin.firstName}
                  onChange={(e) => setNewAdmin({...newAdmin, firstName: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="lastName">
                  Last Name
                </label>
                <Input
                  id="lastName"
                  placeholder="Last Name"
                  value={newAdmin.lastName}
                  onChange={(e) => setNewAdmin({...newAdmin, lastName: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="role">
                Role
              </label>
              <Select
                value={newAdmin.role}
                onValueChange={(value: any) => setNewAdmin({...newAdmin, role: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateAdmin}
              className="bg-amber-500 hover:bg-amber-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Admin"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminAccountsManager;
