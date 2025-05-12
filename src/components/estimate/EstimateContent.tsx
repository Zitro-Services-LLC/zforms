
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import EstimatePartyInfo from './EstimatePartyInfo';
import EstimateLineItems from './EstimateLineItems';
import EstimateTotals from './EstimateTotals';
import EstimateActivities from './EstimateActivities';
import { Status } from '../shared/StatusBadge';
import { EstimateData } from '@/types/estimate';

interface EstimateContentProps {
  estimate: EstimateData;
  customer: any;
  status: Status;
  activities: any[];
  loadingActivities: boolean;
}

const EstimateContent: React.FC<EstimateContentProps> = ({
  estimate,
  customer,
  status,
  activities,
  loadingActivities,
}) => {
  return (
    <Tabs defaultValue="details" className="p-6">
      <TabsList className="mb-6">
        <TabsTrigger value="details">Estimate Details</TabsTrigger>
        <TabsTrigger value="activity">Activity History</TabsTrigger>
      </TabsList>
      
      <TabsContent value="details" className="space-y-6">
        <EstimatePartyInfo
          contractor={estimate.contractor}
          customer={estimate.customer}
        />

        <div className="px-2 document-section">
          <h2 className="text-sm font-semibold text-gray-500 mb-2">JOB DESCRIPTION</h2>
          <p className="text-base text-gray-900 whitespace-pre-line">{estimate.description}</p>
        </div>

        <EstimateLineItems items={estimate.lineItems} />
        
        <EstimateTotals
          subtotal={estimate.subtotal}
          tax={estimate.tax}
          total={estimate.total}
        />

        <div className="pt-4 border-t">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-3">CONTRACTOR SIGNATURE</h3>
              <div className="h-20 bg-gray-50 border border-gray-200 rounded flex items-center justify-center">
                <span className="text-gray-400 italic">Electronically signed by Bob Builder</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-3">CUSTOMER SIGNATURE</h3>
              <div className="h-20 bg-gray-50 border border-gray-200 rounded flex items-center justify-center">
                {status === 'approved' ? (
                  <span className="text-gray-400 italic">Electronically signed by {customer.name}</span>
                ) : (
                  <span className="text-gray-400 italic">Awaiting signature</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="activity">
        <div className="bg-white rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Activity Timeline</h3>
          
          <Separator className="my-4" />
          
          {loadingActivities ? (
            <div className="py-8 text-center text-gray-500">
              <p>Loading activity history...</p>
            </div>
          ) : (
            <EstimateActivities activities={activities} />
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default EstimateContent;
