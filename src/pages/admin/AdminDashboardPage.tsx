
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AdminActivity, SystemSetting } from '@/types/admin';
import { logAdminActivity } from '@/utils/adminUtils';

// Import refactored components
import SystemAlert from '@/components/admin/SystemAlert';
import DashboardStatsSection from '@/components/admin/DashboardStats';
import SystemOverview from '@/components/admin/SystemOverview';
import RecentActivityFeed from '@/components/admin/RecentActivityFeed';
import DashboardTabs from '@/components/admin/DashboardTabs';

const AdminDashboardPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [activitiesLoading, setActivitiesLoading] = useState(true);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalContractors: 0,
    activeContractors: 0,
    totalCustomers: 0,
    totalDocuments: 0,
    totalRevenue: 0
  });
  const [recentActivities, setRecentActivities] = useState<AdminActivity[]>([]);
  const [systemSettings, setSystemSettings] = useState<SystemSetting[]>([]);
  const [systemAlerts, setSystemAlerts] = useState<string[]>([]);
  const { toast } = useToast();

  // Fetch dashboard stats
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch contractor stats
        const { data: contractors, error: contractorsError } = await supabase
          .from('contractors')
          .select('*');
        
        if (contractorsError) throw contractorsError;
        
        // Fetch customer stats
        const { data: customers, error: customersError } = await supabase
          .from('customers')
          .select('*');
        
        if (customersError) throw customersError;
        
        // Fetch documents stats (estimates, contracts, invoices)
        const { count: documentsCount, error: documentsError } = await supabase
          .from('document_downloads')
          .select('*', { count: 'exact', head: true });
        
        if (documentsError) throw documentsError;
        
        setStats({
          totalContractors: contractors?.length || 0,
          activeContractors: contractors?.filter(c => c.created_at !== null).length || 0,
          totalCustomers: customers?.length || 0,
          totalDocuments: documentsCount || 0,
          totalRevenue: 0 // Would typically come from a payment processing system
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  // Fetch admin activities
  useEffect(() => {
    const fetchRecentActivities = async () => {
      try {
        const { data, error } = await supabase
          .from('admin_activities')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);
        
        if (error) throw error;
        
        // Convert the data to AdminActivity[] type
        const typedActivities: AdminActivity[] = data.map((activity: any) => ({
          id: activity.id,
          admin_id: activity.admin_id,
          action_type: activity.action_type,
          entity_type: activity.entity_type,
          entity_id: activity.entity_id,
          ip_address: activity.ip_address,
          action_details: activity.action_details,
          created_at: activity.created_at
        }));
        
        setRecentActivities(typedActivities);
      } catch (error) {
        console.error('Error fetching admin activities:', error);
        toast({
          title: "Failed to load activities",
          description: "Could not retrieve admin activities",
          variant: "destructive"
        });
      } finally {
        setActivitiesLoading(false);
      }
    };
    
    fetchRecentActivities();
  }, [toast]);

  // Fetch system settings
  useEffect(() => {
    const fetchSystemSettings = async () => {
      try {
        const { data: settings, error } = await supabase
          .from('system_settings')
          .select('*');
        
        if (error) throw error;
        
        setSystemSettings(settings || []);
        
        // Set system alerts based on settings
        const alerts: string[] = [];
        
        const maintenanceModeEnabled = settings?.find(
          s => s.key === 'maintenance_mode' && s.value === true
        );
        if (maintenanceModeEnabled) {
          alerts.push("System is in maintenance mode");
        }
        
        const systemStatus = settings?.find(s => s.key === 'system_status')?.value;
        if (systemStatus && systemStatus !== 'operational') {
          alerts.push(`System status: ${systemStatus}`);
        }
        
        setSystemAlerts(alerts);
      } catch (error) {
        console.error('Error fetching system settings:', error);
      } finally {
        setSettingsLoading(false);
      }
    };
    
    fetchSystemSettings();
  }, []);

  // Log admin dashboard view (once per session)
  useEffect(() => {
    const logDashboardView = async () => {
      try {
        if (!loading && supabase.auth.getUser()) {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await logAdminActivity(
              user.id,
              'view',
              'dashboard',
              null,
              { dashboard: 'admin_overview' }
            );
          }
        }
      } catch (error) {
        console.error('Error logging admin activity:', error);
      }
    };
    
    logDashboardView();
  }, [loading]);

  // Transform the data for Recharts
  const growthData = [
    { name: 'Jan', contractors: 12, customers: 65 },
    { name: 'Feb', contractors: 15, customers: 78 },
    { name: 'Mar', contractors: 18, customers: 90 },
    { name: 'Apr', contractors: 14, customers: 101 },
    { name: 'May', contractors: 22, customers: 95 },
    { name: 'Jun', contractors: 26, customers: 110 },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Overview of the platform statistics and activities.</p>
        </div>

        <SystemAlert alerts={systemAlerts} />

        <DashboardStatsSection stats={stats} loading={loading} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <SystemOverview 
              settings={systemSettings}
              isLoading={settingsLoading}
            />
          </div>
          <div>
            <RecentActivityFeed 
              activities={recentActivities}
              isLoading={activitiesLoading}
            />
          </div>
        </div>

        <DashboardTabs growthData={growthData} />
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
