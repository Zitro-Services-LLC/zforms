
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';

interface InvoiceDetailsFormProps {
  dueDate: string;
  setDueDate: (date: string) => void;
  taxRate: number;
  setTaxRate: (rate: number) => void;
}

const InvoiceDetailsForm: React.FC<InvoiceDetailsFormProps> = ({
  dueDate,
  setDueDate,
  taxRate,
  setTaxRate
}) => {
  return (
    <div className="border-b pb-4">
      <h2 className="text-lg font-semibold mb-4">Invoice Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="issue-date">Issue Date</Label>
          <Input 
            id="issue-date" 
            type="date" 
            value={format(new Date(), 'yyyy-MM-dd')}
            disabled
            className="bg-gray-100"
          />
        </div>
        <div>
          <Label htmlFor="due-date">Due Date</Label>
          <Input 
            id="due-date" 
            type="date" 
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="tax-rate">Tax Rate (%)</Label>
          <Input 
            id="tax-rate" 
            type="number" 
            value={taxRate}
            onChange={(e) => setTaxRate(parseFloat(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailsForm;
