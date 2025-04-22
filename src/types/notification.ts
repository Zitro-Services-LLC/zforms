
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
