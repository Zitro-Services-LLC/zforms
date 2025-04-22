
import { supabase } from "@/integrations/supabase/client";
import type { Notification, NotificationPreferences } from "@/types/notification";

export const getNotifications = async (contractorId: string, limit = 10): Promise<Notification[]> => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('contractor_id', contractorId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
};

export const getUnreadCount = async (contractorId: string): Promise<number> => {
  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('contractor_id', contractorId)
    .eq('is_read', false);

  if (error) throw error;
  return count || 0;
};

export const markAsRead = async (notificationId: string): Promise<void> => {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId);

  if (error) throw error;
};

export const markAllAsRead = async (contractorId: string): Promise<void> => {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('contractor_id', contractorId)
    .eq('is_read', false);

  if (error) throw error;
};

export const getNotificationPreferences = async (contractorId: string): Promise<NotificationPreferences> => {
  const { data, error } = await supabase
    .from('notification_preferences')
    .select('*')
    .eq('contractor_id', contractorId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // If no preferences exist yet, create default ones
      return createDefaultPreferences(contractorId);
    }
    throw error;
  }
  
  return data;
};

export const updateNotificationPreferences = async (
  contractorId: string, 
  preferences: Partial<NotificationPreferences>
): Promise<NotificationPreferences> => {
  const { data, error } = await supabase
    .from('notification_preferences')
    .update(preferences)
    .eq('contractor_id', contractorId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

const createDefaultPreferences = async (contractorId: string): Promise<NotificationPreferences> => {
  const defaultPreferences = {
    contractor_id: contractorId,
    email_enabled: true,
    in_app_enabled: true,
    sms_enabled: false,
    timezone: 'UTC'
  };

  const { data, error } = await supabase
    .from('notification_preferences')
    .insert(defaultPreferences)
    .select()
    .single();

  if (error) throw error;
  return data;
};
