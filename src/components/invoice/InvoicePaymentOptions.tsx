
import React, { useState } from 'react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CreditCard, WalletCards, Building, Check } from "lucide-react";
import type { PaymentMethod } from '@/types/paymentMethod';

interface BankTransfer {
  accountName: string;
  accountNumber: string;
  routingNumber: string;
  bankName: string;
}

interface InvoicePaymentOptionsProps {
  balanceDue: number;
  bankTransfer: BankTransfer;
  onPaymentSubmit: (amount: number, method: string, date: string) => void;
  customerPaymentMethods?: PaymentMethod[];
}

const InvoicePaymentOptions: React.FC<InvoicePaymentOptionsProps> = ({
  balanceDue,
  bankTransfer,
  onPaymentSubmit,
  customerPaymentMethods = []
}) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  
  const creditCards = customerPaymentMethods.filter(method => method.type === 'credit_card');
  const bankAccounts = customerPaymentMethods.filter(method => method.type === 'bank_account');
  
  const handleSubmit = () => {
    if (!selectedPaymentMethod) return;
    const currentDate = new Date().toISOString().split('T')[0];
    onPaymentSubmit(balanceDue, selectedPaymentMethod, currentDate);
  };
  
  return (
    <div className="px-6 pt-4 pb-6 border-t border-gray-200 bg-gray-50">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Options</h2>
      
      <RadioGroup className="space-y-4" value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
        {/* Saved Credit Cards */}
        {creditCards.length > 0 && (
          <div>
            <h3 className="font-medium mb-2">Saved Credit Cards</h3>
            {creditCards.map(card => (
              <div key={card.id} className="flex items-start space-x-3 mb-2 p-3 border rounded-md bg-white">
                <RadioGroupItem value={`card-${card.id}`} id={`card-${card.id}`} className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor={`card-${card.id}`} className="flex items-center">
                    <CreditCard className="h-4 w-4 mr-2 text-gray-600" />
                    <span>
                      {card.cardBrand} •••• {card.cardLast4} (Expires {card.cardExpMonth}/{card.cardExpYear})
                      {card.isPrimary && <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">Primary</span>}
                    </span>
                  </Label>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Saved Bank Accounts */}
        {bankAccounts.length > 0 && (
          <div>
            <h3 className="font-medium mb-2">Saved Bank Accounts</h3>
            {bankAccounts.map(account => (
              <div key={account.id} className="flex items-start space-x-3 mb-2 p-3 border rounded-md bg-white">
                <RadioGroupItem value={`bank-${account.id}`} id={`bank-${account.id}`} className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor={`bank-${account.id}`} className="flex items-center">
                    <WalletCards className="h-4 w-4 mr-2 text-gray-600" />
                    <span>
                      {account.bankName} (Account ending in {account.accountLast4})
                      {account.isPrimary && <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">Primary</span>}
                    </span>
                  </Label>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* New Credit Card Option */}
        <div className="flex items-start space-x-3 p-3 border rounded-md bg-white">
          <RadioGroupItem value="new-credit-card" id="new-credit-card" className="mt-1" />
          <div className="flex-1">
            <Label htmlFor="new-credit-card" className="flex items-center mb-1">
              <CreditCard className="h-4 w-4 mr-2 text-gray-600" />
              <span>Pay with a new Credit Card</span>
            </Label>
            <div className="text-sm text-gray-500 ml-6">
              Fast and secure payment using your credit or debit card.
            </div>
          </div>
        </div>
        
        {/* Bank Transfer Option */}
        <div className="flex items-start space-x-3 p-3 border rounded-md bg-white">
          <RadioGroupItem value="bank-transfer" id="bank-transfer" className="mt-1" />
          <div className="flex-1">
            <Label htmlFor="bank-transfer" className="flex items-center mb-1">
              <Building className="h-4 w-4 mr-2 text-gray-600" />
              <span>Bank Transfer</span>
            </Label>
            <div className="text-sm text-gray-500 ml-6">
              <p>Account Name: {bankTransfer.accountName}</p>
              <p>Account #: {bankTransfer.accountNumber}</p>
              <p>Routing #: {bankTransfer.routingNumber}</p>
              <p>Bank: {bankTransfer.bankName}</p>
            </div>
          </div>
        </div>
      </RadioGroup>
      
      <div className="mt-6">
        <Button 
          onClick={handleSubmit} 
          disabled={!selectedPaymentMethod}
          className="w-full md:w-auto"
        >
          <Check className="h-4 w-4 mr-2" />
          Pay ${balanceDue.toLocaleString()}
        </Button>
      </div>
    </div>
  );
};

export default InvoicePaymentOptions;
