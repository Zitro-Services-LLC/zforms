
import { supabase } from '@/integrations/supabase/client';
import { InvoiceFormData, InvoiceInsert, InvoiceItemInsert, InvoiceUpdate, PaymentFormData } from './types';

/**
 * Create a new invoice with line items
 */
export async function createInvoice(data: InvoiceFormData & { user_id: string }) {
  const { user_id, customer_id, contract_id, issue_date, due_date, notes, items, tax_rate } = data;
  
  // Calculate invoice totals
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const tax_amount = tax_rate ? subtotal * (tax_rate / 100) : 0;
  const total = subtotal + tax_amount;
  
  // Create invoice record
  const invoiceData: InvoiceInsert = {
    user_id,
    customer_id,
    contract_id,
    issue_date,
    due_date,
    subtotal,
    tax_rate,
    tax_amount,
    total,
    notes,
    status: 'draft',
    amount_paid: 0,
    balance_due: total
  };
  
  const { data: invoice, error } = await supabase
    .from('invoices')
    .insert(invoiceData)
    .select()
    .single();
    
  if (error) throw error;
  
  // Create invoice items
  const invoiceItems: InvoiceItemInsert[] = items.map(item => ({
    invoice_id: invoice.id,
    description: item.description,
    quantity: item.quantity,
    rate: item.rate,
    amount: item.amount
  }));
  
  const { error: itemsError } = await supabase
    .from('invoice_items')
    .insert(invoiceItems);
    
  if (itemsError) throw itemsError;
  
  return invoice;
}

/**
 * Update an existing invoice
 */
export async function updateInvoice(id: string, data: Partial<InvoiceFormData>) {
  const { items, ...invoiceData } = data;
  
  // If items are provided, recalculate subtotal and total
  if (items) {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const tax_rate = data.tax_rate ?? 0;
    const tax_amount = tax_rate ? subtotal * (tax_rate / 100) : 0;
    const total = subtotal + tax_amount;
    
    Object.assign(invoiceData, { 
      subtotal, 
      tax_amount, 
      total,
      balance_due: total // This assumes no payments yet, otherwise should subtract from total
    });
  }
  
  // Update invoice record
  const { data: updatedInvoice, error } = await supabase
    .from('invoices')
    .update(invoiceData as InvoiceUpdate)
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  
  // If items are provided, replace all invoice items
  if (items) {
    // First delete existing items
    const { error: deleteError } = await supabase
      .from('invoice_items')
      .delete()
      .eq('invoice_id', id);
      
    if (deleteError) throw deleteError;
    
    // Then insert new items
    const invoiceItems: InvoiceItemInsert[] = items.map(item => ({
      invoice_id: id,
      description: item.description,
      quantity: item.quantity,
      rate: item.rate,
      amount: item.amount
    }));
    
    const { error: itemsError } = await supabase
      .from('invoice_items')
      .insert(invoiceItems);
      
    if (itemsError) throw itemsError;
  }
  
  return updatedInvoice;
}

/**
 * Submit an invoice to customer
 */
export async function submitInvoice(id: string) {
  const { data, error } = await supabase
    .from('invoices')
    .update({ status: 'submitted' })
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

/**
 * Record a payment on an invoice
 */
export async function recordPayment(paymentData: PaymentFormData) {
  const { invoice_id, amount, payment_method, payment_date, notes, transaction_id } = paymentData;
  
  // Insert the payment record
  const { data: payment, error } = await supabase
    .from('invoice_payments')
    .insert({
      invoice_id,
      amount,
      payment_method,
      payment_date,
      notes,
      transaction_id
    })
    .select()
    .single();
    
  if (error) throw error;
  
  // Get the current invoice to update amount_paid and balance_due
  const { data: invoice, error: invoiceError } = await supabase
    .from('invoices')
    .select('total, amount_paid, balance_due')
    .eq('id', invoice_id)
    .single();
    
  if (invoiceError) throw invoiceError;
  
  const currentPaid = invoice.amount_paid || 0;
  const newPaid = currentPaid + amount;
  const newBalance = invoice.total - newPaid;
  const newStatus = newBalance <= 0 ? 'paid' : 'submitted';
  
  // Update the invoice
  const { data: updatedInvoice, error: updateError } = await supabase
    .from('invoices')
    .update({ 
      amount_paid: newPaid,
      balance_due: newBalance,
      status: newStatus
    })
    .eq('id', invoice_id)
    .select()
    .single();
    
  if (updateError) throw updateError;
  
  return {
    payment,
    invoice: updatedInvoice
  };
}

/**
 * Mark an invoice as paid
 */
export async function markInvoicePaid(id: string) {
  const { data: invoice, error: invoiceError } = await supabase
    .from('invoices')
    .select('total, amount_paid')
    .eq('id', id)
    .single();
    
  if (invoiceError) throw invoiceError;
  
  const { data, error } = await supabase
    .from('invoices')
    .update({ 
      status: 'paid',
      amount_paid: invoice.total,
      balance_due: 0
    })
    .eq('id', id)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}
