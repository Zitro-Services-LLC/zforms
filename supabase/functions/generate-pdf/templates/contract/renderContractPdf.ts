
import { PDFDocument, rgb, StandardFonts } from "https://esm.sh/pdf-lib@1.17.1";
import { 
  addDocumentHeader, 
  addCustomerInfo,
  addFooter,
  DOCUMENT_COLORS
} from "../../pdfHelpers.ts";
import { ContractData } from "./fetchContractData.ts";

/**
 * Generates a PDF from contract data
 */
export async function renderContractPdf(contractData: ContractData): Promise<Uint8Array> {
  // Create PDF document
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]); // US Letter size
  const { width, height } = page.getSize();
  
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  // Generate dates array
  let dates = [];
  if (contractData.start_date) {
    dates.push({ 
      label: 'Start Date', 
      value: new Date(contractData.start_date).toLocaleDateString() 
    });
  }
  
  if (contractData.end_date) {
    dates.push({ 
      label: 'End Date', 
      value: new Date(contractData.end_date).toLocaleDateString() 
    });
  }
  
  // Add professional contract header with logo and company info
  const contentStartY = await addDocumentHeader(
    page,
    width,
    height,
    boldFont,
    font,
    'CONTRACT',
    contractData.display_id,
    dates,
    DOCUMENT_COLORS.contract,
    contractData.company
  );
  
  // Add customer information (full width)
  let currentY = contentStartY;
  currentY = addCustomerInfo(
    page,
    currentY,
    boldFont,
    font,
    "CUSTOMER",
    contractData.customer
  );
  
  // Contract title
  currentY -= 20;
  page.drawText(contractData.title, {
    x: width / 2 - 100,
    y: currentY,
    size: 14,
    font: boldFont,
  });
  
  currentY -= 40;
  
  // Scope of work
  if (contractData.scope_of_work) {
    page.drawText("SCOPE OF WORK", {
      x: 50,
      y: currentY,
      size: 12,
      font: boldFont,
    });
    
    currentY -= 20;
    page.drawText(contractData.scope_of_work, {
      x: 50,
      y: currentY,
      size: 10,
      font: font,
      maxWidth: width - 100,
    });
    
    // Approximate space for scope of work
    currentY -= 120;
  }
  
  // Terms and conditions
  if (contractData.terms_and_conditions) {
    page.drawText("TERMS AND CONDITIONS", {
      x: 50,
      y: currentY,
      size: 12,
      font: boldFont,
    });
    
    currentY -= 20;
    page.drawText(contractData.terms_and_conditions, {
      x: 50,
      y: currentY,
      size: 10,
      font: font,
      maxWidth: width - 100,
    });
    
    currentY -= 120;
  }
  
  // Contract amount
  page.drawText("CONTRACT AMOUNT", {
    x: 50,
    y: currentY,
    size: 12,
    font: boldFont,
  });
  
  currentY -= 20;
  page.drawText(`Total: $${Number(contractData.total_amount || 0).toFixed(2)}`, {
    x: 50,
    y: currentY,
    size: 12,
    font: font,
  });
  
  // Signatures
  currentY -= 40;
  page.drawText("SIGNATURES", {
    x: 50,
    y: currentY,
    size: 12,
    font: boldFont,
  });
  
  // Contractor signature
  currentY -= 20;
  page.drawText("Contractor:", {
    x: 50,
    y: currentY,
    size: 10,
    font: font,
  });
  
  page.drawLine({
    start: { x: 120, y: currentY },
    end: { x: 300, y: currentY },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  
  // Customer signature
  page.drawText("Customer:", {
    x: 320,
    y: currentY,
    size: 10,
    font: font,
  });
  
  page.drawLine({
    start: { x: 380, y: currentY },
    end: { x: 560, y: currentY },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  
  // Date signature
  currentY -= 20;
  page.drawText("Date:", {
    x: 50,
    y: currentY,
    size: 10,
    font: font,
  });
  
  page.drawLine({
    start: { x: 90, y: currentY },
    end: { x: 200, y: currentY },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  
  page.drawText("Date:", {
    x: 320,
    y: currentY,
    size: 10,
    font: font,
  });
  
  page.drawLine({
    start: { x: 360, y: currentY },
    end: { x: 470, y: currentY },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  
  // Add footer
  addFooter(page, font);
  
  return pdfDoc.save();
}
