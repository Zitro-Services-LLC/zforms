
import { supabase } from '@/integrations/supabase/client';
import { InvoiceWithDetails } from './types';

/**
 * Get all invoices for a user with related customer, items, and payments
 */
export async function getInvoices(userId: string) {
  const { data, error } = await supabase
    .from('invoices')
    .select(`
      *,
      customer:customers(id, first_name, last_name, email, phone, billing_address),
      items:invoice_items(*),
      payments:invoice_payments(*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as InvoiceWithDetails[];
}

/**
 * Get a single invoice by ID with related customer, items, and payments
 */
export async function getInvoiceById(id: string) {
  const { data, error } = await supabase
    .from('invoices')
    .select(`
      *,
      customer:customers(id, first_name, last_name, email, phone, billing_address),
      items:invoice_items(*),
      payments:invoice_payments(*)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as InvoiceWithDetails;
}

/**
 * Get all invoice items for an invoice
 */
export async function getInvoiceItems(invoiceId: string) {
  const { data, error } = await supabase
    .from('invoice_items')
    .select('*')
    .eq('invoice_id', invoiceId)
    .order('id', { ascending: true });

  if (error) throw error;
  return data;
}

/**
 * Get all invoice payments for an invoice
 */
export async function getInvoicePayments(invoiceId: string) {
  const { data, error } = await supabase
    .from('invoice_payments')
    .select('*')
    .eq('invoice_id', invoiceId)
    .order('payment_date', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Get payment methods for a customer
 */
export async function getCustomerPaymentMethods(customerId: string) {
  // In a real application, this would fetch from a payment methods table
  // For now, we'll return mock data
  return [];
}
