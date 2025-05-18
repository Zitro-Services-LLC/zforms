
import React, { useState } from 'react';
import AdminHeader from '../navigation/AdminHeader';
import AdminSidebar from '../navigation/AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

// Modified AdminLayout to not redirect to auth page for dev-setup
const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  // Add state for sidebar collapse functionality
  const [collapsed, setCollapsed] = useState(false);
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex-1 flex flex-col">
        <AdminHeader sidebarCollapsed={collapsed} setCollapsed={setCollapsed} />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
