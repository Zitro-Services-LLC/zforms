
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { CreditCard, Bank, X } from "lucide-react";

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank';
  displayName: string;
}

const CustomerPaymentMethodsSection: React.FC = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: '1', type: 'card', displayName: 'Visa **** **** **** 1234 | Expires 12/2025' },
    { id: '2', type: 'bank', displayName: 'Wells Fargo - Checking **** 5678' },
  ]);

  const removePaymentMethod = (id: string) => {
    setPaymentMethods(paymentMethods.filter(method => method.id !== id));
  };

  // These functions would typically open modals or forms to add payment methods
  const handleAddCreditCard = () => {
    console.log("Add credit card clicked");
    // Modal would open here
  };

  const handleAddBankAccount = () => {
    console.log("Add bank account clicked");
    // Modal would open here
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">My Payment Methods (for Contractors)</h2>
      
      <div className="flex flex-wrap gap-2">
        <Button 
          type="button" 
          variant="outline"
          className="flex items-center gap-2"
          onClick={handleAddCreditCard}
        >
          <CreditCard className="h-4 w-4" />
          <span>Add Credit Card +</span>
        </Button>
        
        <Button 
          type="button" 
          variant="outline"
          className="flex items-center gap-2"
          onClick={handleAddBankAccount}
        >
          <Bank className="h-4 w-4" />
          <span>Add Bank Account +</span>
        </Button>
      </div>
      
      <div className="mt-4 space-y-2">
        {paymentMethods.length > 0 ? (
          paymentMethods.map(method => (
            <div 
              key={method.id} 
              className="flex justify-between items-center p-3 border rounded-md bg-gray-50"
            >
              <div className="flex items-center gap-2">
                {method.type === 'card' ? (
                  <CreditCard className="h-4 w-4 text-gray-600" />
                ) : (
                  <Bank className="h-4 w-4 text-gray-600" />
                )}
                <span>{method.displayName}</span>
              </div>
              <button
                onClick={() => removePaymentMethod(method.id)}
                className="text-gray-500 hover:text-red-500"
                aria-label="Remove payment method"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))
        ) : (
          <div className="text-center p-4 text-gray-500 border border-dashed rounded-md">
            No payment methods saved yet
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerPaymentMethodsSection;
