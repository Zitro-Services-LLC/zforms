
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
} from "../pdfHelpers.ts";

export async function generateEstimatePDF(supabase, estimateId, userId) {
  console.log(`Generating PDF for estimate ${estimateId}`);
  
  // Fetch the estimate data with all related information
  const { data: estimate, error: estimateError } = await supabase
    .from('estimates')
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
    .eq('id', estimateId)
    .eq('user_id', userId)
    .maybeSingle();

  if (estimateError) throw new Error(`Error fetching estimate: ${estimateError.message}`);
  if (!estimate) throw new Error(`Estimate not found: ${estimateId}`);
  
  // Fetch estimate items
  const { data: items, error: itemsError } = await supabase
    .from('estimate_items')
    .select('*')
    .eq('estimate_id', estimateId);
    
  if (itemsError) throw new Error(`Error fetching estimate items: ${itemsError.message}`);
  
  // Fetch contractor data
  const { data: contractor, error: contractorError } = await supabase
    .from('contractors')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (contractorError) throw new Error(`Error fetching contractor: ${contractorError.message}`);

  // Create PDF document
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]); // US Letter size
  const { width, height } = page.getSize();
  
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  // Format estimate reference number
  const estimateNumber = estimate.title || `EST-${estimateId.substring(0, 8)}`;
  
  // Prepare dates array
  let dates = [
    { label: 'Date', value: new Date(estimate.date).toLocaleDateString() }
  ];
  
  if (estimate.expiry_date) {
    dates.push({ 
      label: 'Expires', 
      value: new Date(estimate.expiry_date).toLocaleDateString() 
    });
  }
  
  // Prepare company info for header
  const companyInfo = {
    name: contractor?.company_name || "Company Name",
    address: contractor?.company_address,
    phone: contractor?.company_phone,
    email: contractor?.company_email,
    logo_url: contractor?.logo_url
  };
  
  // Add professional estimate header with logo and company info
  const contentStartY = await addDocumentHeader(
    page,
    width,
    height,
    boldFont,
    font,
    'ESTIMATE',
    estimateNumber,
    dates,
    DOCUMENT_COLORS.estimate,
    companyInfo
  );
  
  // Add customer information (full width)
  let currentY = contentStartY;
  if (estimate.customer) {
    currentY = addCustomerInfo(
      page,
      currentY,
      boldFont,
      font,
      "CUSTOMER",
      estimate.customer
    );
  }
  
  // Job Description if available
  if (estimate.job_description) {
    currentY -= 20;
    page.drawText("JOB DESCRIPTION", {
      x: 50,
      y: currentY,
      size: 12,
      font: boldFont,
    });
    
    currentY -= 20;
    page.drawText(estimate.job_description, {
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
    items,
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
    estimate.subtotal,
    estimate.tax_rate,
    estimate.tax_amount,
    estimate.total
  );
  
  // Add notes
  if (estimate.notes) {
    addNotes(currentPage, totalsY, font, boldFont, estimate.notes);
  }
  
  // Add footer
  addFooter(currentPage, font);
  
  return pdfDoc.save();
}
