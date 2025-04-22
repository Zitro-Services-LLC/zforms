
import React from 'react';
import { usePaymentMethods } from '@/hooks/usePaymentMethods';
import { PaymentMethodsList } from './payment-methods/PaymentMethodsList';
import { AddPaymentMethodDialog } from './payment-methods/AddPaymentMethodDialog';
import { AddPaymentMethodButtons } from './payment-methods/AddPaymentMethodButtons';

const ContractorPaymentMethodsSection: React.FC = () => {
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Payment Methods</h2>
        <p className="text-sm text-gray-500">You can add multiple cards and bank accounts</p>
      </div>
      
      <AddPaymentMethodButtons
        onAddCreditCard={() => {
          setMethodType('credit_card');
          setIsAddingMethod(true);
        }}
        onAddBankAccount={() => {
          setMethodType('bank_account');
          setIsAddingMethod(true);
        }}
        disabled={loading}
      />

      <div className="mt-6">
        <PaymentMethodsList
          paymentMethods={paymentMethods}
          onDelete={handleDeletePaymentMethod}
          loading={loading}
        />
      </div>

      <AddPaymentMethodDialog
        isOpen={isAddingMethod}
        onClose={() => setIsAddingMethod(false)}
        onSubmit={handleAddPaymentMethod}
        methodType={methodType}
        isSubmitting={loading}
      />
    </div>
  );
};

export default ContractorPaymentMethodsSection;
