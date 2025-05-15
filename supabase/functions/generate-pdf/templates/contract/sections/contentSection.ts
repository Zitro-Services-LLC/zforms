
import { rgb } from "https://esm.sh/pdf-lib@1.17.1";

export function addContractContentSection(
  page: any,
  currentY: number,
  boldFont: any,
  font: any,
  scopeOfWork?: string, 
  termsAndConditions?: string,
  width: number = 612 // Default to US Letter width
) {
  let y = currentY;
  
  // Scope of work
  if (scopeOfWork) {
    page.drawText("SCOPE OF WORK", {
      x: 50,
      y,
      size: 12,
      font: boldFont,
    });
    
    y -= 20;
    page.drawText(scopeOfWork, {
      x: 50,
      y,
      size: 10,
      font: font,
      maxWidth: width - 100,
    });
    
    // Approximate space for scope of work
    y -= 120;
  }
  
  // Terms and conditions
  if (termsAndConditions) {
    page.drawText("TERMS AND CONDITIONS", {
      x: 50,
      y,
      size: 12,
      font: boldFont,
    });
    
    y -= 20;
    page.drawText(termsAndConditions, {
      x: 50,
      y,
      size: 10,
      font: font,
      maxWidth: width - 100,
    });
    
    y -= 120;
  }
  
  return y;
}
