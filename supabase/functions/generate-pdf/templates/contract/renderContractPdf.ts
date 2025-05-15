
import { PDFDocument, StandardFonts } from "https://esm.sh/pdf-lib@1.17.1";
import { 
  addFooter,
  DOCUMENT_COLORS
} from "../../pdfHelpers.ts";
import { ContractData } from "./fetchContractData.ts";
import { addContractHeaderSection } from "./sections/headerSection.ts";
import { addContractCustomerSection } from "./sections/customerSection.ts";
import { addContractTitleSection } from "./sections/titleSection.ts";
import { addContractContentSection } from "./sections/contentSection.ts";
import { addContractAmountSection } from "./sections/amountSection.ts";
import { addContractSignatureSection } from "./sections/signatureSection.ts";

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
  
  // 1. Add document header
  let currentY = await addContractHeaderSection(
    page,
    width,
    height,
    boldFont,
    font,
    contractData.display_id,
    dates,
    DOCUMENT_COLORS.contract,
    contractData.company
  );
  
  // 2. Add customer information
  currentY = addContractCustomerSection(
    page,
    currentY,
    boldFont,
    font,
    contractData.customer
  );
  
  // 3. Add contract title
  currentY = addContractTitleSection(
    page, 
    width, 
    currentY - 20, 
    boldFont, 
    contractData.title
  );
  
  // 4. Add contract content (scope of work and terms)
  currentY = addContractContentSection(
    page,
    currentY,
    boldFont,
    font,
    contractData.scope_of_work,
    contractData.terms_and_conditions,
    width
  );
  
  // 5. Add contract amount section
  currentY = addContractAmountSection(
    page,
    currentY,
    boldFont,
    font,
    contractData.total_amount
  );
  
  // 6. Add signature section
  currentY = addContractSignatureSection(
    page,
    currentY,
    boldFont,
    font
  );
  
  // 7. Add footer
  addFooter(page, font);
  
  return pdfDoc.save();
}
