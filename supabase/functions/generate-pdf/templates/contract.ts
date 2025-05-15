
import { PDFDocument, rgb, StandardFonts } from "https://esm.sh/pdf-lib@1.17.1";

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
  
  // Header
  page.drawText('CONTRACT', {
    x: width - 150,
    y: height - 50,
    size: 24,
    font: boldFont,
    color: rgb(0.2, 0.3, 0.7),
  });
  
  // Contract number and date
  page.drawText(`Contract #: ${contract.display_id || contractId.substring(0, 8)}`, {
    x: width - 200,
    y: height - 80,
    size: 10,
    font: font,
  });
  
  if (contract.start_date) {
    page.drawText(`Start Date: ${new Date(contract.start_date).toLocaleDateString()}`, {
      x: width - 200,
      y: height - 95,
      size: 10,
      font: font,
    });
  }
  
  if (contract.end_date) {
    page.drawText(`End Date: ${new Date(contract.end_date).toLocaleDateString()}`, {
      x: width - 200,
      y: height - 110,
      size: 10,
      font: font,
    });
  }
  
  // Company information
  const companyName = contractor?.company_name || "Company Name";
  page.drawText(companyName, {
    x: 50,
    y: height - 50,
    size: 14,
    font: boldFont,
  });
  
  if (contractor?.company_address) {
    page.drawText(contractor.company_address, {
      x: 50,
      y: height - 70,
      size: 10,
      font: font,
    });
  }
  
  if (contractor?.company_phone) {
    page.drawText(`Tel: ${contractor.company_phone}`, {
      x: 50,
      y: height - 85,
      size: 10,
      font: font,
    });
  }
  
  if (contractor?.company_email) {
    page.drawText(`Email: ${contractor.company_email}`, {
      x: 50,
      y: height - 100,
      size: 10,
      font: font,
    });
  }
  
  // Customer information
  page.drawText("CUSTOMER", {
    x: 50,
    y: height - 140,
    size: 12,
    font: boldFont,
  });
  
  if (contract.customer) {
    page.drawText(`${contract.customer.first_name} ${contract.customer.last_name}`, {
      x: 50,
      y: height - 160,
      size: 10,
      font: font,
    });
    
    if (contract.customer.property_address) {
      page.drawText("Property Address:", {
        x: 50,
        y: height - 175,
        size: 10,
        font: boldFont,
      });
      
      page.drawText(contract.customer.property_address, {
        x: 50,
        y: height - 190,
        size: 10,
        font: font,
      });
    }
    
    if (contract.customer.email) {
      page.drawText(`Email: ${contract.customer.email}`, {
        x: 50,
        y: height - 210,
        size: 10,
        font: font,
      });
    }
    
    if (contract.customer.phone) {
      page.drawText(`Phone: ${contract.customer.phone}`, {
        x: 50,
        y: height - 225,
        size: 10,
        font: font,
      });
    }
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
  
  // Footer
  page.drawText(`Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, {
    x: 50,
    y: 30,
    size: 8,
    font: font,
    color: rgb(0.5, 0.5, 0.5),
  });
  
  return pdfDoc.save();
}
