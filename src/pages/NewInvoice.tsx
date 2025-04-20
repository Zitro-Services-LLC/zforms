
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/layouts/AppLayout';
import CustomerSelection from '../components/shared/CustomerSelection';
import InvoiceLineItems from '../components/invoice/InvoiceLineItems';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';

const NewInvoice = () => {
  const navigate = useNavigate();
  const [lineItems, setLineItems] = useState([
    { id: 1, description: '', quantity: 0, rate: 0, amount: 0 }
  ]);

  const handleCustomerSelect = (customer: any) => {
    console.log('Selected customer:', customer);
  };

  const handleAddNewCustomer = (customerData: any) => {
    console.log('New customer data:', customerData);
  };

  return (
    <AppLayout userType="contractor">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">New Invoice</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/invoices')}>
              Cancel
            </Button>
            <Button>Save as Draft</Button>
          </div>
        </div>

        <div className="space-y-6 bg-white shadow-sm rounded-lg p-6">
          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
            <CustomerSelection 
              onSelectCustomer={handleCustomerSelect}
              onAddNewCustomer={handleAddNewCustomer}
            />
          </div>

          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold mb-4">Line Items</h2>
            <InvoiceLineItems lineItems={lineItems} />
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setLineItems([...lineItems, { id: lineItems.length + 1, description: '', quantity: 0, rate: 0, amount: 0 }])}
            >
              Add Line Item
            </Button>
          </div>

          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold mb-4">Notes</h2>
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea 
                id="notes" 
                placeholder="Enter any additional notes or payment terms..."
                className="min-h-[100px]"
              />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default NewInvoice;
