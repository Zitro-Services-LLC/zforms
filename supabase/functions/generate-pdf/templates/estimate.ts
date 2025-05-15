
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
  
  // Add estimate header
  const estimateNumber = `EST-${estimateId.substring(0, 8)}`;
  
  let dates = [
    { label: 'Date', value: new Date(estimate.date).toLocaleDateString() }
  ];
  
  if (estimate.expiry_date) {
    dates.push({ 
      label: 'Expires', 
      value: new Date(estimate.expiry_date).toLocaleDateString() 
    });
  }
  
  await addDocumentHeader(
    page,
    width,
    height,
    boldFont,
    font,
    'ESTIMATE',
    estimateNumber,
    dates,
    DOCUMENT_COLORS.estimate
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
  if (estimate.customer) {
    addCustomerInfo(
      page,
      height,
      boldFont,
      font,
      "CUSTOMER",
      estimate.customer
    );
  }
  
  // Job Description if available
  let tableTopY = height - 300;
  
  if (estimate.job_description) {
    const jobDescY = height - 240;
    page.drawText("JOB DESCRIPTION", {
      x: 50,
      y: jobDescY,
      size: 12,
      font: boldFont,
    });
    
    page.drawText(estimate.job_description, {
      x: 50,
      y: jobDescY - 20,
      size: 10,
      font: font,
      maxWidth: width - 100,
    });
  }
  
  // Line items
  addLineItemsHeader(page, tableTopY, width, boldFont);
  
  // Add line items
  const { currentPage, y } = addLineItems(
    page,
    items,
    tableTopY,
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
