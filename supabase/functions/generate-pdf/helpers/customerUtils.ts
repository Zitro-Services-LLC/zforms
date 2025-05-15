
import { CustomerInfo } from "./types.ts";

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
