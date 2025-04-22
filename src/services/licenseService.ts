
import { supabase } from "@/integrations/supabase/client";
import type { ContractorLicense } from "@/types/license";

export const updateContractorLicense = async (contractorId: string, licenseData: ContractorLicense) => {
  const { data, error } = await supabase
    .from('contractors')
    .update({
      license_number: licenseData.number,
      license_expiry: licenseData.expiryDate,
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
    .select('license_number, license_expiry')
    .eq('id', contractorId)
    .single();

  if (error) throw error;

  return {
    agency: '', // Agency field is not stored in the database
    number: data.license_number || '',
    issueDate: '', // Issue date field is not stored in the database
    expiryDate: data.license_expiry || '',
  };
};
