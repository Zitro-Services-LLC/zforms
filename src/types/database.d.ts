
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
    };
  };
}
