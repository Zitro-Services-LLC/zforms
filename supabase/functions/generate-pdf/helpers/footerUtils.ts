
import { rgb } from "https://esm.sh/pdf-lib@1.17.1";

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
