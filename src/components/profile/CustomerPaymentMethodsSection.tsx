
import React, { useState } from 'react';
import { usePaymentMethods } from '@/hooks/usePaymentMethods';
import { PaymentMethodsList } from './payment-methods/PaymentMethodsList';
import { AddPaymentMethodButtons } from './payment-methods/AddPaymentMethodButtons';
import { AddPaymentMethodDialog } from './payment-methods/AddPaymentMethodDialog';
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const CustomerPaymentMethodsSection: React.FC = () => {
  const {
    paymentMethods,
    isAddingMethod,
    setIsAddingMethod,
    methodType,
    setMethodType,
    loading,
    handleAddPaymentMethod,
    handleDeletePaymentMethod
  } = usePaymentMethods();

  const openAddCreditCardDialog = () => {
    setMethodType('credit_card');
    setIsAddingMethod(true);
  };

  const openAddBankAccountDialog = () => {
    setMethodType('bank_account');
    setIsAddingMethod(true);
  };

  const closeAddPaymentMethodDialog = () => {
    setIsAddingMethod(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">My Payment Methods</h2>
        <p className="text-gray-500 text-sm mb-4">
          Add and manage your payment methods securely
        </p>
        
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>
            Payment methods added here can be used to pay contractors for their services.
          </AlertDescription>
        </Alert>
      </div>

      <AddPaymentMethodButtons 
        onAddCreditCard={openAddCreditCardDialog}
        onAddBankAccount={openAddBankAccountDialog}
        disabled={loading || isAddingMethod}
      />
      
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Saved Payment Methods</h3>
        <PaymentMethodsList 
          paymentMethods={paymentMethods}
          onDelete={handleDeletePaymentMethod}
          loading={loading}
        />
      </div>
      
      <AddPaymentMethodDialog 
        isOpen={isAddingMethod}
        onClose={closeAddPaymentMethodDialog}
        onSubmit={handleAddPaymentMethod}
        methodType={methodType}
        isSubmitting={loading}
      />
    </div>
  );
};

export default CustomerPaymentMethodsSection;
