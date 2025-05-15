
// Types for our helpers
export interface CompanyInfo {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  logo_url?: string;
}

export interface CustomerInfo {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  billing_address?: string;
  property_address?: string;
}
