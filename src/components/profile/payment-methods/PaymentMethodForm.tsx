
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { PaymentMethodFormData } from '@/types/paymentMethod';

interface PaymentMethodFormProps {
  type: 'credit_card' | 'bank_account';
  onSubmit: (data: PaymentMethodFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export const PaymentMethodForm: React.FC<PaymentMethodFormProps> = ({ 
  type, 
  onSubmit, 
  onCancel,
  isSubmitting 
}) => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const data: PaymentMethodFormData = {
      type,
      ...(type === 'credit_card' ? {
        cardNumber: formData.get('cardNumber') as string,
        cardExpMonth: parseInt(formData.get('expMonth') as string),
        cardExpYear: parseInt(formData.get('expYear') as string),
      } : {
        bankName: formData.get('bankName') as string,
        accountNumber: formData.get('accountNumber') as string,
        routingNumber: formData.get('routingNumber') as string,
      })
    };

    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {type === 'credit_card' ? (
        <>
          <div className="space-y-2">
            <label htmlFor="cardNumber">Card Number</label>
            <Input
              id="cardNumber"
              name="cardNumber"
              placeholder="Card number"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="expMonth">Expiry Month</label>
              <Input
                id="expMonth"
                name="expMonth"
                type="number"
                min="1"
                max="12"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="expYear">Expiry Year</label>
              <Input
                id="expYear"
                name="expYear"
                type="number"
                min={new Date().getFullYear()}
                required
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="space-y-2">
            <label htmlFor="bankName">Bank Name</label>
            <Input
              id="bankName"
              name="bankName"
              placeholder="Bank name"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="routingNumber">Routing Number</label>
            <Input
              id="routingNumber"
              name="routingNumber"
              placeholder="Routing number"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="accountNumber">Account Number</label>
            <Input
              id="accountNumber"
              name="accountNumber"
              placeholder="Account number"
              required
            />
          </div>
        </>
      )}
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add Payment Method'}
        </Button>
      </div>
    </form>
  );
};
