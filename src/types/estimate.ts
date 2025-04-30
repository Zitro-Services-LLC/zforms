
export interface LineItem {
  id: number;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface EstimateData {
  id: string;
  customer: any;
  items: LineItem[];
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  jobNumber?: string;
  jobDescription?: string;
}
