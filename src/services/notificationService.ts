
import { supabase } from "@/integrations/supabase/client";
import type { Notification, NotificationPreferences } from "@/types/notification";

// Since we don't have a dedicated notifications table yet, we'll mock this functionality
let mockNotifications: Notification[] = [];
let mockUnreadCount = 0;

export const getNotifications = async (contractorId: string, limit = 10): Promise<Notification[]> => {
  // Return mock notifications for now
  return mockNotifications.filter(n => n.contractor_id === contractorId).slice(0, limit);
};

export const getUnreadCount = async (contractorId: string): Promise<number> => {
  // Return mock unread count
  return mockUnreadCount;
};

export const markAsRead = async (notificationId: string): Promise<void> => {
  // Find and mark notification as read in our mock data
  const notificationIndex = mockNotifications.findIndex(n => n.id === notificationId);
  if (notificationIndex >= 0) {
    mockNotifications[notificationIndex].is_read = true;
    mockUnreadCount = Math.max(0, mockUnreadCount - 1);
  }
};

export const markAllAsRead = async (contractorId: string): Promise<void> => {
  // Mark all notifications as read for this contractor
  mockNotifications = mockNotifications.map(n => 
    n.contractor_id === contractorId ? { ...n, is_read: true } : n
  );
  mockUnreadCount = 0;
};

export const getNotificationPreferences = async (contractorId: string): Promise<NotificationPreferences> => {
  // In the absence of a real preferences table, return default preferences
  return {
    contractor_id: contractorId,
    email_enabled: true,
    in_app_enabled: true,
    sms_enabled: false,
    timezone: 'UTC'
  };
};

export const updateNotificationPreferences = async (
  contractorId: string, 
  preferences: Partial<NotificationPreferences>
): Promise<NotificationPreferences> => {
  // In a production app, we would save these preferences to the database
  return {
    contractor_id: contractorId,
    email_enabled: preferences.email_enabled ?? true,
    in_app_enabled: preferences.in_app_enabled ?? true,
    sms_enabled: preferences.sms_enabled ?? false,
    timezone: preferences.timezone ?? 'UTC'
  };
};

// Initialize some mock notifications for development
export const initMockNotifications = (contractorId: string) => {
  mockNotifications = [
    {
      id: '1',
      contractor_id: contractorId,
      type: 'warn30',
      level: 'warning',
      payload: { license_no: 'LIC-1234', expiry_date: '2024-05-22', agency: 'State Board' },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      sent_at: new Date().toISOString(),
      is_read: false
    },
    {
      id: '2',
      contractor_id: contractorId,
      type: 'warn7',
      level: 'critical',
      payload: { license_no: 'LIC-5678', expiry_date: '2024-04-29', agency: 'County Office' },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      sent_at: new Date().toISOString(),
      is_read: false
    }
  ];
  mockUnreadCount = 2;
};
