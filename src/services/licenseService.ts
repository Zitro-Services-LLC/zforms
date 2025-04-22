
import { supabase } from "@/integrations/supabase/client";
import type { ContractorLicense, LicenseFormData } from "@/types/license";

export const getContractorLicenses = async (contractorId: string): Promise<ContractorLicense[]> => {
  const { data, error } = await supabase
    .from('contractor_licenses')
    .select('*')
    .eq('contractor_id', contractorId)
    .order('expiry_date', { ascending: true });

  if (error) throw error;
  return data || [];
};

export const addContractorLicense = async (contractorId: string, licenseData: LicenseFormData): Promise<ContractorLicense> => {
  const { data, error } = await supabase
    .from('contractor_licenses')
    .insert({
      contractor_id: contractorId,
      agency: licenseData.agency,
      license_no: licenseData.license_no,
      issue_date: licenseData.issue_date,
      expiry_date: licenseData.expiry_date,
      notification_status: 'pending'
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateContractorLicense = async (licenseId: string, licenseData: Partial<LicenseFormData>): Promise<ContractorLicense> => {
  const { data, error } = await supabase
    .from('contractor_licenses')
    .update(licenseData)
    .eq('id', licenseId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteContractorLicense = async (licenseId: string): Promise<void> => {
  const { error } = await supabase
    .from('contractor_licenses')
    .delete()
    .eq('id', licenseId);

  if (error) throw error;
};
