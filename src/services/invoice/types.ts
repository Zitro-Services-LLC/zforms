
import { Database } from '@/integrations/supabase/types';
import { PartyInfo, Status } from '@/types';

export type InvoiceRow = Database['public']['Tables']['invoices']['Row'];
export type InvoiceInsert = Database['public']['Tables']['invoices']['Insert'];
export type InvoiceUpdate = Database['public']['Tables']['invoices']['Update'];

export type InvoiceItemRow = Database['public']['Tables']['invoice_items']['Row'];
export type InvoiceItemInsert = Database['public']['Tables']['invoice_items']['Insert'];
export type InvoiceItemUpdate = Database['public']['Tables']['invoice_items']['Update'];

export type InvoicePaymentRow = Database['public']['Tables']['invoice_payments']['Row'];
export type InvoicePaymentInsert = Database['public']['Tables']['invoice_payments']['Insert'];
export type InvoicePaymentUpdate = Database['public']['Tables']['invoice_payments']['Update'];

// Joined invoice data from database
export interface InvoiceWithDetails {
  id: string;
  user_id: string;
  invoice_number: string;
  customer_id: string;
  contract_id?: string | null;
  issue_date: string;
  due_date: string;
  subtotal: number;
  tax_rate?: number | null;
  tax_amount?: number | null;
  total: number;
  amount_paid?: number | null;
  balance_due?: number | null;
  created_at: string;
  updated_at: string;
  notes?: string | null;
  status: string;
  customer: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string | null;
    billing_address?: string | null;
  } | null;
  items: InvoiceItemRow[] | null;
  payments: InvoicePaymentRow[] | null;
}

// Frontend-friendly version of invoice data
export interface InvoiceData {
  id: string;
  jobId: string;
  estimateId: string;
  contractId: string;
  status: Status;
  date: string;
  dueDate: string;
  contractor: PartyInfo;
  customer: PartyInfo;
  lineItems: {
    id: number;
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }[];
  subtotal: number;
  tax: number;
  total: number;
  paymentHistory: {
    id: number;
    date: string;
    amount: number;
    method: string;
    note: string;
  }[];
  balanceDue: number;
  paymentInstructions: {
    bankTransfer: {
      accountName: string;
      accountNumber: string;
      routingNumber: string;
      bankName: string;
    };
    creditCard: string;
  };
}

export interface PaymentMethodWithDetails {
  id: string;
  type: 'credit_card' | 'bank_account';
  cardLast4?: string;
  cardExpMonth?: number;
  cardExpYear?: number;
  cardBrand?: string;
  bankName?: string;
  accountLast4?: string;
  isPrimary?: boolean;
}

export interface InvoiceFormData {
  customer_id: string;
  contract_id?: string | null;
  issue_date: string;
  due_date: string;
  notes?: string | null;
  items: {
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }[];
  tax_rate?: number | null;
}

export interface PaymentFormData {
  invoice_id: string;
  amount: number;
  payment_method: string;
  payment_date: string;
  notes?: string | null;
  transaction_id?: string | null;
}
