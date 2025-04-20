
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import CustomerSelection from '../shared/CustomerSelection';
import DatePickerField from './DatePickerField';

interface EstimateDetailsSectionProps {
  estimateDate: string;
  referenceNumber: string;
  onDateChange: (date: string) => void;
  onReferenceChange: (reference: string) => void;
  onCustomerSelect: (customer: any) => void;
  selectedCustomer: any;
}

const EstimateDetailsSection: React.FC<EstimateDetailsSectionProps> = ({
  estimateDate,
  referenceNumber,
  onDateChange,
  onReferenceChange,
  onCustomerSelect,
  selectedCustomer,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-6">
      <div className="space-y-4">
        <DatePickerField
          label="Estimate Date"
          value={estimateDate}
          onChange={onDateChange}
        />
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
            // No-op, managed in parent
          }}
        />
        {selectedCustomer && (
          <div className="mt-2 text-xs text-green-700 bg-green-50 px-2 py-1 rounded">
            Selected: <span className="font-semibold">{selectedCustomer.name}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EstimateDetailsSection;

