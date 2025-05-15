
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
