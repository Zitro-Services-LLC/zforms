
import { PDFDocument, rgb, StandardFonts } from "https://esm.sh/pdf-lib@1.17.1";

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
  
  // Header
  page.drawText('ESTIMATE', {
    x: width - 150,
    y: height - 50,
    size: 24,
    font: boldFont,
    color: rgb(0.3, 0.5, 0.2),
  });
  
  // Estimate number and date
  const estimateNumber = `EST-${estimateId.substring(0, 8)}`;
  page.drawText(`Estimate #: ${estimateNumber}`, {
    x: width - 200,
    y: height - 80,
    size: 10,
    font: font,
  });
  
  page.drawText(`Date: ${new Date(estimate.date).toLocaleDateString()}`, {
    x: width - 200,
    y: height - 95,
    size: 10,
    font: font,
  });
  
  if (estimate.expiry_date) {
    page.drawText(`Expires: ${new Date(estimate.expiry_date).toLocaleDateString()}`, {
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
  
  if (estimate.customer) {
    page.drawText(`${estimate.customer.first_name} ${estimate.customer.last_name}`, {
      x: 50,
      y: height - 160,
      size: 10,
      font: font,
    });
    
    if (estimate.customer.billing_address) {
      page.drawText(estimate.customer.billing_address, {
        x: 50,
        y: height - 175,
        size: 10,
        font: font,
      });
    }
    
    if (estimate.customer.email) {
      page.drawText(`Email: ${estimate.customer.email}`, {
        x: 50,
        y: height - 190,
        size: 10,
        font: font,
      });
    }
    
    if (estimate.customer.phone) {
      page.drawText(`Phone: ${estimate.customer.phone}`, {
        x: 50,
        y: height - 205,
        size: 10,
        font: font,
      });
    }
  }
  
  // Job Description if available
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
  
  // Line items header
  const tableTop = height - 300;
  page.drawText("Description", {
    x: 50,
    y: tableTop,
    size: 10,
    font: boldFont,
  });
  
  page.drawText("Quantity", {
    x: 300,
    y: tableTop,
    size: 10,
    font: boldFont,
  });
  
  page.drawText("Rate", {
    x: 370,
    y: tableTop,
    size: 10,
    font: boldFont,
  });
  
  page.drawText("Amount", {
    x: 500,
    y: tableTop,
    size: 10,
    font: boldFont,
  });
  
  // Draw a line
  page.drawLine({
    start: { x: 50, y: tableTop - 5 },
    end: { x: width - 50, y: tableTop - 5 },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });
  
  // Line items
  let y = tableTop - 25;
  if (items && items.length > 0) {
    for (const item of items) {
      page.drawText(item.description || "", {
        x: 50,
        y,
        size: 10,
        font: font,
        maxWidth: 240,
      });
      
      page.drawText(item.quantity?.toString() || "1", {
        x: 300,
        y,
        size: 10,
        font: font,
      });
      
      page.drawText(`$${Number(item.rate || 0).toFixed(2)}`, {
        x: 370,
        y,
        size: 10,
        font: font,
      });
      
      page.drawText(`$${Number(item.amount || 0).toFixed(2)}`, {
        x: 500,
        y,
        size: 10,
        font: font,
      });
      
      y -= 20;
      
      // Add a new page if we're running out of space
      if (y < 100) {
        const newPage = pdfDoc.addPage([612, 792]);
        page = newPage;
        y = height - 50;
      }
    }
  }
  
  // Draw a line
  page.drawLine({
    start: { x: 50, y: y - 5 },
    end: { x: width - 50, y: y - 5 },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });
  
  // Totals
  y -= 25;
  page.drawText("Subtotal:", {
    x: 400,
    y,
    size: 10,
    font: font,
  });
  
  page.drawText(`$${Number(estimate.subtotal || 0).toFixed(2)}`, {
    x: 500,
    y,
    size: 10,
    font: font,
  });
  
  y -= 20;
  page.drawText(`Tax (${Number(estimate.tax_rate || 0).toFixed(2)}%):`, {
    x: 400,
    y,
    size: 10,
    font: font,
  });
  
  page.drawText(`$${Number(estimate.tax_amount || 0).toFixed(2)}`, {
    x: 500,
    y,
    size: 10,
    font: font,
  });
  
  y -= 20;
  page.drawText("Total:", {
    x: 400,
    y,
    size: 12,
    font: boldFont,
  });
  
  page.drawText(`$${Number(estimate.total || 0).toFixed(2)}`, {
    x: 500,
    y,
    size: 12,
    font: boldFont,
  });
  
  // Notes
  if (estimate.notes) {
    y -= 40;
    page.drawText("Notes:", {
      x: 50,
      y,
      size: 12,
      font: boldFont,
    });
    
    y -= 20;
    const notes = estimate.notes || "";
    page.drawText(notes, {
      x: 50,
      y,
      size: 10,
      font: font,
      maxWidth: width - 100,
    });
  }
  
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
