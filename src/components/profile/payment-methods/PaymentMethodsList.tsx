
import React from 'react';
import { Button } from "@/components/ui/button";
import { CreditCard, WalletCards, Trash2 } from "lucide-react";
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
    return (
      <div className="text-center py-8 bg-gray-50 border border-dashed rounded-lg">
        <p className="text-sm text-gray-500">No payment methods added yet</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {paymentMethods.map(method => (
        <div 
          key={method.id}
          className="flex justify-between items-center p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            {method.type === 'credit_card' ? (
              <CreditCard className="h-5 w-5 text-gray-600" />
            ) : (
              <WalletCards className="h-5 w-5 text-[#8E9196]" />
            )}
            <div className="flex flex-col">
              <span className="font-medium">
                {method.type === 'credit_card' 
                  ? `•••• ${method.cardLast4}`
                  : method.bankName
                }
              </span>
              <span className="text-sm text-gray-500">
                {method.type === 'credit_card'
                  ? `Expires ${method.cardExpMonth}/${method.cardExpYear}`
                  : `Account ending in ${method.accountLast4}`
                }
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(method.id)}
            disabled={loading}
            className="text-gray-500 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete payment method</span>
          </Button>
        </div>
      ))}
    </div>
  );
};
