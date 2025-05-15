
import { rgb } from "https://esm.sh/pdf-lib@1.17.1";

export function addContractSignatureSection(
  page: any,
  currentY: number,
  boldFont: any,
  font: any
) {
  let y = currentY;
  
  // Signatures header
  y -= 20;
  page.drawText("SIGNATURES", {
    x: 50,
    y,
    size: 12,
    font: boldFont,
  });
  
  // Contractor signature
  y -= 20;
  page.drawText("Contractor:", {
    x: 50,
    y,
    size: 10,
    font: font,
  });
  
  page.drawLine({
    start: { x: 120, y },
    end: { x: 300, y },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  
  // Customer signature
  page.drawText("Customer:", {
    x: 320,
    y,
    size: 10,
    font: font,
  });
  
  page.drawLine({
    start: { x: 380, y },
    end: { x: 560, y },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  
  // Date signature
  y -= 20;
  page.drawText("Date:", {
    x: 50,
    y,
    size: 10,
    font: font,
  });
  
  page.drawLine({
    start: { x: 90, y },
    end: { x: 200, y },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  
  page.drawText("Date:", {
    x: 320,
    y,
    size: 10,
    font: font,
  });
  
  page.drawLine({
    start: { x: 360, y },
    end: { x: 470, y },
    thickness: 1,
    color: rgb(0, 0, 0),
  });
  
  return y;
}
