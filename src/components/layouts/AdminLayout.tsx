
import React, { useState } from 'react';
import AdminSidebar from '../navigation/AdminSidebar';
import AdminHeader from '../navigation/AdminHeader';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Loader } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { isAdmin, loading } = useAdminAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="h-8 w-8 animate-spin text-amber-500" />
        <span className="ml-2 text-lg">Loading admin dashboard...</span>
      </div>
    );
  }
  
  if (isAdmin === false) {
    // This should not be visible due to the redirect in useAdminAuth
    return null;
  }
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <div className={`flex-1 ${sidebarCollapsed ? 'ml-20' : 'ml-64'} transition-all duration-300 ease-in-out`}>
        <AdminHeader sidebarCollapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
        <main className="pt-16 px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
