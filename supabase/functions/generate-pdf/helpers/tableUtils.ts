
import { rgb } from "https://esm.sh/pdf-lib@1.17.1";

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
