
import { Status } from "@/components/shared/StatusBadge";
import { PaymentMethod } from "./paymentMethod";

export interface PartyInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  id?: string;
}

export interface InvoiceLineItem {
  id: number;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Payment {
  id: number;
  date: string;
  amount: number;
  method: string;
  note: string;
}

export interface BankTransfer {
  accountName: string;
  accountNumber: string;
  routingNumber: string;
  bankName: string;
}

export interface PaymentInstructions {
  bankTransfer: BankTransfer;
  creditCard: string;
}

export interface InvoiceData {
  id: string;
  jobId: string;
  estimateId: string;
  contractId: string;
  status: Status;
  date: string;
  dueDate: string;
  contractor: PartyInfo;
  customer: PartyInfo;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentHistory: Payment[];
  balanceDue: number;
  paymentInstructions: PaymentInstructions;
}
