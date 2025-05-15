
import { addDocumentHeader, CompanyInfo } from "../../../pdfHelpers.ts";

export async function addContractHeaderSection(
  page: any,
  width: number,
  height: number,
  boldFont: any,
  font: any,
  displayId: string,
  dates: { label: string, value: string }[],
  color: any,
  company?: CompanyInfo
) {
  // Add professional contract header with logo and company info
  return await addDocumentHeader(
    page,
    width,
    height,
    boldFont,
    font,
    'CONTRACT',
    displayId,
    dates,
    color,
    company
  );
}
