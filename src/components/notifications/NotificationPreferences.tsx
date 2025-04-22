
import React, { useState, useEffect } from 'react';
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { useToast } from "@/hooks/use-toast";
import { getNotificationPreferences, updateNotificationPreferences } from "@/services/notificationService";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { NotificationPreferences as NotificationPrefsType } from "@/types/notification";

export const NotificationPreferences: React.FC = () => {
  const { user } = useSupabaseAuth();
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<NotificationPrefsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchPreferences = async () => {
      try {
        setLoading(true);
        const data = await getNotificationPreferences(user.id);
        setPreferences(data);
      } catch (error) {
        console.error("Error fetching notification preferences:", error);
        toast({
          title: "Error",
          description: "Failed to load notification preferences",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, [user, toast]);

  const handleTogglePreference = (field: keyof NotificationPrefsType, value: boolean) => {
    if (!preferences) return;
    
    setPreferences({
      ...preferences,
      [field]: value
    });
  };

  const handleSavePreferences = async () => {
    if (!user || !preferences) return;
    
    try {
      setSaving(true);
      await updateNotificationPreferences(user.id, {
        email_enabled: preferences.email_enabled,
        in_app_enabled: preferences.in_app_enabled,
        sms_enabled: preferences.sms_enabled
      });
      
      toast({
        title: "Success",
        description: "Notification preferences updated successfully"
      });
    } catch (error) {
      console.error("Error updating notification preferences:", error);
      toast({
        title: "Error",
        description: "Failed to update notification preferences",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading preferences...</div>;
  }

  if (!preferences) {
    return <div className="text-center py-4 text-red-500">Failed to load preferences</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Notification Preferences</h2>
      
      <div className="space-y-4 bg-white p-4 rounded-md border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Email Notifications</h3>
            <p className="text-sm text-gray-500">Receive notifications via email</p>
          </div>
          <Switch 
            checked={preferences.email_enabled} 
            onCheckedChange={(checked) => handleTogglePreference('email_enabled', checked)} 
          />
        </div>
        
        <Separator />
        
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">In-App Notifications</h3>
            <p className="text-sm text-gray-500">Receive notifications in the app</p>
          </div>
          <Switch 
            checked={preferences.in_app_enabled} 
            onCheckedChange={(checked) => handleTogglePreference('in_app_enabled', checked)} 
          />
        </div>
        
        <Separator />
        
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">SMS Notifications</h3>
            <p className="text-sm text-gray-500">Receive notifications via text message</p>
          </div>
          <Switch 
            checked={preferences.sms_enabled} 
            onCheckedChange={(checked) => handleTogglePreference('sms_enabled', checked)} 
          />
        </div>
      </div>
      
      <Button onClick={handleSavePreferences} disabled={saving}>
        {saving ? "Saving..." : "Save Preferences"}
      </Button>
    </div>
  );
};
