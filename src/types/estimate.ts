
import { Status } from '@/components/shared/StatusBadge';

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface EstimateParty {
  name: string;
  address: string;
  phone: string;
  email: string;
}

export interface EstimateData {
  id: string;
  jobId?: string;
  status: Status;
  date: string;
  contractor: EstimateParty;
  customer: EstimateParty;
  description?: string;
  lineItems: LineItem[];
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  jobNumber?: string;
  jobDescription?: string;
}

export type EstimateWithCustomerAndItems = EstimateData;
