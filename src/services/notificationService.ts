import { supabase } from "@/integrations/supabase/client";
import type { Notification, NotificationPreferences } from "@/types/notification";

// Since we don't have a dedicated notifications table yet, we'll mock this functionality
let mockNotifications: Notification[] = [];
let mockUnreadCount = 0;

export const getNotifications = async (contractorId: string, limit = 10): Promise<Notification[]> => {
  try {
    // First try to get real notifications from database
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('contractor_id', contractorId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error("Error fetching notifications:", error);
      // Fall back to mock data
      return mockNotifications.filter(n => n.contractor_id === contractorId).slice(0, limit);
    }
    
    if (data && data.length > 0) {
      return data as Notification[];
    }
    
    // Fall back to mock data if no real notifications exist
    return mockNotifications.filter(n => n.contractor_id === contractorId).slice(0, limit);
  } catch (error) {
    console.error("Exception in getNotifications:", error);
    // Fall back to mock data
    return mockNotifications.filter(n => n.contractor_id === contractorId).slice(0, limit);
  }
};

export const getUnreadCount = async (contractorId: string): Promise<number> => {
  try {
    // Try to get real unread count from database
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('contractor_id', contractorId)
      .eq('is_read', false);
    
    if (error) {
      // Fall back to mock data
      return mockUnreadCount;
    }
    
    return count || 0;
  } catch (error) {
    console.error("Error in getUnreadCount:", error);
    // Fall back to mock data
    return mockUnreadCount;
  }
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
