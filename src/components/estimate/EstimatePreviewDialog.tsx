
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Eye } from "lucide-react";

interface EstimatePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  estimateData: {
    id: string;
    customer: any;
    items: any[];
    subtotal: number;
    tax: number;
    total: number;
    notes?: string;
  };
}

const EstimatePreviewDialog: React.FC<EstimatePreviewDialogProps> = ({
  open,
  onOpenChange,
  estimateData,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Estimate Preview
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <Card className="p-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">From</h3>
                <p className="text-sm text-muted-foreground">
                  Your Company Name<br />
                  123 Business Street<br />
                  City, State ZIP
                </p>
              </div>
              
              {estimateData.customer && (
                <div>
                  <h3 className="font-semibold mb-2">To</h3>
                  <p className="text-sm text-muted-foreground">
                    {estimateData.customer.name}<br />
                    {estimateData.customer.billingAddress}
                  </p>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Description</th>
                  <th className="text-right py-2">Quantity</th>
                  <th className="text-right py-2">Rate</th>
                  <th className="text-right py-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {estimateData.items.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="py-2">{item.description}</td>
                    <td className="text-right py-2">{item.quantity}</td>
                    <td className="text-right py-2">${item.rate}</td>
                    <td className="text-right py-2">${(item.quantity * item.rate).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t">
                  <td colSpan={3} className="text-right py-2">Subtotal:</td>
                  <td className="text-right py-2">${estimateData.subtotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colSpan={3} className="text-right py-2">Tax (8%):</td>
                  <td className="text-right py-2">${estimateData.tax.toFixed(2)}</td>
                </tr>
                <tr className="font-bold">
                  <td colSpan={3} className="text-right py-2">Total:</td>
                  <td className="text-right py-2">${estimateData.total.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </Card>

          {estimateData.notes && (
            <Card className="p-6">
              <h3 className="font-semibold mb-2">Notes</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {estimateData.notes}
              </p>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EstimatePreviewDialog;
