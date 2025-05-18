
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAdminForm } from '@/hooks/useAdminForm';
import AdminDialogForm from './AdminDialogForm';

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
  const { formData, isSubmitting, handleChange, handleSubmit } = useAdminForm({ onSuccess, onOpenChange });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Admin Account</DialogTitle>
          <DialogDescription>
            Add a new administrator to the system. An invitation will be sent to their email.
          </DialogDescription>
        </DialogHeader>
        
        <AdminDialogForm
          formData={formData}
          isSubmitting={isSubmitting}
          onChangeField={handleChange}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AdminCreateDialog;
