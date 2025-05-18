
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChartContainer } from '@/components/ui/chart';
import { supabase } from '@/integrations/supabase/client';
import { Users, FileText, CreditCard, ArrowUp, ArrowDown, AlertTriangle } from 'lucide-react';
import SystemOverview from '@/components/admin/SystemOverview';
import RecentActivityFeed from '@/components/admin/RecentActivityFeed';
import { useToast } from '@/hooks/use-toast';
import { AdminActivity, SystemSetting } from '@/types/admin';
import { logAdminActivity } from '@/utils/adminUtils';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend
} from 'recharts';

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  change?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description, icon, change }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="p-2 bg-amber-100 rounded-full text-amber-600">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-sm text-muted-foreground">{description}</p>
        {change !== undefined && (
          <div className={`flex items-center pt-1 text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change >= 0 ? <ArrowUp className="mr-1 h-4 w-4" /> : <ArrowDown className="mr-1 h-4 w-4" />}
            <span>{Math.abs(change)}% from last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

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
  const transformedData = [
    { name: 'Jan', contractors: 12, customers: 65 },
    { name: 'Feb', contractors: 15, customers: 78 },
    { name: 'Mar', contractors: 18, customers: 90 },
    { name: 'Apr', contractors: 14, customers: 101 },
    { name: 'May', contractors: 22, customers: 95 },
    { name: 'Jun', contractors: 26, customers: 110 },
  ];

  // Chart config needed for the ChartContainer
  const chartConfig = {
    contractors: {
      label: 'Contractors',
      theme: {
        light: '#f59e0b',
        dark: '#f59e0b',
      },
    },
    customers: {
      label: 'Customers',
      theme: {
        light: '#0ea5e9',
        dark: '#0ea5e9',
      },
    },
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Overview of the platform statistics and activities.</p>
        </div>

        {systemAlerts.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-4 flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-amber-800">System Alerts</h3>
              <ul className="mt-1 text-sm text-amber-700 list-disc pl-5">
                {systemAlerts.map((alert, idx) => (
                  <li key={idx}>{alert}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Contractors"
            value={loading ? '...' : stats.totalContractors.toString()}
            description="Total registered contractors"
            icon={<Users className="h-4 w-4" />}
            change={8}
          />
          <StatCard
            title="Total Customers"
            value={loading ? '...' : stats.totalCustomers.toString()}
            description="Across all contractors"
            icon={<Users className="h-4 w-4" />}
            change={12}
          />
          <StatCard
            title="Total Documents"
            value={loading ? '...' : stats.totalDocuments.toString()}
            description="Estimates, contracts & invoices"
            icon={<FileText className="h-4 w-4" />}
            change={5}
          />
          <StatCard
            title="Monthly Revenue"
            value={loading ? '...' : `$${stats.totalRevenue}`}
            description="From subscriptions"
            icon={<CreditCard className="h-4 w-4" />}
            change={-3}
          />
        </div>

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

        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Growth Metrics</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <ChartContainer
                  config={chartConfig}
                  className="h-[350px]"
                >
                  <LineChart
                    width={500}
                    height={300}
                    data={transformedData}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="contractors" 
                      stroke="#f59e0b" 
                      activeDot={{ r: 8 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="customers" 
                      stroke="#0ea5e9" 
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Detailed Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Detailed analytics will be available here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Generated Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Report generation tools will be available here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
