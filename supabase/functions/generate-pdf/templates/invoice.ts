
import { PDFDocument, rgb, StandardFonts } from "https://esm.sh/pdf-lib@1.17.1";
import { 
  addDocumentHeader, 
  addCompanyInfo, 
  addCustomerInfo, 
  addLineItemsHeader,
  addLineItems,
  addTotals,
  addNotes,
  addFooter,
  DOCUMENT_COLORS
} from "../pdfHelpers.ts";

export async function generateInvoicePDF(supabase, invoiceId, userId) {
  console.log(`Generating PDF for invoice ${invoiceId}`);
  
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

  // Create PDF document
  const pdfDoc = await PDFDocument.create();
  
  // Add a page
  const page = pdfDoc.addPage([612, 792]); // US Letter size
  const { width, height } = page.getSize();
  
  // Get fonts
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  // Add invoice header
  await addDocumentHeader(
    page,
    width,
    height,
    boldFont,
    font,
    'INVOICE',
    invoice.invoice_number || invoiceId.substring(0, 8),
    [
      { label: 'Date', value: new Date(invoice.issue_date).toLocaleDateString() },
      { label: 'Due Date', value: new Date(invoice.due_date).toLocaleDateString() }
    ],
    DOCUMENT_COLORS.invoice
  );
  
  // Add company information
  addCompanyInfo(
    page,
    height,
    boldFont,
    font,
    {
      name: contractor?.company_name || "Company Name",
      address: contractor?.company_address,
      phone: contractor?.company_phone,
      email: contractor?.company_email
    }
  );
  
  // Add customer information
  if (invoice.customer) {
    addCustomerInfo(
      page,
      height,
      boldFont,
      font,
      "BILL TO",
      invoice.customer
    );
  }
  
  // Line items
  const tableTop = height - 250;
  addLineItemsHeader(page, tableTop, width, boldFont);
  
  // Add line items
  const { currentPage, y } = addLineItems(
    page,
    invoice.items,
    tableTop,
    width,
    height,
    font,
    pdfDoc
  );
  
  // Calculate amount paid
  let amountPaid = 0;
  if (invoice.payments && invoice.payments.length > 0) {
    amountPaid = invoice.payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  }
  
  // Add totals
  const totalsY = addTotals(
    currentPage,
    y,
    font,
    boldFont,
    invoice.subtotal,
    invoice.tax_rate,
    invoice.tax_amount,
    invoice.total,
    amountPaid
  );
  
  // Add notes
  if (invoice.notes) {
    addNotes(currentPage, totalsY, font, boldFont, invoice.notes);
  }
  
  // Add footer
  addFooter(currentPage, font);
  
  return pdfDoc.save();
}
