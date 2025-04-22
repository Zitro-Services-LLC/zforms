
import { supabase } from "@/integrations/supabase/client";
import type { PaymentMethod, PaymentMethodFormData } from "@/types/paymentMethod";
import type { Database } from "@/integrations/supabase/types";

type ContractorRow = Database['public']['Tables']['contractors']['Row'];

async function findContractorForUser(userId: string): Promise<ContractorRow> {
  const { data, error } = await supabase
    .from('contractors')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw new Error('Error finding contractor profile: ' + error.message);
  if (!data) throw new Error('Please create a contractor profile before adding payment methods');
  
  return data;
}

export const createPaymentMethod = async (userId: string, data: PaymentMethodFormData) => {
  const contractor = await findContractorForUser(userId);
  
  // Create a payment method object
  const newPaymentMethod: PaymentMethod = {
    id: crypto.randomUUID(),
    type: data.type,
    ...(data.type === 'credit_card' ? {
      cardLast4: data.cardNumber?.slice(-4),
      cardExpMonth: data.cardExpMonth,
      cardExpYear: data.cardExpYear,
    } : {
      bankName: data.bankName,
      accountLast4: data.accountNumber?.slice(-4),
    }),
    details: {}
  };
  
  // Prepare payment methods array
  const existingPaymentMethods: PaymentMethod[] = contractor.payment_methods 
    ? (contractor.payment_methods as unknown as PaymentMethod[]) 
    : [];
  
  const updatedPaymentMethods = [...existingPaymentMethods, newPaymentMethod];
  
  // Update contractor record with new payment methods
  const { error } = await supabase
    .from('contractors')
    .update({
      payment_methods: updatedPaymentMethods as any
    })
    .eq('user_id', userId);
  
  if (error) throw new Error('Failed to create payment method: ' + error.message);
  return newPaymentMethod;
};

export const getPaymentMethods = async (userId: string): Promise<PaymentMethod[]> => {
  const contractor = await findContractorForUser(userId);
  return contractor.payment_methods 
    ? (contractor.payment_methods as unknown as PaymentMethod[]) 
    : [];
};

export const deletePaymentMethod = async (userId: string, paymentMethodId: string) => {
  const contractor = await findContractorForUser(userId);
  
  // Filter out the payment method to be deleted
  const paymentMethods: PaymentMethod[] = contractor.payment_methods 
    ? (contractor.payment_methods as unknown as PaymentMethod[]) 
    : [];
  
  const updatedPaymentMethods = paymentMethods.filter(
    method => method.id !== paymentMethodId
  );
  
  // Update contractor record with filtered payment methods
  const { error } = await supabase
    .from('contractors')
    .update({
      payment_methods: updatedPaymentMethods as any
    })
    .eq('user_id', userId);
  
  if (error) throw new Error('Failed to delete payment method: ' + error.message);
};

