
interface Database {
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
