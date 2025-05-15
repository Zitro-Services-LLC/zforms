
import { PDFDocument, StandardFonts } from "https://esm.sh/pdf-lib@1.17.1";
import { 
  addDocumentHeader, 
  addCustomerInfo, 
  addLineItemsHeader,
  addLineItems,
  addTotals,
  addNotes,
  addFooter,
  DOCUMENT_COLORS
} from "../../pdfHelpers.ts";
import { InvoiceData } from "./fetchInvoiceData.ts";

/**
 * Generates a PDF from invoice data
 */
export async function renderInvoicePdf(invoiceData: InvoiceData): Promise<Uint8Array> {
  // Create PDF document
  const pdfDoc = await PDFDocument.create();
  
  // Add a page
  const page = pdfDoc.addPage([612, 792]); // US Letter size
  const { width, height } = page.getSize();
  
  // Get fonts
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  // Calculate amount paid
  let amountPaid = 0;
  if (invoiceData.payments && invoiceData.payments.length > 0) {
    amountPaid = invoiceData.payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  }
  
  // Add professional invoice header with logo and company info
  const contentStartY = await addDocumentHeader(
    page,
    width,
    height,
    boldFont,
    font,
    'INVOICE',
    invoiceData.invoice_number,
    [
      { label: 'Date', value: new Date(invoiceData.issue_date).toLocaleDateString() },
      { label: 'Due Date', value: new Date(invoiceData.due_date).toLocaleDateString() }
    ],
    DOCUMENT_COLORS.invoice,
    invoiceData.company
  );
  
  // Add customer information (full width)
  let currentY = contentStartY;
  currentY = addCustomerInfo(
    page,
    currentY,
    boldFont,
    font,
    "BILL TO",
    invoiceData.customer
  );
  
  // Line items
  currentY -= 20;
  addLineItemsHeader(page, currentY, width, boldFont);
  
  // Add line items
  const { currentPage, y } = addLineItems(
    page,
    invoiceData.items,
    currentY,
    width,
    height,
    font,
    pdfDoc
  );
  
  // Add totals
  const totalsY = addTotals(
    currentPage,
    y,
    font,
    boldFont,
    invoiceData.subtotal,
    invoiceData.tax_rate,
    invoiceData.tax_amount,
    invoiceData.total,
    amountPaid
  );
  
  // Add notes
  if (invoiceData.notes) {
    addNotes(currentPage, totalsY, font, boldFont, invoiceData.notes);
  }
  
  // Add footer
  addFooter(currentPage, font);
  
  return pdfDoc.save();
}
