
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { 
  getEstimateById, 
  getEstimateItems, 
  getEstimateImages,
  trackEstimateView
} from '@/services/estimateService';
import { EstimateData } from '@/types/estimate';
import { EstimateImage } from '@/types/database.d';

export function useEstimateData(id: string | undefined) {
  const { toast } = useToast();
  const { user } = useSupabaseAuth();
  
  const [estimate, setEstimate] = useState<EstimateData | null>(null);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<EstimateImage[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || !user) return;
    
    setLoading(true);
    setError(null);
    
    // Track this view
    trackEstimateView(id, user.id).catch(error => {
      console.error("Error tracking estimate view:", error);
    });
    
    // Load estimate data
    const fetchEstimateData = async () => {
      try {
        const estimateData = await getEstimateById(id);
        const items = await getEstimateItems(id);
        const estimateImages = await getEstimateImages(id);
        
        // Transform the data into the view model expected by components
        const viewModel: EstimateData = {
          id: estimateData.id,
          jobId: estimateData.job_number || undefined,
          status: estimateData.status,
          date: estimateData.date,
          contractor: {
            name: estimateData.contractor?.company_name || 'Unknown Company',
            address: estimateData.contractor?.company_address || 'No address provided',
            phone: estimateData.contractor?.company_phone || 'No phone provided',
            email: estimateData.contractor?.company_email || 'No email provided',
          },
          customer: {
            name: estimateData.customer ? 
              `${estimateData.customer.first_name} ${estimateData.customer.last_name}` : 
              'Unknown Customer',
            address: estimateData.customer?.billing_address || 'No address provided',
            phone: estimateData.customer?.phone || 'No phone provided',
            email: estimateData.customer?.email || 'No email provided',
          },
          description: estimateData.job_description || '',
          lineItems: items,
          subtotal: Number(estimateData.subtotal),
          tax: Number(estimateData.tax_amount || 0),
          total: Number(estimateData.total),
          notes: estimateData.notes || '',
          jobNumber: estimateData.job_number || undefined,
          jobDescription: estimateData.job_description || undefined
        };
        
        setEstimate(viewModel);
        setImages(estimateImages);
        
      } catch (error: any) {
        console.error("Error loading estimate data:", error);
        
        // More specific error message based on error type
        if (error.message?.includes("No rows returned")) {
          setError("Estimate not found. It may have been deleted or you don't have permission to view it.");
        } else if (error.code?.includes("PGRST")) {
          setError("Database error: There seems to be an issue with the estimate data structure. Please contact support.");
        } else {
          setError("Failed to load estimate data. Please try again later.");
        }
        
        toast({
          title: "Error",
          description: "Could not load estimate data.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchEstimateData();
  }, [id, user, toast]);

  return {
    estimate,
    loading,
    images,
    error
  };
}
