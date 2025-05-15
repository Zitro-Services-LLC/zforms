
import { rgb } from "https://esm.sh/pdf-lib@1.17.1";
import { CompanyInfo } from "./types.ts";
import { embedLogoIfExists } from "./imageUtils.ts";

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
