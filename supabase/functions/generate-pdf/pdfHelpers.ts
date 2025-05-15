
import { PDFDocument, rgb, StandardFonts } from "https://esm.sh/pdf-lib@1.17.1";

// Common colors for document types
export const DOCUMENT_COLORS = {
  invoice: rgb(0, 0.3, 0.7),    // Blue
  estimate: rgb(0.3, 0.5, 0.2), // Green
  contract: rgb(0.2, 0.3, 0.7), // Blue-purple
};

// Types for our helpers
export interface CompanyInfo {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
}

export interface CustomerInfo {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  billing_address?: string;
  property_address?: string;
}

// Add document header (title, number, dates)
export async function addDocumentHeader(
  page: any, 
  width: number, 
  height: number, 
  boldFont: any, 
  font: any, 
  title: string, 
  docNumber: string, 
  dates: { label: string, value: string }[],
  color: any
) {
  // Title
  page.drawText(title.toUpperCase(), {
    x: width - 150,
    y: height - 50,
    size: 24,
    font: boldFont,
    color: color,
  });
  
  // Document number
  page.drawText(`${title} #: ${docNumber}`, {
    x: width - 200,
    y: height - 80,
    size: 10,
    font: font,
  });
  
  // Dates
  let y = height - 95;
  for (const date of dates) {
    page.drawText(`${date.label}: ${date.value}`, {
      x: width - 200,
      y,
      size: 10,
      font: font,
    });
    y -= 15;
  }
}

// Add company information
export function addCompanyInfo(
  page: any, 
  height: number, 
  boldFont: any, 
  font: any, 
  company: CompanyInfo
) {
  page.drawText(company.name, {
    x: 50,
    y: height - 50,
    size: 14,
    font: boldFont,
  });
  
  let y = height - 70;
  
  if (company.address) {
    page.drawText(company.address, {
      x: 50,
      y,
      size: 10,
      font: font,
    });
    y -= 15;
  }
  
  if (company.phone) {
    page.drawText(`Tel: ${company.phone}`, {
      x: 50,
      y,
      size: 10,
      font: font,
    });
    y -= 15;
  }
  
  if (company.email) {
    page.drawText(`Email: ${company.email}`, {
      x: 50,
      y,
      size: 10,
      font: font,
    });
  }
}

// Add customer information
export function addCustomerInfo(
  page: any, 
  height: number, 
  boldFont: any, 
  font: any, 
  headerText: string,
  customer: CustomerInfo
) {
  page.drawText(headerText, {
    x: 50,
    y: height - 140,
    size: 12,
    font: boldFont,
  });
  
  page.drawText(`${customer.first_name} ${customer.last_name}`, {
    x: 50,
    y: height - 160,
    size: 10,
    font: font,
  });
  
  let y = height - 175;
  
  const addressType = headerText.toLowerCase().includes('bill') 
    ? customer.billing_address 
    : customer.property_address;
  
  if (addressType) {
    page.drawText(addressType, {
      x: 50,
      y,
      size: 10,
      font: font,
    });
    y -= 15;
  }
  
  if (customer.email) {
    page.drawText(`Email: ${customer.email}`, {
      x: 50,
      y,
      size: 10,
      font: font,
    });
    y -= 15;
  }
  
  if (customer.phone) {
    page.drawText(`Phone: ${customer.phone}`, {
      x: 50,
      y,
      size: 10,
      font: font,
    });
  }
}

// Add line items table header
export function addLineItemsHeader(
  page: any, 
  tableTop: number, 
  width: number, 
  boldFont: any
) {
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
}

// Add line items to the table
export function addLineItems(
  page: any, 
  items: any[], 
  tableTop: number, 
  width: number, 
  height: number,
  font: any,
  pdfDoc: any
) {
  let y = tableTop - 25;
  let currentPage = page;
  
  if (items && items.length > 0) {
    for (const item of items) {
      currentPage.drawText(item.description || "", {
        x: 50,
        y,
        size: 10,
        font: font,
        maxWidth: 240,
      });
      
      currentPage.drawText(item.quantity?.toString() || "1", {
        x: 300,
        y,
        size: 10,
        font: font,
      });
      
      currentPage.drawText(`$${Number(item.rate || 0).toFixed(2)}`, {
        x: 370,
        y,
        size: 10,
        font: font,
      });
      
      currentPage.drawText(`$${Number(item.amount || 0).toFixed(2)}`, {
        x: 500,
        y,
        size: 10,
        font: font,
      });
      
      y -= 20;
      
      // Add a new page if we're running out of space
      if (y < 100) {
        const newPage = pdfDoc.addPage([612, 792]);
        currentPage = newPage;
        y = height - 50;
      }
    }
  }
  
  // Draw a line after the items
  currentPage.drawLine({
    start: { x: 50, y: y - 5 },
    end: { x: width - 50, y: y - 5 },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });
  
  return { currentPage, y: y - 25 };
}

// Add totals section
export function addTotals(
  page: any, 
  y: number, 
  font: any, 
  boldFont: any, 
  subtotal: number, 
  taxRate: number, 
  taxAmount: number, 
  total: number,
  amountPaid?: number
) {
  page.drawText("Subtotal:", {
    x: 400,
    y,
    size: 10,
    font: font,
  });
  
  page.drawText(`$${Number(subtotal || 0).toFixed(2)}`, {
    x: 500,
    y,
    size: 10,
    font: font,
  });
  
  y -= 20;
  page.drawText(`Tax (${Number(taxRate || 0).toFixed(2)}%):`, {
    x: 400,
    y,
    size: 10,
    font: font,
  });
  
  page.drawText(`$${Number(taxAmount || 0).toFixed(2)}`, {
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
  
  page.drawText(`$${Number(total || 0).toFixed(2)}`, {
    x: 500,
    y,
    size: 12,
    font: boldFont,
  });
  
  // If amount paid is provided (for invoices)
  if (amountPaid !== undefined) {
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
    
    const balanceDue = Number(total || 0) - Number(amountPaid || 0);
    page.drawText(`$${balanceDue.toFixed(2)}`, {
      x: 500,
      y,
      size: 12,
      font: boldFont,
      color: rgb(0.8, 0.2, 0.2),
    });
  }
  
  return y;
}

// Add notes section
export function addNotes(
  page: any, 
  y: number, 
  font: any, 
  boldFont: any, 
  notes: string
) {
  if (!notes) return y;
  
  y -= 40;
  page.drawText("Notes:", {
    x: 50,
    y,
    size: 12,
    font: boldFont,
  });
  
  y -= 20;
  page.drawText(notes, {
    x: 50,
    y,
    size: 10,
    font: font,
    maxWidth: 500,
  });
  
  return y;
}

// Add footer
export function addFooter(
  page: any, 
  font: any
) {
  page.drawText(`Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, {
    x: 50,
    y: 30,
    size: 8,
    font: font,
    color: rgb(0.5, 0.5, 0.5),
  });
}
