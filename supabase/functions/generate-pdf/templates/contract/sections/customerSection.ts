
import { addCustomerInfo, CustomerInfo } from "../../../pdfHelpers.ts";

export function addContractCustomerSection(
  page: any,
  contentStartY: number,
  boldFont: any,
  font: any,
  customer: CustomerInfo
) {
  // Add customer information (full width)
  return addCustomerInfo(
    page,
    contentStartY,
    boldFont,
    font,
    "CUSTOMER",
    customer
  );
}
