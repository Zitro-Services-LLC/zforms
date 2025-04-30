
import type { Database } from '@/integrations/supabase/types'
import type { LineItem } from '@/types/estimate'
import type { EstimateActivity, EstimateImage } from '@/types/database.d'

// Strongly-typed joined estimate + customer row
export type EstimateWithCustomer = Database['public']['Tables']['estimates']['Row'] & {
  customer: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone?: string | null;
    profile_image_url?: string | null;
    billing_address?: string | null;
    property_address?: string | null;
    same_as_billing?: boolean | null;
    created_at?: string | null;
    updated_at?: string | null;
    user_id?: string;
  } | null;
  contractor?: {
    id?: string;
    company_name?: string;
    company_address?: string | null;
    company_phone?: string | null;
    company_email?: string | null;
    logo_url?: string | null;
  } | null;
}

export interface CreateEstimateData {
  customer_id: string;
  user_id: string;
  title: string;
  date: string;
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  notes?: string;
  status: "draft" | "submitted";
  job_number?: string;
  job_description?: string;
}
