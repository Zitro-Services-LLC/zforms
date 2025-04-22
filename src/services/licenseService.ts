
import { supabase } from "@/integrations/supabase/client";
import type { ContractorLicense, LicenseFormData } from "@/types/license";

export const getContractorLicenses = async (contractorId: string): Promise<ContractorLicense[]> => {
  // Instead of querying a separate table, we'll maintain this interface
  // but adapt it to work with our existing data structure
  const { data, error } = await supabase
    .from('contractors')
    .select('*')
    .eq('user_id', contractorId);

  if (error) throw error;
  
  // Format the data to match our ContractorLicense interface
  // For now, we'll return a single license from contractor data
  const licenses: ContractorLicense[] = [];
  if (data && data.length > 0) {
    const contractor = data[0];
    if (contractor.license_number && contractor.license_expiry) {
      licenses.push({
        id: contractor.id,
        contractor_id: contractor.user_id,
        agency: 'State Agency', // Default value since we don't have this field
        license_no: contractor.license_number,
        issue_date: new Date().toISOString().split('T')[0], // Default to today
        expiry_date: contractor.license_expiry,
        notification_sent_at: null,
        notification_status: 'pending',
        created_at: contractor.created_at,
        updated_at: contractor.updated_at
      });
    }
  }
  
  return licenses;
};

export const addContractorLicense = async (contractorId: string, licenseData: LicenseFormData): Promise<ContractorLicense> => {
  // Update contractor with license information
  const { data, error } = await supabase
    .from('contractors')
    .update({
      license_number: licenseData.license_no,
      license_expiry: licenseData.expiry_date
    })
    .eq('user_id', contractorId)
    .select()
    .single();

  if (error) throw error;
  
  // Format the returned data to match our ContractorLicense interface
  return {
    id: data.id,
    contractor_id: data.user_id,
    agency: licenseData.agency,
    license_no: data.license_number,
    issue_date: licenseData.issue_date,
    expiry_date: data.license_expiry,
    notification_sent_at: null,
    notification_status: 'pending',
    created_at: data.created_at,
    updated_at: data.updated_at
  };
};

export const updateContractorLicense = async (licenseId: string, licenseData: Partial<LicenseFormData>): Promise<ContractorLicense> => {
  // Find the contractor by license ID (which is the contractor ID in this case)
  const { data, error } = await supabase
    .from('contractors')
    .update({
      license_number: licenseData.license_no,
      license_expiry: licenseData.expiry_date
    })
    .eq('id', licenseId)
    .select()
    .single();

  if (error) throw error;
  
  // Format the returned data to match our ContractorLicense interface
  return {
    id: data.id,
    contractor_id: data.user_id,
    agency: licenseData.agency || 'State Agency',
    license_no: data.license_number,
    issue_date: licenseData.issue_date || new Date().toISOString().split('T')[0],
    expiry_date: data.license_expiry,
    notification_sent_at: null,
    notification_status: 'pending',
    created_at: data.created_at,
    updated_at: data.updated_at
  };
};

export const deleteContractorLicense = async (licenseId: string): Promise<void> => {
  // Since we're storing license info in the contractor record,
  // we'll just clear the license fields rather than deleting the record
  const { error } = await supabase
    .from('contractors')
    .update({
      license_number: null,
      license_expiry: null
    })
    .eq('id', licenseId);

  if (error) throw error;
};
