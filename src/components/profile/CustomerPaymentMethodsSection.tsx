
import React, { useState } from 'react';
import { usePaymentMethods } from '@/hooks/usePaymentMethods';
import { PaymentMethodsList } from './payment-methods/PaymentMethodsList';
import { AddPaymentMethodButtons } from './payment-methods/AddPaymentMethodButtons';
import { AddPaymentMethodDialog } from './payment-methods/AddPaymentMethodDialog';
import { AlertCircle, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CustomerPaymentMethodsSectionProps {
  customerId?: string;
  isContractorView?: boolean;
}

const CustomerPaymentMethodsSection: React.FC<CustomerPaymentMethodsSectionProps> = ({ 
  customerId,
  isContractorView = false 
}) => {
  const {
    paymentMethods,
    isAddingMethod,
    setIsAddingMethod,
    methodType,
    setMethodType,
    loading,
    handleAddPaymentMethod,
    handleDeletePaymentMethod
  } = usePaymentMethods(customerId);

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
        <h2 className="text-xl font-semibold mb-2">
          {isContractorView ? "Customer Payment Methods" : "My Payment Methods"}
        </h2>
        <p className="text-gray-500 text-sm mb-4">
          {isContractorView 
            ? "Manage payment methods for this customer" 
            : "Add and manage your payment methods securely"}
        </p>
        
        {isContractorView ? (
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 mr-2 text-blue-600" />
            <AlertDescription>
              Payment methods added here can be used to charge invoices for this customer.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription>
              Payment methods added here can be used to pay contractors for their services.
            </AlertDescription>
          </Alert>
        )}
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
