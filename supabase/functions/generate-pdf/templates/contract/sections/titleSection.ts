
export function addContractTitleSection(
  page: any,
  width: number,
  currentY: number,
  boldFont: any,
  title: string
) {
  // Contract title
  page.drawText(title, {
    x: width / 2 - 100,
    y: currentY,
    size: 14,
    font: boldFont,
  });
  
  return currentY - 40; // Return the new Y position
}
