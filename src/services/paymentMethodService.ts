
import { supabase } from "@/integrations/supabase/client";
import type { PaymentMethod, PaymentMethodFormData } from "@/types/paymentMethod";

export const createPaymentMethod = async (contractorId: string, data: PaymentMethodFormData) => {
  const paymentData = {
    contractor_id: contractorId,
    method_type: data.type,
    ...(data.type === 'credit_card' ? {
      card_last4: data.cardNumber?.slice(-4),
      card_exp_month: data.cardExpMonth,
      card_exp_year: data.cardExpYear,
    } : {
      bank_name: data.bankName,
      account_last4: data.accountNumber?.slice(-4),
    })
  };

  const { data: result, error } = await supabase
    .from('payment_methods')
    .insert(paymentData)
    .select()
    .single();

  if (error) throw error;
  return result;
};

export const getPaymentMethods = async (contractorId: string) => {
  const { data, error } = await supabase
    .from('payment_methods')
    .select('*')
    .eq('contractor_id', contractorId);

  if (error) throw error;
  return data;
};

export const deletePaymentMethod = async (id: string) => {
  const { error } = await supabase
    .from('payment_methods')
    .delete()
    .eq('id', id);

  if (error) throw error;
};
