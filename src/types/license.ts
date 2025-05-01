
export interface ContractorLicense {
  id: string;
  contractor_id: string;
  agency: string;
  license_no: string;
  issue_date: string;
  expiry_date: string;
  created_at?: string;
  updated_at?: string;
  notification_status?: 'pending' | 'sent' | 'acknowledged';
  notification_sent_at?: string | null;
}

export interface LicenseFormData {
  agency: string;
  license_no: string;
  issue_date: string;
  expiry_date: string;
}

export interface ContractorLogoData {
  file: File | null;
  previewUrl: string | null;
}

// Function to calculate days until license expiry
export const getDaysUntilExpiry = (expiryDate: string): number => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert ms to days
};

// Function to get license status
export const getLicenseStatus = (expiryDate: string): 'valid' | 'expiring' | 'expired' => {
  const daysUntilExpiry = getDaysUntilExpiry(expiryDate);
  
  if (daysUntilExpiry < 0) return 'expired';
  if (daysUntilExpiry <= 30) return 'expiring';
  return 'valid';
};
