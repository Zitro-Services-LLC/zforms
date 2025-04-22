
import { supabase } from "@/integrations/supabase/client";
import type { ContractorLicense, LicenseFormData } from "@/types/license";

export const getContractorLicenses = async (contractorId: string): Promise<ContractorLicense[]> => {
  const { data, error } = await supabase
    .from('contractor_licenses')
    .select('*')
    .eq('contractor_id', contractorId);

  if (error) throw error;
  
  if (!data || data.length === 0) {
    return [];
  }
  
  // Map database rows to ContractorLicense objects
  return data.map(license => ({
    id: license.id,
    contractor_id: license.contractor_id,
    agency: license.agency,
    license_no: license.license_no,
    issue_date: license.issue_date,
    expiry_date: license.expiry_date,
    notification_sent_at: license.notification_sent_at,
    notification_status: license.notification_status || 'pending',
    created_at: license.created_at,
    updated_at: license.updated_at
  }));
};

export const addContractorLicense = async (contractorId: string, licenseData: LicenseFormData): Promise<ContractorLicense> => {
  const licenseEntry = {
    contractor_id: contractorId,
    agency: licenseData.agency,
    license_no: licenseData.license_no,
    issue_date: licenseData.issue_date,
    expiry_date: licenseData.expiry_date,
  };

  const { data, error } = await supabase
    .from('contractor_licenses')
    .insert(licenseEntry)
    .select()
    .single();

  if (error) throw error;
  
  return {
    id: data.id,
    contractor_id: data.contractor_id,
    agency: data.agency,
    license_no: data.license_no,
    issue_date: data.issue_date,
    expiry_date: data.expiry_date,
    notification_sent_at: data.notification_sent_at,
    notification_status: data.notification_status || 'pending',
    created_at: data.created_at,
    updated_at: data.updated_at
  };
};

export const updateContractorLicense = async (licenseId: string, licenseData: Partial<LicenseFormData>): Promise<ContractorLicense> => {
  const updateData: any = {};
  
  if (licenseData.agency) updateData.agency = licenseData.agency;
  if (licenseData.license_no) updateData.license_no = licenseData.license_no;
  if (licenseData.issue_date) updateData.issue_date = licenseData.issue_date;
  if (licenseData.expiry_date) updateData.expiry_date = licenseData.expiry_date;

  const { data, error } = await supabase
    .from('contractor_licenses')
    .update(updateData)
    .eq('id', licenseId)
    .select()
    .single();

  if (error) throw error;
  
  return {
    id: data.id,
    contractor_id: data.contractor_id,
    agency: data.agency,
    license_no: data.license_no,
    issue_date: data.issue_date,
    expiry_date: data.expiry_date,
    notification_sent_at: data.notification_sent_at,
    notification_status: data.notification_status || 'pending',
    created_at: data.created_at,
    updated_at: data.updated_at
  };
};

export const deleteContractorLicense = async (licenseId: string): Promise<void> => {
  const { error } = await supabase
    .from('contractor_licenses')
    .delete()
    .eq('id', licenseId);

  if (error) throw error;
};
