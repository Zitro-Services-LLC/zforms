
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { getEstimateActivities, trackEstimateActivity } from '@/services/estimateService';

export function useEstimateActivities(id: string | undefined, userId: string | undefined) {
  const { toast } = useToast();
  const [activities, setActivities] = useState<any[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(false);

  // Load activities history
  useEffect(() => {
    if (id && userId) {
      setLoadingActivities(true);
      
      getEstimateActivities(id)
        .then(data => {
          setActivities(data);
        })
        .catch(error => {
          console.error("Error loading estimate activities:", error);
          toast({
            title: "Error",
            description: "Could not load estimate activity history.",
            variant: "destructive"
          });
        })
        .finally(() => {
          setLoadingActivities(false);
        });
    }
  }, [id, userId, toast]);

  // Function to track a new activity
  const trackActivity = (activityType: string, metadata?: any) => {
    if (id && userId) {
      return trackEstimateActivity(id, userId, activityType, metadata);
    }
    return Promise.reject("Missing estimate ID or user ID");
  };

  return {
    activities,
    loadingActivities,
    trackActivity
  };
}
