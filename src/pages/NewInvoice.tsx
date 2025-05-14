
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/layouts/AppLayout';
import { Button } from '../components/ui/button';
import { format } from 'date-fns';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { toast } from '@/hooks/use-toast';
import type { Customer } from '@/types/customer';
import { useInvoices } from '@/hooks/useInvoices';
import InvoiceCustomerSection from '@/components/invoice/InvoiceCustomerSection';
import InvoiceDetailsForm from '@/components/invoice/InvoiceDetailsForm';
import InvoiceLineItemsForm from '@/components/invoice/InvoiceLineItemsForm';
import InvoiceNotesSection from '@/components/invoice/InvoiceNotesSection';
import InvoiceTotalsDisplay from '@/components/invoice/InvoiceTotalsDisplay';
import type { InvoiceLineItem } from '@/types/invoice';

const NewInvoice = () => {
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  const { createMutation } = useInvoices();
  
  const [customer, setCustomer] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState<string>(
    format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd')
  );
  const [notes, setNotes] = useState<string>('');
  const [lineItems, setLineItems] = useState<InvoiceLineItem[]>([
    { id: 1, description: '', quantity: 1, rate: 0, amount: 0 }
  ]);
  const [taxRate, setTaxRate] = useState<number>(8);
  
  const handleCustomerSelect = (customerData: Customer | null) => {
    setCustomer(customerData?.id || null);
  };

  const handleAddNewCustomer = (customerData: any) => {
    toast({
      title: "New Customer",
      description: "Please add the customer first in the Customers section."
    });
  };

  const handleSubmit = () => {
    if (!customer) {
      toast({
        title: "Customer Required",
        description: "Please select a customer for this invoice.",
        variant: "destructive"
      });
      return;
    }

    if (lineItems.length === 0 || lineItems.some(item => !item.description)) {
      toast({
        title: "Line Items Required",
        description: "Please add at least one line item with a description.",
        variant: "destructive"
      });
      return;
    }

    createMutation.mutate({
      customer_id: customer,
      issue_date: format(new Date(), 'yyyy-MM-dd'),
      due_date: dueDate,
      notes,
      items: lineItems,
      tax_rate: taxRate
    }, {
      onSuccess: (data: { id: string }) => {
        navigate(`/invoices/${data.id}`);
      }
    });
  };

  return (
    <AppLayout userType="contractor">
      <div className="container mx-auto p-6">
        {/* Header section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">New Invoice</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/invoices')}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creating...' : 'Save Invoice'}
            </Button>
          </div>
        </div>

        <div className="space-y-6 bg-white shadow-sm rounded-lg p-6">
          {/* Customer section */}
          <InvoiceCustomerSection
            onSelectCustomer={handleCustomerSelect}
            onAddNewCustomer={handleAddNewCustomer}
          />
          
          {/* Invoice details section */}
          <InvoiceDetailsForm 
            dueDate={dueDate}
            setDueDate={setDueDate}
            taxRate={taxRate}
            setTaxRate={setTaxRate}
          />

          {/* Line items section */}
          <InvoiceLineItemsForm
            lineItems={lineItems}
            setLineItems={setLineItems}
          />

          {/* Totals display section */}
          <InvoiceTotalsDisplay 
            lineItems={lineItems}
            taxRate={taxRate}
          />

          {/* Notes section */}
          <InvoiceNotesSection
            notes={notes}
            setNotes={setNotes}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default NewInvoice;
