
export interface ContractorLicense {
  id: string;
  contractor_id: string;
  agency: string;
  license_no: string;
  issue_date: string;
  expiry_date: string;
  notification_sent_at?: string | null;
  notification_status?: 'pending' | 'sent' | 'acknowledged';
  created_at?: string;
  updated_at?: string;
}

export interface LicenseFormData {
  agency: string;
  license_no: string;
  issue_date: string;
  expiry_date: string;
}

export function getDaysUntilExpiry(expiryDate: string): number {
  const expiry = new Date(expiryDate);
  const today = new Date();
  const diffTime = expiry.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getLicenseStatus(expiryDate: string): 'valid' | 'warning' | 'expired' {
  const daysUntilExpiry = getDaysUntilExpiry(expiryDate);
  
  if (daysUntilExpiry < 0) return 'expired';
  if (daysUntilExpiry <= 30) return 'warning';
  return 'valid';
}
