
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Ban, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { createPaymentMethod, getPaymentMethods, deletePaymentMethod } from '@/services/paymentMethodService';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import type { PaymentMethod, PaymentMethodFormData } from '@/types/paymentMethod';

const ContractorPaymentMethodsSection: React.FC = () => {
  const { toast } = useToast();
  const { user } = useSupabaseAuth();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isAddingMethod, setIsAddingMethod] = useState(false);
  const [methodType, setMethodType] = useState<'credit_card' | 'bank_account'>('credit_card');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const methods = await getPaymentMethods(user.id);
        setPaymentMethods(methods);
      } catch (error) {
        console.error('Error fetching payment methods:', error);
        toast({
          title: "Error",
          description: "Failed to load payment methods",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentMethods();
  }, [user, toast]);

  const handleAddPaymentMethod = async (formData: PaymentMethodFormData) => {
    if (!user) return;
    
    try {
      setLoading(true);
      const newMethod = await createPaymentMethod(user.id, formData);
      setPaymentMethods([...paymentMethods, newMethod]);
      setIsAddingMethod(false);
      toast({
        title: "Payment Method Added",
        description: "Your payment method has been added successfully."
      });
    } catch (error) {
      console.error('Error adding payment method:', error);
      toast({
        title: "Error",
        description: "Failed to add payment method. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePaymentMethod = async (id: string) => {
    if (!user) return;
    
    try {
      setLoading(true);
      await deletePaymentMethod(user.id, id);
      setPaymentMethods(methods => methods.filter(m => m.id !== id));
      toast({
        title: "Payment Method Removed",
        description: "Your payment method has been removed successfully."
      });
    } catch (error) {
      console.error('Error removing payment method:', error);
      toast({
        title: "Error",
        description: "Failed to remove payment method. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Payment Methods</h2>
      
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline"
          onClick={() => {
            setMethodType('credit_card');
            setIsAddingMethod(true);
          }}
          disabled={loading}
        >
          <CreditCard className="mr-2 h-4 w-4" />
          Add Credit Card
        </Button>
        
        <Button 
          variant="outline"
          onClick={() => {
            setMethodType('bank_account');
            setIsAddingMethod(true);
          }}
          disabled={loading}
        >
          <Ban className="mr-2 h-4 w-4" />
          Add Bank Account
        </Button>
      </div>

      <div className="mt-4 space-y-2">
        {loading && <p className="text-sm text-gray-500">Loading payment methods...</p>}
        
        {!loading && paymentMethods.length === 0 && (
          <p className="text-sm text-gray-500">No payment methods added yet.</p>
        )}
        
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
              onClick={() => handleDeletePaymentMethod(method.id)}
              disabled={loading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <Dialog open={isAddingMethod} onOpenChange={setIsAddingMethod}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {methodType === 'credit_card' ? 'Add Credit Card' : 'Add Bank Account'}
            </DialogTitle>
          </DialogHeader>
          <PaymentMethodForm
            type={methodType}
            onSubmit={handleAddPaymentMethod}
            onCancel={() => setIsAddingMethod(false)}
            isSubmitting={loading}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface PaymentMethodFormProps {
  type: 'credit_card' | 'bank_account';
  onSubmit: (data: PaymentMethodFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

const PaymentMethodForm: React.FC<PaymentMethodFormProps> = ({ 
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

export default ContractorPaymentMethodsSection;
