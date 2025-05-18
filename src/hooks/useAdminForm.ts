
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

interface AdminFormData {
  email: string;
  firstName: string;
  lastName: string;
  role: 'super_admin' | 'admin' | 'support';
}

interface UseAdminFormProps {
  onSuccess: () => void;
  onOpenChange: (open: boolean) => void;
}

export const useAdminForm = ({ onSuccess, onOpenChange }: UseAdminFormProps) => {
  const [formData, setFormData] = useState<AdminFormData>({
    email: '',
    firstName: '',
    lastName: '',
    role: 'admin'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleChange = (field: keyof AdminFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      email: '',
      firstName: '',
      lastName: '',
      role: 'admin'
    });
  };

  const validateForm = () => {
    if (!formData.email) {
      toast({
        title: 'Missing information',
        description: 'Please provide an email address',
        variant: 'destructive'
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Create admin in auth
      const { error: authError } = await supabase.auth.admin.inviteUserByEmail(formData.email, {
        data: {
          user_type: 'admin',
          first_name: formData.firstName,
          last_name: formData.lastName
        }
      });
      
      if (authError) throw authError;
      
      // Find the user in the auth profiles
      const { data: userList, error: usersError } = await supabase.auth.admin.listUsers();
      
      if (usersError) throw usersError;
      
      // Apply proper typing to the users array
      const foundUser = (userList.users as User[]).find(u => u.email === formData.email);
      
      if (!foundUser) {
        throw new Error('User was not created properly');
      }
      
      // Create admin profile
      const { error: adminProfileError } = await supabase
        .from('admin_profiles')
        .insert({
          id: foundUser.id,
          email: formData.email,
          first_name: formData.firstName || null,
          last_name: formData.lastName || null,
          role: formData.role,
          is_active: true
        });
      
      if (adminProfileError) throw adminProfileError;
      
      toast({
        title: 'Admin account created',
        description: `Invitation sent to ${formData.email}`,
        variant: 'default'
      });
      
      onOpenChange(false);
      resetForm();
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

  return {
    formData,
    isSubmitting,
    handleChange,
    handleSubmit
  };
};
