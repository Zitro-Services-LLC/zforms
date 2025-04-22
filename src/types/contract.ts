
export type ContractStatus = 'drafting' | 'submitted' | 'approved' | 'needs-update' | 'paid';

export interface Contract {
  id: string;
  title: string;
  customer_id: string;
  user_id: string;
  estimate_id?: string | null;
  total_amount: number;
  status: ContractStatus;
  scope_of_work: string;
  terms_and_conditions?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  signed_by_contractor: boolean;
  signed_by_customer: boolean;
  contractor_signature_date?: string | null;
  customer_signature_date?: string | null;
  created_at: string;
  updated_at: string;
  customer?: {
    first_name: string;
    last_name: string;
    email: string;
  };
}
