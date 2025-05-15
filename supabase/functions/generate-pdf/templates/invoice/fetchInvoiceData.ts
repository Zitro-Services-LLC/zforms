
import { CustomerInfo, CompanyInfo } from "../../helpers/types.ts";

export interface InvoiceData {
  invoice_number: string;
  issue_date: string;
  due_date: string;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  notes?: string;
  customer: CustomerInfo;
  company: CompanyInfo;
  items: Array<{
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
  payments?: Array<{
    amount: number;
  }>;
}

/**
 * Fetches all invoice data needed for PDF generation
 */
export async function fetchInvoiceData(supabase: any, invoiceId: string, userId: string): Promise<InvoiceData> {
  console.log(`Fetching data for invoice ${invoiceId}`);
  
  // Fetch the invoice data with all related information
  const { data: invoice, error: invoiceError } = await supabase
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
      ),
      items:invoice_items(*),
      payments:invoice_payments(*)
    `)
    .eq('id', invoiceId)
    .eq('user_id', userId)
    .maybeSingle();

  if (invoiceError) throw new Error(`Error fetching invoice: ${invoiceError.message}`);
  if (!invoice) throw new Error(`Invoice not found: ${invoiceId}`);

  // Fetch contractor data
  const { data: contractor, error: contractorError } = await supabase
    .from('contractors')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (contractorError) throw new Error(`Error fetching contractor: ${contractorError.message}`);

  // Calculate amount paid
  let amountPaid = 0;
  if (invoice.payments && invoice.payments.length > 0) {
    amountPaid = invoice.payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  }

  // Prepare company info
  const companyInfo: CompanyInfo = {
    name: contractor?.company_name || "Company Name",
    address: contractor?.company_address,
    phone: contractor?.company_phone,
    email: contractor?.company_email,
    logo_url: contractor?.logo_url
  };

  // Prepare customer info
  const customerInfo: CustomerInfo = {
    first_name: invoice.customer?.first_name || "",
    last_name: invoice.customer?.last_name || "",
    email: invoice.customer?.email,
    phone: invoice.customer?.phone,
    billing_address: invoice.customer?.billing_address,
    property_address: invoice.customer?.property_address
  };

  return {
    invoice_number: invoice.invoice_number || invoiceId.substring(0, 8),
    issue_date: invoice.issue_date,
    due_date: invoice.due_date,
    subtotal: invoice.subtotal,
    tax_rate: invoice.tax_rate || 0,
    tax_amount: invoice.tax_amount || 0,
    total: invoice.total,
    notes: invoice.notes,
    customer: customerInfo,
    company: companyInfo,
    items: invoice.items || [],
    payments: invoice.payments || []
  };
}
