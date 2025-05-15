
import { CustomerInfo, CompanyInfo } from "../../helpers/types.ts";

export interface EstimateData {
  title: string;
  date: string;
  expiry_date?: string;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  notes?: string;
  job_description?: string;
  customer: CustomerInfo;
  company: CompanyInfo;
  items: Array<{
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }>;
}

/**
 * Fetches all estimate data needed for PDF generation
 */
export async function fetchEstimateData(supabase: any, estimateId: string, userId: string): Promise<EstimateData> {
  console.log(`Fetching data for estimate ${estimateId}`);
  
  // Fetch the estimate data with all related information
  const { data: estimate, error: estimateError } = await supabase
    .from('estimates')
    .select(`
      *,
      customer:customers(
        id,
        first_name,
        last_name,
        email,
        phone,
        billing_address,
        property_address
      )
    `)
    .eq('id', estimateId)
    .eq('user_id', userId)
    .maybeSingle();

  if (estimateError) throw new Error(`Error fetching estimate: ${estimateError.message}`);
  if (!estimate) throw new Error(`Estimate not found: ${estimateId}`);
  
  // Fetch estimate items
  const { data: items, error: itemsError } = await supabase
    .from('estimate_items')
    .select('*')
    .eq('estimate_id', estimateId);
    
  if (itemsError) throw new Error(`Error fetching estimate items: ${itemsError.message}`);
  
  // Fetch contractor data
  const { data: contractor, error: contractorError } = await supabase
    .from('contractors')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (contractorError) throw new Error(`Error fetching contractor: ${contractorError.message}`);

  // Prepare company info
  const companyInfo: CompanyInfo = {
    name: contractor?.company_name || "Company Name",
    address: contractor?.company_address,
    phone: contractor?.company_phone,
    email: contractor?.company_email,
    logo_url: contractor?.logo_url
  };

  // Prepare customer info
  const customerInfo: CustomerInfo = {
    first_name: estimate.customer?.first_name || "",
    last_name: estimate.customer?.last_name || "",
    email: estimate.customer?.email,
    phone: estimate.customer?.phone,
    billing_address: estimate.customer?.billing_address,
    property_address: estimate.customer?.property_address
  };

  return {
    title: estimate.title || `EST-${estimateId.substring(0, 8)}`,
    date: estimate.date,
    expiry_date: estimate.expiry_date,
    subtotal: estimate.subtotal,
    tax_rate: estimate.tax_rate || 0,
    tax_amount: estimate.tax_amount || 0,
    total: estimate.total,
    notes: estimate.notes,
    job_description: estimate.job_description,
    customer: customerInfo,
    company: companyInfo,
    items: items || []
  };
}
