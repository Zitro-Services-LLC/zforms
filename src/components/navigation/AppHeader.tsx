
import React from 'react';
import { Link } from 'react-router-dom';
import { NotificationBell } from '../notifications/NotificationBell';
import LogoutButton from '../auth/LogoutButton';

interface AppHeaderProps {
  sidebarCollapsed?: boolean;
}

const AppHeader: React.FC<AppHeaderProps> = ({ sidebarCollapsed = false }) => {
  return (
    <header className={`bg-white border-b border-gray-200 h-16 fixed top-0 right-0 z-20 ${
      sidebarCollapsed ? 'left-20' : 'left-64'
    } transition-all duration-300 ease-in-out`}>
      <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex-1">
          <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
        </div>
        <div className="flex items-center space-x-4">
          <NotificationBell />
          
          <div className="relative">
            <div>
              <button 
                type="button" 
                className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500" 
                id="user-menu" 
                aria-expanded="false" 
                aria-haspopup="true"
              >
                <span className="sr-only">Open user menu</span>
                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                </div>
              </button>
            </div>
            {/* User dropdown menu would be here */}
          </div>
          
          <LogoutButton />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
