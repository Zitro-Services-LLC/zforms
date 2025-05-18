
import React from 'react';
import StatCard from './StatCard';
import { Users, FileText, CreditCard } from 'lucide-react';

interface DashboardStats {
  totalContractors: number;
  activeContractors: number;
  totalCustomers: number;
  totalDocuments: number;
  totalRevenue: number;
}

interface DashboardStatsProps {
  stats: DashboardStats;
  loading: boolean;
}

const DashboardStatsSection: React.FC<DashboardStatsProps> = ({ stats, loading }) => {
  return (
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
  );
};

export default DashboardStatsSection;
