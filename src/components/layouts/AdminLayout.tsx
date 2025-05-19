
import React, { useState, useEffect } from 'react';
import AdminHeader from '../navigation/AdminHeader';
import AdminSidebar from '../navigation/AdminSidebar';
import { useLocation } from 'react-router-dom';

interface AdminLayoutProps {
  children: React.ReactNode;
}

// Modified AdminLayout to not redirect to auth page for dev-setup
const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  // Add state for sidebar collapse functionality
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  
  // Auto-collapse sidebar on smaller screens or on the dev-setup page
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 || location.pathname === '/admin/dev-setup') {
        setCollapsed(true);
      } else {
        setCollapsed(false);
      }
    };

    // Initial check
    handleResize();

    // Listen for window resize events
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => window.removeEventListener('resize', handleResize);
  }, [location.pathname]);
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex-1 flex flex-col">
        <AdminHeader sidebarCollapsed={collapsed} setCollapsed={setCollapsed} />
        <main className={`flex-1 p-6 ${collapsed ? 'ml-20' : 'ml-64'} transition-all duration-300 ease-in-out`}>
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
