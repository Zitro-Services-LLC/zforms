
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
