
import React, { useState } from 'react';
import Sidebar from '../navigation/Sidebar';
import AppHeader from '../navigation/AppHeader';

interface AppLayoutProps {
  children: React.ReactNode;
  userType: 'contractor' | 'customer';
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, userType }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar userType={userType} />
      <div className={`flex-1 ${sidebarCollapsed ? 'ml-20' : 'ml-64'} transition-all duration-300 ease-in-out`}>
        <AppHeader sidebarCollapsed={sidebarCollapsed} />
        <main className="pt-16 px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
