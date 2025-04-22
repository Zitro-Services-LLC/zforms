
import { supabase } from "@/integrations/supabase/client";
import type { Notification, NotificationPreferences } from "@/types/notification";

let mockNotifications: Notification[] = [];
let mockUnreadCount = 0;

export const getNotifications = async (contractorId: string, limit = 10): Promise<Notification[]> => {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('contractor_id', contractorId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error("Error fetching notifications:", error);
      return mockNotifications.filter(n => n.contractor_id === contractorId).slice(0, limit);
    }
    
    if (data && data.length > 0) {
      return data as Notification[];
    }
    
    return mockNotifications.filter(n => n.contractor_id === contractorId).slice(0, limit);
  } catch (error) {
    console.error("Exception in getNotifications:", error);
    return mockNotifications.filter(n => n.contractor_id === contractorId).slice(0, limit);
  }
};

export const getUnreadCount = async (contractorId: string): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('contractor_id', contractorId)
      .eq('is_read', false);
    
    if (error) {
      return mockUnreadCount;
    }
    
    return count || 0;
  } catch (error) {
    console.error("Error in getUnreadCount:", error);
    return mockUnreadCount;
  }
};

export const markAsRead = async (notificationId: string): Promise<void> => {
  try {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);
  } catch (error) {
    console.error("Error marking notification as read:", error);
    
    // Fallback to mock implementation
    const notificationIndex = mockNotifications.findIndex(n => n.id === notificationId);
    if (notificationIndex >= 0) {
      mockNotifications[notificationIndex].is_read = true;
      mockUnreadCount = Math.max(0, mockUnreadCount - 1);
    }
  }
};

export const markAllAsRead = async (contractorId: string): Promise<void> => {
  try {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('contractor_id', contractorId);
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    
    // Fallback to mock implementation
    mockNotifications = mockNotifications.map(n => 
      n.contractor_id === contractorId ? { ...n, is_read: true } : n
    );
    mockUnreadCount = 0;
  }
};

export const getNotificationPreferences = async (contractorId: string): Promise<NotificationPreferences> => {
  try {
    const { data, error } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('contractor_id', contractorId)
      .single();
    
    if (error || !data) {
      return {
        contractor_id: contractorId,
        email_enabled: true,
        in_app_enabled: true,
        sms_enabled: false,
        timezone: 'UTC'
      };
    }
    
    return data as NotificationPreferences;
  } catch (error) {
    console.error("Error fetching notification preferences:", error);
    
    return {
      contractor_id: contractorId,
      email_enabled: true,
      in_app_enabled: true,
      sms_enabled: false,
      timezone: 'UTC'
    };
  }
};

export const updateNotificationPreferences = async (
  contractorId: string, 
  preferences: Partial<NotificationPreferences>
): Promise<NotificationPreferences> => {
  const { data, error } = await supabase
    .from('notification_preferences')
    .upsert({
      contractor_id: contractorId,
      ...preferences
    })
    .select()
    .single();
    
  if (error) throw error;
  
  return data as NotificationPreferences;
};

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
