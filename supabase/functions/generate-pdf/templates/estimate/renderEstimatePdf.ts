
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
import { EstimateData } from "./fetchEstimateData.ts";

/**
 * Generates a PDF from estimate data
 */
export async function renderEstimatePdf(estimateData: EstimateData): Promise<Uint8Array> {
  // Create PDF document
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]); // US Letter size
  const { width, height } = page.getSize();
  
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  // Prepare dates array
  let dates = [
    { label: 'Date', value: new Date(estimateData.date).toLocaleDateString() }
  ];
  
  if (estimateData.expiry_date) {
    dates.push({ 
      label: 'Expires', 
      value: new Date(estimateData.expiry_date).toLocaleDateString() 
    });
  }
  
  // Add professional estimate header with logo and company info
  const contentStartY = await addDocumentHeader(
    page,
    width,
    height,
    boldFont,
    font,
    'ESTIMATE',
    estimateData.title,
    dates,
    DOCUMENT_COLORS.estimate,
    estimateData.company
  );
  
  // Add customer information (full width)
  let currentY = contentStartY;
  currentY = addCustomerInfo(
    page,
    currentY,
    boldFont,
    font,
    "CUSTOMER",
    estimateData.customer
  );
  
  // Job Description if available
  if (estimateData.job_description) {
    currentY -= 20;
    page.drawText("JOB DESCRIPTION", {
      x: 50,
      y: currentY,
      size: 12,
      font: boldFont,
    });
    
    currentY -= 20;
    page.drawText(estimateData.job_description, {
      x: 50,
      y: currentY,
      size: 10,
      font: font,
      maxWidth: width - 100,
    });
    
    currentY -= 40;
  }
  
  // Line items
  addLineItemsHeader(page, currentY, width, boldFont);
  
  // Add line items
  const { currentPage, y } = addLineItems(
    page,
    estimateData.items,
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
    estimateData.subtotal,
    estimateData.tax_rate,
    estimateData.tax_amount,
    estimateData.total
  );
  
  // Add notes
  if (estimateData.notes) {
    addNotes(currentPage, totalsY, font, boldFont, estimateData.notes);
  }
  
  // Add footer
  addFooter(currentPage, font);
  
  return pdfDoc.save();
}
