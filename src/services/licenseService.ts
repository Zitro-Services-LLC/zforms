
import { supabase } from "@/integrations/supabase/client";
import type { ContractorLicense } from "@/types/license";

export const updateContractorLicense = async (contractorId: string, licenseData: ContractorLicense) => {
  const { data, error } = await supabase
    .from('contractors')
    .update({
      license_agency: licenseData.agency,
      license_number: licenseData.number,
      license_issue_date: licenseData.issueDate,
      license_expiry_date: licenseData.expiryDate,
    })
    .eq('id', contractorId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getContractorLicense = async (contractorId: string) => {
  const { data, error } = await supabase
    .from('contractors')
    .select('license_agency, license_number, license_issue_date, license_expiry_date')
    .eq('id', contractorId)
    .single();

  if (error) throw error;

  return {
    agency: data.license_agency || '',
    number: data.license_number || '',
    issueDate: data.license_issue_date || '',
    expiryDate: data.license_expiry_date || '',
  };
};
