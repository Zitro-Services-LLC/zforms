
import React from 'react';
import { Button } from "@/components/ui/button";
import { CreditCard, Ban, X } from "lucide-react";
import type { PaymentMethod } from '@/types/paymentMethod';

interface PaymentMethodsListProps {
  paymentMethods: PaymentMethod[];
  onDelete: (id: string) => Promise<void>;
  loading: boolean;
}

export const PaymentMethodsList: React.FC<PaymentMethodsListProps> = ({
  paymentMethods,
  onDelete,
  loading
}) => {
  if (loading) {
    return <p className="text-sm text-gray-500">Loading payment methods...</p>;
  }

  if (paymentMethods.length === 0) {
    return <p className="text-sm text-gray-500">No payment methods added yet.</p>;
  }

  return (
    <div className="space-y-2">
      {paymentMethods.map(method => (
        <div 
          key={method.id}
          className="flex justify-between items-center p-3 border rounded-md bg-gray-50"
        >
          <div className="flex items-center gap-2">
            {method.type === 'credit_card' ? (
              <>
                <CreditCard className="h-4 w-4" />
                <span>
                  Card ending in {method.cardLast4} (Expires {method.cardExpMonth}/{method.cardExpYear})
                </span>
              </>
            ) : (
              <>
                <Ban className="h-4 w-4" />
                <span>
                  {method.bankName} account ending in {method.accountLast4}
                </span>
              </>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(method.id)}
            disabled={loading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};
