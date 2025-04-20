
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/layouts/AppLayout';
import CustomerSelection from '../components/shared/CustomerSelection';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';

const NewContract = () => {
  const navigate = useNavigate();

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
          <h1 className="text-2xl font-bold">New Contract</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate('/contracts')}>
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
            <h2 className="text-lg font-semibold mb-4">Contract Terms</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="scope">Scope of Work</Label>
                <Textarea 
                  id="scope" 
                  placeholder="Describe the scope of work..."
                  className="min-h-[100px]"
                />
              </div>
              <div>
                <Label htmlFor="terms">Terms and Conditions</Label>
                <Textarea 
                  id="terms" 
                  placeholder="Enter contract terms and conditions..."
                  className="min-h-[100px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default NewContract;
