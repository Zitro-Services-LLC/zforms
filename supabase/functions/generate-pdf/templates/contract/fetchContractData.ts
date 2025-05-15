
import { CustomerInfo, CompanyInfo } from "../../helpers/types.ts";

export interface ContractData {
  display_id: string;
  title: string;
  start_date?: string;
  end_date?: string;
  scope_of_work?: string;
  terms_and_conditions?: string;
  total_amount: number;
  notes?: string;
  customer: CustomerInfo;
  company: CompanyInfo;
}

/**
 * Fetches all contract data needed for PDF generation
 */
export async function fetchContractData(supabase: any, contractId: string, userId: string): Promise<ContractData> {
  console.log(`Fetching data for contract ${contractId}`);
  
  // Fetch the contract data with all related information
  const { data: contract, error: contractError } = await supabase
    .from('contracts')
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
    .eq('id', contractId)
    .eq('user_id', userId)
    .maybeSingle();

  if (contractError) throw new Error(`Error fetching contract: ${contractError.message}`);
  if (!contract) throw new Error(`Contract not found: ${contractId}`);
  
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
    first_name: contract.customer?.first_name || "",
    last_name: contract.customer?.last_name || "",
    email: contract.customer?.email,
    phone: contract.customer?.phone,
    billing_address: contract.customer?.billing_address,
    property_address: contract.customer?.property_address
  };

  return {
    display_id: contract.display_id || contractId.substring(0, 8),
    title: contract.title || "Contract Agreement",
    start_date: contract.start_date,
    end_date: contract.end_date,
    scope_of_work: contract.scope_of_work,
    terms_and_conditions: contract.terms_and_conditions,
    total_amount: contract.total_amount || 0,
    customer: customerInfo,
    company: companyInfo
  };
}
