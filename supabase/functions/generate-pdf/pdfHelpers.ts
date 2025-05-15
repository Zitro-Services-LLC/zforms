
import { rgb } from "https://esm.sh/pdf-lib@1.17.1";

// Export all helpers from the new files
export { DOCUMENT_COLORS } from "./helpers/colors.ts";
export type { CompanyInfo, CustomerInfo } from "./helpers/types.ts";
export { embedLogoIfExists } from "./helpers/imageUtils.ts";
export { addDocumentHeader } from "./helpers/headerUtils.ts";
export { addCustomerInfo } from "./helpers/customerUtils.ts";
export { addLineItemsHeader, addLineItems } from "./helpers/tableUtils.ts";
export { addTotals } from "./helpers/totalsUtils.ts";
export { addNotes } from "./helpers/notesUtils.ts";
export { addFooter } from "./helpers/footerUtils.ts";
