
import React from 'react';
import DatePickerField from './DatePickerField';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ExistingCustomerSelector from '../shared/ExistingCustomerSelector';
import type { Customer } from '@/types/customer';
import { Textarea } from '@/components/ui/textarea';

interface EstimateDetailsSectionProps {
  estimateDate: string;
  referenceNumber: string;
  onDateChange: (value: string) => void;
  onReferenceChange: (value: string) => void;
  onCustomerSelect: (customer: Customer | null) => void;
  selectedCustomer: Customer | null;
  taxRate: number;
  onTaxRateChange: (value: number) => void;
  onAddNewCustomer?: (customer: Omit<Customer, 'id'>) => void;
  jobNumber?: string;
  jobDescription?: string;
  onJobNumberChange?: (value: string) => void;
  onJobDescriptionChange?: (value: string) => void;
  readOnly?: boolean;
}

const EstimateDetailsSection: React.FC<EstimateDetailsSectionProps> = ({
  estimateDate,
  referenceNumber,
  onDateChange,
  onReferenceChange,
  onCustomerSelect,
  selectedCustomer,
  taxRate,
  onTaxRateChange,
  onAddNewCustomer,
  jobNumber = '',
  jobDescription = '',
  onJobNumberChange,
  onJobDescriptionChange,
  readOnly = false
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Estimate Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="reference-number">Reference Number</Label>
            <Input
              id="reference-number"
              value={referenceNumber}
              onChange={(e) => onReferenceChange(e.target.value)}
              placeholder="Enter reference number"
              disabled={readOnly}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimate-date">Date</Label>
            <DatePickerField
              id="estimate-date"
              value={estimateDate}
              onChange={onDateChange}
              disabled={readOnly}
            />
          </div>

          {onJobNumberChange && (
            <div className="space-y-2">
              <Label htmlFor="job-number">Job Number</Label>
              <Input
                id="job-number"
                value={jobNumber}
                onChange={(e) => onJobNumberChange(e.target.value)}
                placeholder="Enter job number (optional)"
                disabled={readOnly}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="tax-rate">Tax Rate (%)</Label>
            <Input
              id="tax-rate"
              type="number"
              value={taxRate}
              onChange={(e) => onTaxRateChange(Number(e.target.value))}
              min={0}
              max={100}
              step={0.1}
              disabled={readOnly}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Customer</Label>
          <ExistingCustomerSelector
            onSelectCustomer={onCustomerSelect}
            selectedCustomer={selectedCustomer}
            onAddNewCustomer={onAddNewCustomer}
            disabled={readOnly}
          />
        </div>

        {onJobDescriptionChange && (
          <div className="space-y-2">
            <Label htmlFor="job-description">Job Description</Label>
            <Textarea
              id="job-description"
              value={jobDescription}
              onChange={(e) => onJobDescriptionChange(e.target.value)}
              placeholder="Enter job description (optional)"
              rows={3}
              disabled={readOnly}
              className="resize-none"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EstimateDetailsSection;
