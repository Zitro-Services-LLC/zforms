
export type ContractStatus = 'drafting' | 'submitted' | 'approved' | 'needs-update' | 'paid';

export interface Contract {
  id: string;
  title: string;
  customer_id: string;
  user_id: string;
  total_amount: number;
  status: ContractStatus;
  scope_of_work: string;
  created_at: string;
  updated_at: string;
  customer?: {
    first_name: string;
    last_name: string;
    email: string;
  };
}
