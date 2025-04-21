
import React from 'react';
import DatePickerField from './DatePickerField';
import { Input } from "@/components/ui/input";
import CustomerSelection from '@/components/shared/CustomerSelection';
import type { Customer } from '@/types/customer';

interface EstimateDetailsSectionProps {
  estimateDate: string;
  referenceNumber: string;
  selectedCustomer: Customer | null;
  taxRate: number;
  onDateChange: (date: string) => void;
  onReferenceChange: (reference: string) => void;
  onCustomerSelect: (customer: Customer | null) => void;
  onTaxRateChange: (taxRate: number) => void;
  onAddNewCustomer: (customerData: Omit<Customer, 'id'>) => void;
}

const EstimateDetailsSection: React.FC<EstimateDetailsSectionProps> = ({
  estimateDate,
  referenceNumber,
  selectedCustomer,
  taxRate,
  onDateChange,
  onReferenceChange,
  onCustomerSelect,
  onTaxRateChange,
  onAddNewCustomer
}) => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Estimate Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="mb-4">
            <label htmlFor="reference" className="block text-sm font-medium text-gray-700 mb-1">
              Reference/Estimate #
            </label>
            <Input
              id="reference"
              value={referenceNumber}
              onChange={(e) => onReferenceChange(e.target.value)}
              placeholder="EST-20250101-001"
              className="w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Estimate Date
            </label>
            <DatePickerField
              id="date"
              selectedDate={estimateDate}
              onDateChange={onDateChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="tax-rate" className="block text-sm font-medium text-gray-700 mb-1">
              Tax Rate (%)
            </label>
            <Input
              id="tax-rate"
              type="number"
              value={taxRate}
              onChange={(e) => onTaxRateChange(parseFloat(e.target.value))}
              min="0"
              max="100"
              step="0.01"
              className="w-full"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Customer
          </label>
          <CustomerSelection
            onSelectCustomer={onCustomerSelect}
            onAddNewCustomer={onAddNewCustomer}
          />
        </div>
      </div>
    </div>
  );
};

export default EstimateDetailsSection;
