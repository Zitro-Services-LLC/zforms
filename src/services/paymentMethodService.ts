
import { supabase } from "@/integrations/supabase/client";
import type { PaymentMethod, PaymentMethodFormData } from "@/types/paymentMethod";
import { Json } from "@/integrations/supabase/types";

export const createPaymentMethod = async (contractorId: string, data: PaymentMethodFormData) => {
  // Get current contractor data
  const { data: contractorData, error: fetchError } = await supabase
    .from('contractors')
    .select('payment_methods')
    .eq('id', contractorId)
    .single();
  
  if (fetchError) throw fetchError;
  
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
  
  // Prepare payment methods array - properly handle the Json to PaymentMethod[] conversion
  const existingPaymentMethods: PaymentMethod[] = contractorData?.payment_methods 
    ? (contractorData.payment_methods as unknown as PaymentMethod[]) 
    : [];
  
  const updatedPaymentMethods = [...existingPaymentMethods, newPaymentMethod];
  
  // Update contractor record with new payment methods - convert back to Json for storage
  const { data: result, error } = await supabase
    .from('contractors')
    .update({
      payment_methods: updatedPaymentMethods as unknown as Json
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
  return data?.payment_methods 
    ? (data.payment_methods as unknown as PaymentMethod[]) 
    : [];
};

export const deletePaymentMethod = async (contractorId: string, paymentMethodId: string) => {
  // Get current contractor data
  const { data: contractorData, error: fetchError } = await supabase
    .from('contractors')
    .select('payment_methods')
    .eq('id', contractorId)
    .single();
  
  if (fetchError) throw fetchError;
  
  // Filter out the payment method to be deleted - properly handle the Json to PaymentMethod[] conversion
  const paymentMethods: PaymentMethod[] = contractorData?.payment_methods 
    ? (contractorData.payment_methods as unknown as PaymentMethod[]) 
    : [];
  
  const updatedPaymentMethods = paymentMethods.filter(
    method => method.id !== paymentMethodId
  );
  
  // Update contractor record with filtered payment methods - convert back to Json for storage
  const { error } = await supabase
    .from('contractors')
    .update({
      payment_methods: updatedPaymentMethods as unknown as Json
    })
    .eq('id', contractorId);
  
  if (error) throw error;
};
