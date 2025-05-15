
import { fetchInvoiceData } from "./fetchInvoiceData.ts";
import { renderInvoicePdf } from "./renderInvoicePdf.ts";

export async function generateInvoicePDF(supabase: any, invoiceId: string, userId: string) {
  // 1. Fetch invoice data
  const invoiceData = await fetchInvoiceData(supabase, invoiceId, userId);
  
  // 2. Generate PDF from invoice data
  return renderInvoicePdf(invoiceData);
}
