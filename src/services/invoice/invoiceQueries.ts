import { supabase } from '@/integrations/supabase/client';
import { Invoice } from './types';

/**
 * Get all invoices for a user with related customer, items, and payments
 */
export async function getInvoices(userId: string | undefined): Promise<Invoice[]> {
  if (!userId) {
    console.log('No user ID provided to getInvoices');
    return [];
  }
  
  console.log('Fetching invoices for user:', userId);
  
  const { data, error } = await supabase
    .from('invoices')
    .select(`
      *,
      customer:customers(
        first_name,
        last_name,
        email,
        phone,
        billing_address
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching invoices:', error);
    throw error;
  }

  console.log('Fetched invoices:', data);
  
  return data;
}

/**
 * Get a single invoice by ID with related customer, items, and payments
 */
export async function getInvoiceById(invoiceId: string, userId: string | undefined): Promise<Invoice | null> {
  if (!invoiceId || !userId) {
    console.log('No invoice ID or user ID provided to getInvoiceById');
    return null;
  }
  
  console.log(`Fetching invoice ID ${invoiceId} for user ${userId}`);
  
  const { data, error } = await supabase
    .from('invoices')
    .select(`
      *,
      customer:customers(
        id,
        first_name,
        last_name,
        email,
        phone,
        billing_address,
        property_address
      )
    `)
    .eq('id', invoiceId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('Error fetching invoice details:', error);
    throw error;
  }

  if (!data) {
    console.log(`No invoice found with ID ${invoiceId}`);
    return null;
  }

  console.log('Fetched invoice details:', data);
  
  return data;
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
