import React from 'react';
import AdminHeader from '../navigation/AdminHeader';
import AdminSidebar from '../navigation/AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

// Modified AdminLayout to not redirect to auth page for dev-setup
const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  // Remove any auth checks that might be causing redirects to /auth
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
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
