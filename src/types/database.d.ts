export interface ContractorLicense {
  id: string;
  contractor_id: string;
  agency: string;
  license_no: string;
  issue_date: string;
  expiry_date: string;
  notification_sent_at?: string | null;
  notification_status?: 'pending' | 'sent' | 'acknowledged';
  created_at?: string;
  updated_at?: string;
}

export interface Notification {
  id: string;
  contractor_id: string;
  license_id?: string;
  type: 'warn60' | 'warn30' | 'warn7' | 'expired';
  level: 'info' | 'warning' | 'critical';
  payload?: Record<string, any>;
  created_at: string;
  updated_at: string;
  sent_at?: string | null;
  is_read: boolean;
}

export interface NotificationPreferences {
  contractor_id: string;
  email_enabled: boolean;
  in_app_enabled: boolean;
  sms_enabled: boolean;
  timezone: string;
}

export interface EstimateActivity {
  id: string;
  estimate_id: string;
  user_id: string;
  action_type: 'created' | 'updated' | 'status_changed' | 'viewed' | 'commented' | 'requested_changes' | 'sent' | 'exported';
  action_details?: Record<string, any>;
  created_at: string;
  ip_address?: string | null;
}

export interface EstimateImage {
  id: string;
  estimate_id: string;
  storage_path: string;
  file_name: string;
  size?: number;
  content_type?: string;
  created_at: string;
  updated_at: string;
  caption?: string;
}

export interface Database {
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
}
