
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
  logo_url?: string;
}

export interface CustomerInfo {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  billing_address?: string;
  property_address?: string;
}

// Helper function to embed a logo image in the PDF
export async function embedLogoIfExists(
  pdfDoc: any,
  logoUrl: string | null | undefined
): Promise<{
  logo: any,
  logoWidth: number,
  logoHeight: number
} | null> {
  if (!logoUrl) return null;

  try {
    // Fetch the logo image
    const response = await fetch(logoUrl);
    if (!response.ok) {
      console.warn(`Failed to fetch logo: ${response.status} ${response.statusText}`);
      return null;
    }

    // Convert the response to an ArrayBuffer
    const imageBytes = new Uint8Array(await response.arrayBuffer());

    // Determine image type from URL (simplified)
    let logo;
    if (logoUrl.toLowerCase().endsWith('.jpg') || logoUrl.toLowerCase().endsWith('.jpeg')) {
      logo = await pdfDoc.embedJpg(imageBytes);
    } else if (logoUrl.toLowerCase().endsWith('.png')) {
      logo = await pdfDoc.embedPng(imageBytes);
    } else {
      // Default to PNG
      try {
        logo = await pdfDoc.embedPng(imageBytes);
      } catch (err) {
        try {
          logo = await pdfDoc.embedJpg(imageBytes);
        } catch (err) {
          console.warn('Unable to embed logo, unsupported format');
          return null;
        }
      }
    }

    // Return the embedded logo with dimensions
    const { width, height } = logo.scale(0.5); // Scale down a bit for the header
    return { logo, logoWidth: width, logoHeight: height };
  } catch (error) {
    console.warn('Error embedding logo:', error);
    return null;
  }
}

// Add professional document header (logo, company info, document title/number/dates)
export async function addDocumentHeader(
  page: any, 
  width: number, 
  height: number, 
  boldFont: any, 
  font: any, 
  title: string, 
  docNumber: string, 
  dates: { label: string, value: string }[],
  color: any,
  company?: CompanyInfo
) {
  // Constants for layout
  const headerTop = height - 50;
  const logoLeftMargin = 50;
  const companyInfoX = width / 2 - 100;
  const documentInfoX = width - 200;
  
  // 1. Left column: Logo (if available)
  let currentLogoY = headerTop;
  let logoHeight = 0;
  
  if (company?.logo_url) {
    const logoResult = await embedLogoIfExists(page.doc, company.logo_url);
    
    if (logoResult) {
      const { logo, logoWidth, logoHeight: height } = logoResult;
      logoHeight = height;
      
      // Position logo in the top left
      page.drawImage(logo, {
        x: logoLeftMargin,
        y: headerTop - height,
        width: logoWidth,
        height: height
      });
    }
  }
  
  // 2. Middle column: Company information
  if (company) {
    let companyInfoY = headerTop;
    
    // Company name
    page.drawText(company.name, {
      x: companyInfoX,
      y: companyInfoY,
      size: 14,
      font: boldFont,
    });
    companyInfoY -= 15;
    
    // Company address
    if (company.address) {
      page.drawText(company.address, {
        x: companyInfoX,
        y: companyInfoY,
        size: 10,
        font: font,
      });
      companyInfoY -= 15;
    }
    
    // Company phone
    if (company.phone) {
      page.drawText(`Tel: ${company.phone}`, {
        x: companyInfoX,
        y: companyInfoY,
        size: 10,
        font: font,
      });
      companyInfoY -= 15;
    }
    
    // Company email
    if (company.email) {
      page.drawText(`Email: ${company.email}`, {
        x: companyInfoX,
        y: companyInfoY,
        size: 10,
        font: font,
      });
    }
  }
  
  // 3. Right column: Document title, number and dates
  // Document title
  page.drawText(title.toUpperCase(), {
    x: documentInfoX,
    y: headerTop,
    size: 24,
    font: boldFont,
    color: color,
  });
  
  // Document number
  page.drawText(`#: ${docNumber}`, {
    x: documentInfoX,
    y: headerTop - 30,
    size: 10,
    font: font,
  });
  
  // Dates
  let dateY = headerTop - 45;
  for (const date of dates) {
    page.drawText(`${date.label}: ${date.value}`, {
      x: documentInfoX,
      y: dateY,
      size: 10,
      font: font,
    });
    dateY -= 15;
  }
  
  // Draw a separator line below the header
  const headerHeight = Math.max(120, logoHeight + 20);
  page.drawLine({
    start: { x: 50, y: height - headerHeight },
    end: { x: width - 50, y: height - headerHeight },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });
  
  // Return the Y position where content can start
  return height - headerHeight - 20;
}

// Add customer information only (expanded to full width)
export function addCustomerInfo(
  page: any, 
  contentStartY: number, 
  boldFont: any, 
  font: any, 
  headerText: string,
  customer: CustomerInfo
) {
  page.drawText(headerText, {
    x: 50,
    y: contentStartY,
    size: 12,
    font: boldFont,
  });
  
  page.drawText(`${customer.first_name} ${customer.last_name}`, {
    x: 50,
    y: contentStartY - 20,
    size: 10,
    font: font,
  });
  
  let y = contentStartY - 35;
  
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
  
  return y - 30; // Return position for next content
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
