
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Chart } from '@/components/ui/chart';
import { supabase } from '@/integrations/supabase/client';
import { Users, FileText, CreditCard, ArrowUp, ArrowDown } from 'lucide-react';

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
  const [stats, setStats] = useState({
    totalContractors: 0,
    activeContractors: 0,
    totalCustomers: 0,
    totalDocuments: 0,
    totalRevenue: 0
  });

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

  // Sample chart data - would be replaced with real data in production
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'New Contractors',
        data: [12, 15, 18, 14, 22, 26],
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
      },
      {
        label: 'New Customers',
        data: [65, 78, 90, 101, 95, 110],
        borderColor: '#0ea5e9',
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
      },
    ],
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Overview of the platform statistics and activities.</p>
        </div>

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
                <Chart
                  type="line"
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                  className="h-[350px]"
                />
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
