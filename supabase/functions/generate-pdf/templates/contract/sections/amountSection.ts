
export function addContractAmountSection(
  page: any,
  currentY: number,
  boldFont: any,
  font: any,
  totalAmount: number
) {
  page.drawText("CONTRACT AMOUNT", {
    x: 50,
    y: currentY,
    size: 12,
    font: boldFont,
  });
  
  const y = currentY - 20;
  page.drawText(`Total: $${Number(totalAmount || 0).toFixed(2)}`, {
    x: 50,
    y,
    size: 12,
    font: font,
  });
  
  return y - 20; // Return the new Y position
}
