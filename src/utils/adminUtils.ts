
import { supabase } from "@/integrations/supabase/client";

/**
 * Log an admin activity
 * @param adminId The admin user's ID
 * @param actionType The type of action (create, update, delete, etc.)
 * @param entityType The type of entity being acted upon (contractor, customer, etc.)
 * @param entityId Optional entity ID
 * @param actionDetails Optional details about the action
 * @returns 
 */
export async function logAdminActivity(
  adminId: string,
  actionType: string,
  entityType: string,
  entityId?: string,
  actionDetails?: Record<string, any>
) {
  try {
    const { data, error } = await supabase
      .from('admin_activities')
      .insert({
        admin_id: adminId,
        action_type: actionType,
        entity_type: entityType,
        entity_id: entityId,
        action_details: actionDetails,
      });
      
    if (error) {
      console.error("Error logging admin activity:", error);
      return { success: false, error };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error("Error logging admin activity:", error);
    return { success: false, error };
  }
}

/**
 * Get admin role for the current logged-in admin
 * @param adminId The admin user's ID
 * @returns The admin's role or null if not found
 */
export async function getAdminRole(adminId: string) {
  try {
    const { data, error } = await supabase
      .from('admin_profiles')
      .select('role')
      .eq('id', adminId)
      .single();
      
    if (error) {
      console.error("Error fetching admin role:", error);
      return null;
    }
    
    return data?.role;
  } catch (error) {
    console.error("Error fetching admin role:", error);
    return null;
  }
}

/**
 * Check if the current admin has super admin privileges
 * @param adminId The admin user's ID
 * @returns Boolean indicating super admin status
 */
export async function isSuperAdmin(adminId: string) {
  const role = await getAdminRole(adminId);
  return role === 'super_admin';
}

/**
 * Format admin name for display
 * @param firstName First name or null
 * @param lastName Last name or null
 * @param email Email as fallback
 * @returns Formatted name
 */
export function formatAdminName(
  firstName: string | null,
  lastName: string | null,
  email: string
) {
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  } else if (firstName) {
    return firstName;
  } else if (lastName) {
    return lastName;
  } else {
    return email.split('@')[0];
  }
}
