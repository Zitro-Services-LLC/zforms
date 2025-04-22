
import { supabase } from "@/integrations/supabase/client";
import type { ContractorLicense, LicenseFormData } from "@/types/license";

export const getContractorLicenses = async (contractorId: string): Promise<ContractorLicense[]> => {
  // Using string literals for table names to avoid type issues
  const { data, error } = await supabase
    .from('contractor_licenses')
    .select('*')
    .eq('contractor_id', contractorId);

  if (error) throw error;
  
  if (!data || data.length === 0) {
    return [];
  }
  
  // Since we're using a string literal above, we need to manually cast the result
  return data as unknown as ContractorLicense[];
};

export const addContractorLicense = async (contractorId: string, licenseData: LicenseFormData): Promise<ContractorLicense> => {
  const licenseEntry = {
    contractor_id: contractorId,
    agency: licenseData.agency,
    license_no: licenseData.license_no,
    issue_date: licenseData.issue_date,
    expiry_date: licenseData.expiry_date,
  };

  // Using string literals for table names to avoid type issues
  const { data, error } = await supabase
    .from('contractor_licenses')
    .insert(licenseEntry)
    .select()
    .single();

  if (error) throw error;
  
  // Cast the response to our type
  return data as unknown as ContractorLicense;
};

export const updateContractorLicense = async (licenseId: string, licenseData: Partial<LicenseFormData>): Promise<ContractorLicense> => {
  const updateData: any = {};
  
  if (licenseData.agency) updateData.agency = licenseData.agency;
  if (licenseData.license_no) updateData.license_no = licenseData.license_no;
  if (licenseData.issue_date) updateData.issue_date = licenseData.issue_date;
  if (licenseData.expiry_date) updateData.expiry_date = licenseData.expiry_date;

  // Using string literals for table names to avoid type issues
  const { data, error } = await supabase
    .from('contractor_licenses')
    .update(updateData)
    .eq('id', licenseId)
    .select()
    .single();

  if (error) throw error;
  
  // Cast the response to our type
  return data as unknown as ContractorLicense;
};

export const deleteContractorLicense = async (licenseId: string): Promise<void> => {
  // Using string literals for table names to avoid type issues
  const { error } = await supabase
    .from('contractor_licenses')
    .delete()
    .eq('id', licenseId);

  if (error) throw error;
};
