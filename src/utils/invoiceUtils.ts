import { InvoiceData, InvoiceWithDetails } from "@/services/invoice";
import { PartyInfo, Status } from "@/types";

export function mapInvoiceToUI(
  invoiceData: InvoiceWithDetails, 
  contractorData?: any
): InvoiceData {
  // Map the contractor info
  const contractor: PartyInfo = {
    name: contractorData?.company_name || "Your Company",
    address: contractorData?.company_address || "123 Main St, City, State",
    email: contractorData?.company_email || "contact@yourcompany.com",
    phone: contractorData?.company_phone || "555-123-4567",
  };

  // Map the customer info
  const customer: PartyInfo = {
    id: invoiceData.customer?.id || "",
    name: `${invoiceData.customer?.first_name || ""} ${invoiceData.customer?.last_name || ""}`.trim(),
    address: invoiceData.customer?.billing_address || "",
    email: invoiceData.customer?.email || "",
    phone: invoiceData.customer?.phone || "",
  };

  // Map line items
  const lineItems = invoiceData.items?.map(item => ({
    id: parseInt(item.id.toString().substring(0, 8), 16),
    description: item.description,
    quantity: Number(item.quantity),
    rate: Number(item.rate),
    amount: Number(item.amount),
  })) || [];

  // Map payment history
  const paymentHistory = invoiceData.payments?.map(payment => ({
    id: parseInt(payment.id.toString().substring(0, 8), 16),
    date: payment.payment_date,
    amount: Number(payment.amount),
    method: payment.payment_method || "Unknown",
    note: payment.notes || "",
  })) || [];

  // Placeholder for payment instructions (would come from contractor's settings)
  const paymentInstructions = {
    bankTransfer: {
      accountName: "Company LLC",
      accountNumber: "1234567890",
      routingNumber: "123456789",
      bankName: "National Bank",
    },
    creditCard: "Visa, Mastercard, American Express",
  };

  // Map invoice status with proper typing
  let status: Status;
  if (invoiceData.status === 'submitted') status = 'submitted';
  else if (invoiceData.status === 'paid') status = 'paid';
  else if (invoiceData.status === 'draft') status = 'drafting';
  else if (invoiceData.status === 'needs-update') status = 'needs-update';
  else status = 'drafting';

  return {
    id: invoiceData.id,
    jobId: invoiceData.invoice_number || "JOB-001",
    estimateId: "EST-001", // This should be fetched if needed
    contractId: invoiceData.contract_id || "",
    status,
    date: invoiceData.issue_date,
    dueDate: invoiceData.due_date,
    contractor,
    customer,
    lineItems,
    subtotal: Number(invoiceData.subtotal),
    tax: Number(invoiceData.tax_amount || 0),
    total: Number(invoiceData.total),
    paymentHistory,
    balanceDue: Number(invoiceData.balance_due || invoiceData.total),
    paymentInstructions,
  };
}

export function calculateInvoiceTotal(lineItems: any[]) {
  return lineItems.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
}
