
import type { Database as GeneratedDatabase } from '@/integrations/supabase/types';
import type { ContractorLicense, Notification, NotificationPreferences, EstimateActivity, EstimateImage } from './database.d';

declare global {
  // Extending the Supabase Database type with our custom types
  type Database = GeneratedDatabase & {
    public: {
      Tables: {
        contractor_licenses: {
          Row: ContractorLicense;
          Insert: Omit<ContractorLicense, 'id' | 'created_at' | 'updated_at'>;
          Update: Partial<ContractorLicense>;
        };
        notifications: {
          Row: Notification;
          Insert: Omit<Notification, 'id' | 'created_at' | 'updated_at'>;
          Update: Partial<Notification>;
        };
        notification_preferences: {
          Row: NotificationPreferences;
          Insert: Omit<NotificationPreferences, 'created_at' | 'updated_at'>;
          Update: Partial<NotificationPreferences>;
        };
        estimate_activities: {
          Row: EstimateActivity;
          Insert: Omit<EstimateActivity, 'id' | 'created_at'>;
          Update: Partial<EstimateActivity>;
        };
        estimate_images: {
          Row: EstimateImage;
          Insert: Omit<EstimateImage, 'id' | 'created_at' | 'updated_at'>;
          Update: Partial<EstimateImage>;
        };
      };
    };
  };
}

// Make sure these extended types are imported correctly in client files
export {};
