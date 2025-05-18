
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface AdminFormData {
  email: string;
  firstName: string;
  lastName: string;
  role: 'super_admin' | 'admin' | 'support';
}

interface AdminDialogFormProps {
  formData: AdminFormData;
  isSubmitting: boolean;
  onChangeField: (field: keyof AdminFormData, value: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

const AdminDialogForm: React.FC<AdminDialogFormProps> = ({
  formData,
  isSubmitting,
  onChangeField,
  onSubmit,
  onCancel
}) => {
  return (
    <>
      <div className="space-y-4 py-2">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="email">
            Email *
          </label>
          <Input
            id="email"
            placeholder="admin@example.com"
            value={formData.email}
            onChange={(e) => onChangeField('email', e.target.value)}
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
              value={formData.firstName}
              onChange={(e) => onChangeField('firstName', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="lastName">
              Last Name
            </label>
            <Input
              id="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={(e) => onChangeField('lastName', e.target.value)}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="role">
            Role
          </label>
          <Select
            value={formData.role}
            onValueChange={(value: any) => onChangeField('role', value)}
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
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          onClick={onSubmit}
          className="bg-amber-500 hover:bg-amber-600"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create Admin"}
        </Button>
      </DialogFooter>
    </>
  );
};

export default AdminDialogForm;
