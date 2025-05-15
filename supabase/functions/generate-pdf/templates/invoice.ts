
import { PDFDocument, rgb, StandardFonts } from "https://esm.sh/pdf-lib@1.17.1";

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
  
  // Get font
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  // Header
  page.drawText('INVOICE', {
    x: width - 150,
    y: height - 50,
    size: 24,
    font: boldFont,
    color: rgb(0, 0.3, 0.7),
  });
  
  // Invoice number and dates
  page.drawText(`Invoice #: ${invoice.invoice_number || invoiceId.substring(0, 8)}`, {
    x: width - 200,
    y: height - 80,
    size: 10,
    font: font,
  });
  
  page.drawText(`Date: ${new Date(invoice.issue_date).toLocaleDateString()}`, {
    x: width - 200,
    y: height - 95,
    size: 10,
    font: font,
  });
  
  page.drawText(`Due Date: ${new Date(invoice.due_date).toLocaleDateString()}`, {
    x: width - 200,
    y: height - 110,
    size: 10,
    font: font,
  });
  
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
  page.drawText("BILL TO", {
    x: 50,
    y: height - 140,
    size: 12,
    font: boldFont,
  });
  
  if (invoice.customer) {
    page.drawText(`${invoice.customer.first_name} ${invoice.customer.last_name}`, {
      x: 50,
      y: height - 160,
      size: 10,
      font: font,
    });
    
    if (invoice.customer.billing_address) {
      page.drawText(invoice.customer.billing_address, {
        x: 50,
        y: height - 175,
        size: 10,
        font: font,
      });
    }
    
    if (invoice.customer.email) {
      page.drawText(`Email: ${invoice.customer.email}`, {
        x: 50,
        y: height - 190,
        size: 10,
        font: font,
      });
    }
    
    if (invoice.customer.phone) {
      page.drawText(`Phone: ${invoice.customer.phone}`, {
        x: 50,
        y: height - 205,
        size: 10,
        font: font,
      });
    }
  }
  
  // Line items header
  const tableTop = height - 250;
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
  if (invoice.items && invoice.items.length > 0) {
    for (const item of invoice.items) {
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
  
  page.drawText(`$${Number(invoice.subtotal || 0).toFixed(2)}`, {
    x: 500,
    y,
    size: 10,
    font: font,
  });
  
  y -= 20;
  page.drawText(`Tax (${Number(invoice.tax_rate || 0).toFixed(2)}%):`, {
    x: 400,
    y,
    size: 10,
    font: font,
  });
  
  page.drawText(`$${Number(invoice.tax_amount || 0).toFixed(2)}`, {
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
  
  page.drawText(`$${Number(invoice.total || 0).toFixed(2)}`, {
    x: 500,
    y,
    size: 12,
    font: boldFont,
  });
  
  // Amount paid and balance due
  if (invoice.payments && invoice.payments.length > 0) {
    let amountPaid = invoice.payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
    
    y -= 20;
    page.drawText("Amount Paid:", {
      x: 400,
      y,
      size: 10,
      font: font,
    });
    
    page.drawText(`$${Number(amountPaid).toFixed(2)}`, {
      x: 500,
      y,
      size: 10,
      font: font,
    });
    
    y -= 20;
    page.drawText("Balance Due:", {
      x: 400,
      y,
      size: 12,
      font: boldFont,
      color: rgb(0.8, 0.2, 0.2),
    });
    
    const balanceDue = Number(invoice.total || 0) - amountPaid;
    page.drawText(`$${balanceDue.toFixed(2)}`, {
      x: 500,
      y,
      size: 12,
      font: boldFont,
      color: rgb(0.8, 0.2, 0.2),
    });
  }
  
  // Notes
  if (invoice.notes) {
    y -= 40;
    page.drawText("Notes:", {
      x: 50,
      y,
      size: 12,
      font: boldFont,
    });
    
    y -= 20;
    const notes = invoice.notes || "";
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
