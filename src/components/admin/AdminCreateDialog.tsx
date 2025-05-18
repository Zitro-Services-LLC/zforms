
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface AdminCreateDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const AdminCreateDialog: React.FC<AdminCreateDialogProps> = ({ 
  isOpen, 
  onOpenChange, 
  onSuccess 
}) => {
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
      const { data: userList, error: usersError } = await supabase.auth.admin.listUsers();
      
      if (usersError) throw usersError;
      
      // Apply proper typing to the users array
      const foundUser = (userList.users as User[]).find(u => u.email === newAdmin.email);
      
      if (!foundUser) {
        throw new Error('User was not created properly');
      }
      
      // Create admin profile
      const { error: adminProfileError } = await supabase
        .from('admin_profiles')
        .insert({
          id: foundUser.id,
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
      
      onOpenChange(false);
      setNewAdmin({
        email: '',
        firstName: '',
        lastName: '',
        role: 'admin'
      });
      onSuccess();
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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
            onClick={() => onOpenChange(false)}
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
  );
};

export default AdminCreateDialog;
