
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/layouts/AppLayout';
import CustomerSelection from '../components/shared/CustomerSelection';
import InvoiceLineItems from '../components/invoice/InvoiceLineItems';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { useInvoices } from '@/hooks/useInvoices';
import { calculateInvoiceTotal } from '@/utils/invoiceUtils';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

const NewInvoice = () => {
  const navigate = useNavigate();
  const { createMutation } = useInvoices();
  
  const [customer, setCustomer] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState<string>(
    format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd')
  );
  const [notes, setNotes] = useState<string>('');
  const [lineItems, setLineItems] = useState([
    { id: 1, description: '', quantity: 1, rate: 0, amount: 0 }
  ]);
  const [taxRate, setTaxRate] = useState<number>(8);
  
  const subtotal = calculateInvoiceTotal(lineItems);
  const tax = subtotal * (taxRate / 100);
  const total = subtotal + tax;

  const handleCustomerSelect = (customerData: any) => {
    setCustomer(customerData.id);
  };

  const handleAddNewCustomer = (customerData: any) => {
    toast({
      title: "New Customer",
      description: "Please add the customer first in the Customers section."
    });
  };

  const handleLineItemChange = (index: number, field: string, value: any) => {
    const newLineItems = [...lineItems];
    
    if (field === 'quantity' || field === 'rate') {
      const quantity = field === 'quantity' ? parseFloat(value) : parseFloat(newLineItems[index].quantity.toString());
      const rate = field === 'rate' ? parseFloat(value) : parseFloat(newLineItems[index].rate.toString());
      newLineItems[index] = {
        ...newLineItems[index],
        [field]: value,
        amount: quantity * rate
      };
    } else {
      newLineItems[index] = {
        ...newLineItems[index],
        [field]: value
      };
    }
    
    setLineItems(newLineItems);
  };

  const addLineItem = () => {
    setLineItems([
      ...lineItems, 
      { 
        id: Date.now(), 
        description: '', 
        quantity: 1, 
        rate: 0, 
        amount: 0 
      }
    ]);
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
          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
            <CustomerSelection 
              onSelectCustomer={handleCustomerSelect}
              onAddNewCustomer={handleAddNewCustomer}
            />
          </div>

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

          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold mb-4">Line Items</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-2">Description</th>
                    <th className="text-right p-2 w-24">Quantity</th>
                    <th className="text-right p-2 w-24">Rate</th>
                    <th className="text-right p-2 w-24">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {lineItems.map((item, index) => (
                    <tr key={item.id} className="border-t">
                      <td className="p-2">
                        <Input 
                          value={item.description} 
                          onChange={(e) => handleLineItemChange(index, 'description', e.target.value)}
                          placeholder="Description"
                        />
                      </td>
                      <td className="p-2">
                        <Input 
                          type="number" 
                          value={item.quantity} 
                          onChange={(e) => handleLineItemChange(index, 'quantity', e.target.value)}
                          className="text-right"
                          min="1"
                        />
                      </td>
                      <td className="p-2">
                        <Input 
                          type="number" 
                          value={item.rate} 
                          onChange={(e) => handleLineItemChange(index, 'rate', e.target.value)}
                          className="text-right"
                          min="0"
                          step="0.01"
                        />
                      </td>
                      <td className="p-2 text-right">
                        ${item.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t">
                    <td colSpan={4} className="p-2">
                      <Button 
                        variant="outline" 
                        onClick={addLineItem}
                        className="w-full"
                      >
                        Add Line Item
                      </Button>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan={2}></td>
                    <td className="text-right p-2 font-medium">Subtotal:</td>
                    <td className="text-right p-2">${subtotal.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan={2}></td>
                    <td className="text-right p-2 font-medium">Tax ({taxRate}%):</td>
                    <td className="text-right p-2">${tax.toFixed(2)}</td>
                  </tr>
                  <tr className="font-medium">
                    <td colSpan={2}></td>
                    <td className="text-right p-2">Total:</td>
                    <td className="text-right p-2">${total.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Notes</h2>
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea 
                id="notes" 
                placeholder="Enter any additional notes or payment terms..."
                className="min-h-[100px]"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default NewInvoice;
