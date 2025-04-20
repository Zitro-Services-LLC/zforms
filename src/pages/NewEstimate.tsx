
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '../components/layouts/AppLayout';
import CustomerSelection from '../components/shared/CustomerSelection';
import EditableEstimateLineItem from '../components/estimate/EditableEstimateLineItem';
import EstimateTotals from '../components/estimate/EstimateTotals';
import EstimatePreviewDialog from '../components/estimate/EstimatePreviewDialog';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Eye } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface LineItem {
  id: number;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

const NewEstimate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [items, setItems] = useState<LineItem[]>([
    { id: 1, description: '', quantity: 0, rate: 0, amount: 0 }
  ]);
  const [notes, setNotes] = useState('');
  const [estimateDate, setEstimateDate] = useState(new Date().toISOString().split('T')[0]);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handleUpdateLineItem = (id: number, field: keyof LineItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        updatedItem.amount = updatedItem.quantity * updatedItem.rate;
        return updatedItem;
      }
      return item;
    }));
  };

  const handleDeleteLineItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    } else {
      toast({
        title: "Cannot Delete",
        description: "At least one line item is required.",
      });
    }
  };

  const handleAddLineItem = () => {
    const newId = Math.max(...items.map(item => item.id)) + 1;
    setItems([...items, { id: newId, description: '', quantity: 0, rate: 0, amount: 0 }]);
  };

  const handleCustomerSelect = (customer: any) => {
    setSelectedCustomer(customer);
    toast({
      title: "Customer Selected",
      description: `Selected ${customer.name} for this estimate.`,
    });
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
            <Button variant="outline" onClick={() => setShowPreview(true)}>
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </Button>
            <Button>Save as Draft</Button>
          </div>
        </div>

        <div className="space-y-6 bg-white shadow-sm rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b pb-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="estimate-date">Estimate Date</Label>
                <Input
                  id="estimate-date"
                  type="date"
                  value={estimateDate}
                  onChange={(e) => setEstimateDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="reference">Reference Number</Label>
                <Input
                  id="reference"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  placeholder="Enter reference number"
                />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
              <CustomerSelection 
                onSelectCustomer={handleCustomerSelect}
                onAddNewCustomer={(customerData) => {
                  console.log('New customer data:', customerData);
                }}
              />
            </div>
          </div>

          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold mb-4">Line Items</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left">Description</th>
                    <th className="text-right">Quantity</th>
                    <th className="text-right">Rate</th>
                    <th className="text-right">Amount</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <EditableEstimateLineItem
                      key={item.id}
                      item={item}
                      onUpdate={handleUpdateLineItem}
                      onDelete={handleDeleteLineItem}
                    />
                  ))}
                </tbody>
              </table>
            </div>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={handleAddLineItem}
            >
              Add Line Item
            </Button>
          </div>

          <div className="border-b pb-6">
            <h2 className="text-lg font-semibold mb-4">Notes</h2>
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea 
                id="notes" 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
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

      <EstimatePreviewDialog
        open={showPreview}
        onOpenChange={setShowPreview}
        estimateData={{
          id: referenceNumber || 'Draft',
          customer: selectedCustomer,
          items,
          subtotal,
          tax,
          total,
          notes,
        }}
      />
    </AppLayout>
  );
};

export default NewEstimate;
