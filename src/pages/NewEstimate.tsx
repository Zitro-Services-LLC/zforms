
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/layouts/AppLayout';
import CustomerSelection from '../components/shared/CustomerSelection';
import EstimateLineItems from '../components/estimate/EstimateLineItems';
import EstimateTotals from '../components/estimate/EstimateTotals';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';

const NewEstimate = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([
    { id: 1, description: '', quantity: 0, rate: 0, amount: 0 }
  ]);

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

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
          <h1 className="text-2xl font-bold">New Estimate</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/estimates')}>
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
            <EstimateLineItems items={items} />
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setItems([...items, { id: items.length + 1, description: '', quantity: 0, rate: 0, amount: 0 }])}
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
                placeholder="Enter any additional notes or terms..."
                className="min-h-[100px]"
              />
            </div>
          </div>

          <EstimateTotals 
            subtotal={subtotal}
            tax={tax}
            total={total}
          />
        </div>
      </div>
    </AppLayout>
  );
};

export default NewEstimate;
