
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CreditCard, Ban } from "lucide-react";
import { createPaymentMethod, getPaymentMethods, deletePaymentMethod } from '@/services/paymentMethodService';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import type { PaymentMethod, PaymentMethodFormData } from '@/types/paymentMethod';
import { PaymentMethodsList } from './payment-methods/PaymentMethodsList';
import { AddPaymentMethodDialog } from './payment-methods/AddPaymentMethodDialog';

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
        description: error instanceof Error ? error.message : "Failed to add payment method. Please try again.",
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
        description: error instanceof Error ? error.message : "Failed to remove payment method. Please try again.",
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

      <div className="mt-4">
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
