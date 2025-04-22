
import { supabase } from "@/integrations/supabase/client";
import type { PaymentMethod, PaymentMethodFormData } from "@/types/paymentMethod";

export const createPaymentMethod = async (contractorId: string, data: PaymentMethodFormData) => {
  // Since we don't have a payment_methods table, we'll store a representation in the contractor's record
  // This is a temporary solution until a proper payment_methods table is created
  
  // Get current contractor data
  const { data: contractorData, error: fetchError } = await supabase
    .from('contractors')
    .select('*')
    .eq('id', contractorId)
    .single();
  
  if (fetchError) throw fetchError;
  
  // Create a payment method object
  const newPaymentMethod = {
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
  const existingPaymentMethods = contractorData.payment_methods || [];
  const updatedPaymentMethods = [...existingPaymentMethods, newPaymentMethod];
  
  // Update contractor record with new payment methods
  const { data: result, error } = await supabase
    .from('contractors')
    .update({
      payment_methods: updatedPaymentMethods
    })
    .eq('id', contractorId)
    .select()
    .single();
  
  if (error) throw error;
  return newPaymentMethod;
};

export const getPaymentMethods = async (contractorId: string) => {
  const { data, error } = await supabase
    .from('contractors')
    .select('payment_methods')
    .eq('id', contractorId)
    .single();
  
  if (error) throw error;
  return data.payment_methods || [];
};

export const deletePaymentMethod = async (contractorId: string, paymentMethodId: string) => {
  // Get current contractor data
  const { data: contractorData, error: fetchError } = await supabase
    .from('contractors')
    .select('payment_methods')
    .eq('id', contractorId)
    .single();
  
  if (fetchError) throw fetchError;
  
  // Filter out the payment method to be deleted
  const paymentMethods = contractorData.payment_methods || [];
  const updatedPaymentMethods = paymentMethods.filter(
    (method: PaymentMethod) => method.id !== paymentMethodId
  );
  
  // Update contractor record with filtered payment methods
  const { error } = await supabase
    .from('contractors')
    .update({
      payment_methods: updatedPaymentMethods
    })
    .eq('id', contractorId);
  
  if (error) throw error;
};
