
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { PaymentMethod, PaymentMethodFormData } from '@/types/paymentMethod';

export function usePaymentMethods() {
  const { toast } = useToast();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isAddingMethod, setIsAddingMethod] = useState(false);
  const [methodType, setMethodType] = useState<'credit_card' | 'bank_account'>('credit_card');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        setLoading(true);
        
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          setLoading(false);
          return;
        }
        
        // Fetch payment methods from customers table
        // Note: In a real app, these would be in a dedicated payment_methods table
        // For simplicity, we're just using mock data here
        
        // Simulating fetching payment methods
        setTimeout(() => {
          const mockPaymentMethods: PaymentMethod[] = [
            {
              id: '1',
              type: 'credit_card',
              cardLast4: '4242',
              cardExpMonth: 12,
              cardExpYear: 2025,
              cardBrand: 'visa',
              isPrimary: true
            },
            {
              id: '2',
              type: 'bank_account',
              bankName: 'Bank of America',
              accountLast4: '6789',
              isPrimary: false
            }
          ];
          
          setPaymentMethods(mockPaymentMethods);
          setLoading(false);
        }, 1000);
        
      } catch (error) {
        console.error('Error fetching payment methods:', error);
        toast({
          title: "Error",
          description: "Failed to load payment methods",
          variant: "destructive"
        });
        setLoading(false);
      }
    };

    fetchPaymentMethods();
  }, [toast]);

  const handleAddPaymentMethod = async (formData: PaymentMethodFormData) => {
    try {
      setLoading(true);
      
      // In a real app, this would call an API to store the payment method
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create new payment method
      const newMethod: PaymentMethod = {
        id: `new-${Date.now()}`,
        type: formData.type,
        ...(formData.type === 'credit_card' ? {
          cardLast4: formData.cardNumber?.slice(-4),
          cardExpMonth: formData.cardExpMonth,
          cardExpYear: formData.cardExpYear,
          cardBrand: 'visa',
        } : {
          bankName: formData.bankName,
          accountLast4: formData.accountNumber?.slice(-4),
        }),
        isPrimary: false
      };
      
      // Update state
      setPaymentMethods([...paymentMethods, newMethod]);
      setIsAddingMethod(false);
      
      toast({
        title: "Payment Method Added",
        description: "Your payment method has been added successfully"
      });
      
    } catch (error) {
      console.error('Error adding payment method:', error);
      toast({
        title: "Error",
        description: "Failed to add payment method",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePaymentMethod = async (id: string) => {
    try {
      setLoading(true);
      
      // In a real app, this would call an API to delete the payment method
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update state
      setPaymentMethods(methods => methods.filter(m => m.id !== id));
      
      toast({
        title: "Payment Method Removed",
        description: "Your payment method has been removed successfully"
      });
      
    } catch (error) {
      console.error('Error removing payment method:', error);
      toast({
        title: "Error",
        description: "Failed to remove payment method",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    paymentMethods,
    isAddingMethod,
    setIsAddingMethod,
    methodType,
    setMethodType,
    loading,
    handleAddPaymentMethod,
    handleDeletePaymentMethod
  };
}
