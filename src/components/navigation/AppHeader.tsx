
import React from 'react';
import { Link } from 'react-router-dom';

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
        <div className="flex items-center">
          <button 
            type="button" 
            className="p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
          >
            <span className="sr-only">View notifications</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
            </svg>
          </button>
          
          <div className="ml-3 relative">
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
          
          <Link to="/logout" className="ml-4 text-sm text-gray-500 hover:text-amber-600">
            Logout
          </Link>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
