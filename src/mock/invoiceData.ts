
import { Status } from "../components/shared/StatusBadge";
import type { InvoiceData, PaymentMethod } from "@/types";

export const mockInvoiceData: InvoiceData = {
  id: 'I-101',
  jobId: 'JOB-00123',
  estimateId: 'E-101',
  contractId: 'C-101',
  status: 'submitted' as Status,
  date: '2023-04-20',
  dueDate: '2023-05-05',
  contractor: {
    name: 'Bob\'s Construction',
    address: '123 Builder St, Construction City, CC 12345',
    phone: '(555) 123-4567',
    email: 'bob@bobconstruction.com'
  },
  customer: {
    name: 'Alice Smith',
    address: '456 Home Ave, Hometown, HT 67890',
    phone: '(555) 987-6543',
    email: 'alice@example.com'
  },
  lineItems: [
    { id: 1, description: 'Kitchen Cabinets - Premium Cherry', quantity: 1, rate: 7500, amount: 7500 },
    { id: 2, description: 'Countertops - Granite, 45 sq ft', quantity: 45, rate: 75, amount: 3375 },
    { id: 3, description: 'Flooring - Luxury Vinyl Tile, 200 sq ft', quantity: 200, rate: 10, amount: 2000 },
    { id: 4, description: 'Labor - Installation', quantity: 40, rate: 85, amount: 3400 }
  ],
  subtotal: 16275,
  tax: 1302,
  total: 17577,
  paymentHistory: [
    { id: 1, date: '2023-04-15', amount: 4394.25, method: 'Credit Card', note: 'Deposit (25%)' }
  ],
  balanceDue: 13182.75,
  paymentInstructions: {
    bankTransfer: {
      accountName: 'Bob\'s Construction LLC',
      accountNumber: '1234567890',
      routingNumber: '123456789',
      bankName: 'Builder\'s Bank'
    },
    creditCard: 'Secure online payment available via provided link'
  }
};

export const mockCustomerPaymentMethods: PaymentMethod[] = [
  {
    id: 'cust-card-1',
    type: 'credit_card',
    cardLast4: '4242',
    cardExpMonth: 12,
    cardExpYear: 2025,
    cardBrand: 'visa',
    isPrimary: true
  },
  {
    id: 'cust-bank-1',
    type: 'bank_account',
    bankName: 'Chase Bank',
    accountLast4: '9876',
    isPrimary: false
  }
];
