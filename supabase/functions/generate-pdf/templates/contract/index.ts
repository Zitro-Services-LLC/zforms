
import { fetchContractData } from "./fetchContractData.ts";
import { renderContractPdf } from "./renderContractPdf.ts";

export async function generateContractPDF(supabase: any, contractId: string, userId: string) {
  // 1. Fetch contract data
  const contractData = await fetchContractData(supabase, contractId, userId);
  
  // 2. Generate PDF from contract data
  return renderContractPdf(contractData);
}
