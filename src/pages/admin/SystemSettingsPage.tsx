
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { Loader, Save } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface SystemSetting {
  id: string;
  key: string;
  value: any;
  description?: string;
}

const SystemSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        
        // Fetch system settings from database
        const { data, error } = await supabase
          .from('system_settings')
          .select('*')
          .is('deleted_at', null);
        
        if (error) throw error;
        setSettings(data || []);
      } catch (error) {
        console.error('Error fetching system settings:', error);
        toast({
          title: "Error",
          description: "Failed to load system settings",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, [toast]);

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      
      // For each setting, update in database
      for (const setting of settings) {
        const { error } = await supabase
          .from('system_settings')
          .update({
            value: setting.value,
            updated_at: new Date().toISOString()
          })
          .eq('id', setting.id);
        
        if (error) throw error;
      }
      
      toast({
        title: "Success",
        description: "System settings have been updated",
      });
    } catch (error) {
      console.error('Error saving system settings:', error);
      toast({
        title: "Error",
        description: "Failed to save system settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (id: string, value: any) => {
    setSettings(prev => prev.map(setting => 
      setting.id === id ? { ...setting, value } : setting
    ));
  };

  // Helper to render appropriate input based on value type
  const renderSettingInput = (setting: SystemSetting) => {
    const type = typeof setting.value;
    
    switch (type) {
      case 'boolean':
        return (
          <div className="flex items-center space-x-2">
            <Switch
              id={setting.id}
              checked={setting.value}
              onCheckedChange={(checked) => updateSetting(setting.id, checked)}
            />
            <Label htmlFor={setting.id}>
              {setting.value ? 'Enabled' : 'Disabled'}
            </Label>
          </div>
        );
      
      case 'number':
        return (
          <Input
            type="number"
            value={setting.value}
            onChange={(e) => updateSetting(setting.id, Number(e.target.value))}
          />
        );
      
      case 'string':
        if (setting.value.length > 80) {
          return (
            <Textarea
              value={setting.value}
              onChange={(e) => updateSetting(setting.id, e.target.value)}
              rows={4}
            />
          );
        } else {
          return (
            <Input
              type="text"
              value={setting.value}
              onChange={(e) => updateSetting(setting.id, e.target.value)}
            />
          );
        }
      
      case 'object':
        return (
          <Textarea
            value={JSON.stringify(setting.value, null, 2)}
            onChange={(e) => {
              try {
                updateSetting(setting.id, JSON.parse(e.target.value));
              } catch (error) {
                console.error('Invalid JSON:', error);
              }
            }}
            rows={6}
            className="font-mono"
          />
        );
      
      default:
        return <p>Unsupported setting type</p>;
    }
  };

  const getSettingsByCategory = (category: string) => {
    // If using a naming convention like 'category.setting_name'
    return settings.filter(setting => setting.key.startsWith(`${category}.`));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
            <p className="text-muted-foreground">Configure global application settings.</p>
          </div>
          
          <Button 
            onClick={handleSaveSettings} 
            disabled={saving || loading}
          >
            {saving ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader className="mr-2 h-6 w-6 animate-spin" />
            <p>Loading settings...</p>
          </div>
        ) : (
          <Tabs defaultValue="general">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                  <CardDescription>
                    Basic system configuration options.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {settings.length === 0 ? (
                    <p>No general settings found. Add some in the database.</p>
                  ) : (
                    settings.map(setting => (
                      <div key={setting.id} className="grid gap-2">
                        <Label htmlFor={setting.id}>{setting.key}</Label>
                        {renderSettingInput(setting)}
                        {setting.description && (
                          <p className="text-sm text-muted-foreground">{setting.description}</p>
                        )}
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription>
                    Configure email templates and notification preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Notification settings will be added soon.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="billing" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Billing Settings</CardTitle>
                  <CardDescription>
                    Configure subscription plans and payment options.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Billing settings will be added soon.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="advanced" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Settings</CardTitle>
                  <CardDescription>
                    System configuration for advanced users.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Advanced settings will be added soon.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </AdminLayout>
  );
};

export default SystemSettingsPage;
