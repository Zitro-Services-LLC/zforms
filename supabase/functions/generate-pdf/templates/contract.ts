
import { PDFDocument, rgb, StandardFonts } from "https://esm.sh/pdf-lib@1.17.1";
import { 
  addDocumentHeader, 
  addCompanyInfo, 
  addCustomerInfo,
  addFooter,
  DOCUMENT_COLORS
} from "../pdfHelpers.ts";

export async function generateContractPDF(supabase, contractId, userId) {
  console.log(`Generating PDF for contract ${contractId}`);
  
  // Fetch the contract data with all related information
  const { data: contract, error: contractError } = await supabase
    .from('contracts')
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
    .eq('id', contractId)
    .eq('user_id', userId)
    .maybeSingle();

  if (contractError) throw new Error(`Error fetching contract: ${contractError.message}`);
  if (!contract) throw new Error(`Contract not found: ${contractId}`);
  
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
  
  // Generate dates array
  let dates = [];
  if (contract.start_date) {
    dates.push({ 
      label: 'Start Date', 
      value: new Date(contract.start_date).toLocaleDateString() 
    });
  }
  
  if (contract.end_date) {
    dates.push({ 
      label: 'End Date', 
      value: new Date(contract.end_date).toLocaleDateString() 
    });
  }
  
  // Add contract header
  await addDocumentHeader(
    page,
    width,
    height,
    boldFont,
    font,
    'CONTRACT',
    contract.display_id || contractId.substring(0, 8),
    dates,
    DOCUMENT_COLORS.contract
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
  if (contract.customer) {
    addCustomerInfo(
      page,
      height,
      boldFont,
      font,
      "CUSTOMER",
      contract.customer
    );
  }
  
  // Contract title
  const titleY = height - 260;
  page.drawText(contract.title || "Contract Agreement", {
    x: width / 2 - 100,
    y: titleY,
    size: 14,
    font: boldFont,
  });
  
  // Scope of work
  if (contract.scope_of_work) {
    let y = titleY - 40;
    page.drawText("SCOPE OF WORK", {
      x: 50,
      y,
      size: 12,
      font: boldFont,
    });
    
    y -= 20;
    page.drawText(contract.scope_of_work, {
      x: 50,
      y,
      size: 10,
      font: font,
      maxWidth: width - 100,
    });
    
    // If the scope of work is long, it might need to be paginated
    // This is simplified for now
    y -= 120; // Approximate space for scope of work
    
    // Terms and conditions
    if (contract.terms_and_conditions) {
      page.drawText("TERMS AND CONDITIONS", {
        x: 50,
        y,
        size: 12,
        font: boldFont,
      });
      
      y -= 20;
      page.drawText(contract.terms_and_conditions, {
        x: 50,
        y,
        size: 10,
        font: font,
        maxWidth: width - 100,
      });
    }
  }
  
  // Contract amount
  const amountY = 150;
  page.drawText("CONTRACT AMOUNT", {
    x: 50,
    y: amountY,
    size: 12,
    font: boldFont,
  });
  
  page.drawText(`Total: $${Number(contract.total_amount || 0).toFixed(2)}`, {
    x: 50,
    y: amountY - 20,
    size: 12,
    font: font,
  });
  
  // Signatures
  const signatureY = 80;
  page.drawText("SIGNATURES", {
    x: 50,
    y: signatureY,
    size: 12,
    font: boldFont,
  });
  
  // Contractor signature
  page.drawText("Contractor:", {
    x: 50,
    y: signatureY - 20,
    size: 10,
    font: font,
  });
  
  page.drawLine({
    start: { x: 120, y: signatureY - 20 },
    end: { x: 300, y: signatureY - 20 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  
  // Customer signature
  page.drawText("Customer:", {
    x: 320,
    y: signatureY - 20,
    size: 10,
    font: font,
  });
  
  page.drawLine({
    start: { x: 380, y: signatureY - 20 },
    end: { x: 560, y: signatureY - 20 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  
  // Date signature
  page.drawText("Date:", {
    x: 50,
    y: signatureY - 40,
    size: 10,
    font: font,
  });
  
  page.drawLine({
    start: { x: 90, y: signatureY - 40 },
    end: { x: 200, y: signatureY - 40 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  
  page.drawText("Date:", {
    x: 320,
    y: signatureY - 40,
    size: 10,
    font: font,
  });
  
  page.drawLine({
    start: { x: 360, y: signatureY - 40 },
    end: { x: 470, y: signatureY - 40 },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  
  // Add footer
  addFooter(page, font);
  
  return pdfDoc.save();
}
