
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import CustomerSelection from '../shared/CustomerSelection';

interface EstimateDetailsSectionProps {
  estimateDate: string;
  referenceNumber: string;
  onDateChange: (date: string) => void;
  onReferenceChange: (reference: string) => void;
  onCustomerSelect: (customer: any) => void;
}

const EstimateDetailsSection: React.FC<EstimateDetailsSectionProps> = ({
  estimateDate,
  referenceNumber,
  onDateChange,
  onReferenceChange,
  onCustomerSelect,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="estimate-date">Estimate Date</Label>
          <Input
            id="estimate-date"
            type="date"
            value={estimateDate}
            onChange={(e) => onDateChange(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="reference">Reference Number</Label>
          <Input
            id="reference"
            value={referenceNumber}
            onChange={(e) => onReferenceChange(e.target.value)}
            placeholder="Enter reference number"
          />
        </div>
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
        <CustomerSelection 
          onSelectCustomer={onCustomerSelect}
          onAddNewCustomer={(customerData) => {
            console.log('New customer data:', customerData);
          }}
        />
      </div>
    </div>
  );
};

export default EstimateDetailsSection;
