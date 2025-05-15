
import { fetchEstimateData } from "./fetchEstimateData.ts";
import { renderEstimatePdf } from "./renderEstimatePdf.ts";

export async function generateEstimatePDF(supabase: any, estimateId: string, userId: string) {
  // 1. Fetch estimate data
  const estimateData = await fetchEstimateData(supabase, estimateId, userId);
  
  // 2. Generate PDF from estimate data
  return renderEstimatePdf(estimateData);
}
