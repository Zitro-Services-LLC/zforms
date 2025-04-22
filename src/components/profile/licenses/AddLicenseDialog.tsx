
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import type { LicenseFormData, ContractorLicense } from '@/types/license';

interface AddLicenseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LicenseFormData) => Promise<void>;
  isSubmitting: boolean;
  editingLicense: ContractorLicense | null;
}

export const AddLicenseDialog: React.FC<AddLicenseDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting,
  editingLicense
}) => {
  const isEditing = !!editingLicense;
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<LicenseFormData>({
    defaultValues: editingLicense ? {
      agency: editingLicense.agency,
      license_no: editingLicense.license_no,
      issue_date: editingLicense.issue_date,
      expiry_date: editingLicense.expiry_date
    } : {
      agency: '',
      license_no: '',
      issue_date: '',
      expiry_date: ''
    }
  });

  React.useEffect(() => {
    if (isOpen) {
      reset(editingLicense ? {
        agency: editingLicense.agency,
        license_no: editingLicense.license_no,
        issue_date: editingLicense.issue_date,
        expiry_date: editingLicense.expiry_date
      } : {
        agency: '',
        license_no: '',
        issue_date: '',
        expiry_date: ''
      });
    }
  }, [isOpen, editingLicense, reset]);

  const onFormSubmit = async (data: LicenseFormData) => {
    await onSubmit(data);
    reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Edit License' : 'Add License'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="agency" className="block text-sm font-medium">
              Issuing Agency/State
            </label>
            <Input
              id="agency"
              {...register('agency', { required: 'Agency is required' })}
              placeholder="Enter issuing agency"
              disabled={isSubmitting}
            />
            {errors.agency && (
              <p className="text-sm text-red-500">{errors.agency.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="license_no" className="block text-sm font-medium">
              License Number
            </label>
            <Input
              id="license_no"
              {...register('license_no', { required: 'License number is required' })}
              placeholder="Enter license number"
              disabled={isSubmitting}
            />
            {errors.license_no && (
              <p className="text-sm text-red-500">{errors.license_no.message}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="issue_date" className="block text-sm font-medium">
                Issue Date
              </label>
              <Input
                id="issue_date"
                type="date"
                {...register('issue_date', { required: 'Issue date is required' })}
                disabled={isSubmitting}
              />
              {errors.issue_date && (
                <p className="text-sm text-red-500">{errors.issue_date.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="expiry_date" className="block text-sm font-medium">
                Expiry Date
              </label>
              <Input
                id="expiry_date"
                type="date"
                {...register('expiry_date', { required: 'Expiry date is required' })}
                disabled={isSubmitting}
              />
              {errors.expiry_date && (
                <p className="text-sm text-red-500">{errors.expiry_date.message}</p>
              )}
            </div>
          </div>
          
          <div className="flex justify-end gap-2 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? isEditing ? 'Updating...' : 'Adding...'
                : isEditing ? 'Update License' : 'Add License'
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
