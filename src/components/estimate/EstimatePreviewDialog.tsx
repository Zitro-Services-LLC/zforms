
import React from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import EstimateHeader from './EstimateHeader';
import EstimatePartyInfo from './EstimatePartyInfo';
import EstimateLineItems from './EstimateLineItems';
import EstimateTotals from './EstimateTotals';
import { useContractorData } from '@/hooks/useContractorData';

interface EstimatePreviewProps {
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

const EstimatePreviewDialog: React.FC<EstimatePreviewProps> = ({
  open,
  onOpenChange,
  estimateData
}) => {
  const { loading: loadingContractor, contractorData } = useContractorData();
  
  const contractorParty = {
    name: contractorData?.companyName || "Your Company Name",
    address: contractorData?.companyAddress || "Your Company Address",
    phone: contractorData?.companyPhone || "Your Company Phone",
    email: contractorData?.companyEmail || "Your Company Email"
  };

  const customerParty = estimateData.customer ? {
    name: `${estimateData.customer.first_name} ${estimateData.customer.last_name}`,
    address: estimateData.customer.billing_address || '',
    phone: estimateData.customer.phone || '',
    email: estimateData.customer.email || ''
  } : {
    name: "Customer Name",
    address: "Customer Address",
    phone: "Customer Phone",
    email: "Customer Email"
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <div className="bg-white p-4 rounded-lg">
          <EstimateHeader
            id={estimateData.id}
            jobId="Preview"
            status="drafting"
            date={new Date().toISOString()}
            companyLogo={contractorData?.logo_url}
          />

          <EstimatePartyInfo
            contractor={contractorParty}
            customer={customerParty}
          />

          <EstimateLineItems items={estimateData.items} />

          <div className="p-6">
            {estimateData.notes && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Notes</h3>
                <p className="text-gray-600 whitespace-pre-line">{estimateData.notes}</p>
              </div>
            )}

            <EstimateTotals
              subtotal={estimateData.subtotal}
              tax={estimateData.tax}
              total={estimateData.total}
              taxRate={(estimateData.tax / estimateData.subtotal) * 100}
            />
          </div>

          <div className="flex justify-end mt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Close Preview
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EstimatePreviewDialog;
