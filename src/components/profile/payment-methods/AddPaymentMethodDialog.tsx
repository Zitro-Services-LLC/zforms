
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PaymentMethodForm } from "./PaymentMethodForm";
import type { PaymentMethodFormData } from '@/types/paymentMethod';

interface AddPaymentMethodDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: PaymentMethodFormData) => Promise<void>;
  methodType: 'credit_card' | 'bank_account';
  isSubmitting: boolean;
}

export const AddPaymentMethodDialog: React.FC<AddPaymentMethodDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  methodType,
  isSubmitting
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {methodType === 'credit_card' ? 'Add Credit Card' : 'Add Bank Account'}
          </DialogTitle>
        </DialogHeader>
        <PaymentMethodForm
          type={methodType}
          onSubmit={onSubmit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};
