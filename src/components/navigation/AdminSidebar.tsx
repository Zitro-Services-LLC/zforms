
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import LogoutButton from '@/components/auth/LogoutButton';
import { 
  LayoutDashboard, 
  Users, 
  ClipboardList, 
  FileText, 
  ChevronRight, 
  Settings, 
  Activity, 
  UserCog,
  Database,
  Shield
} from 'lucide-react';

interface AdminSidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ collapsed, setCollapsed }) => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/admin' && location.pathname === '/admin') return true;
    if (path !== '/admin' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const sidebarItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: 'Admin Management', path: '/admin/management', icon: <Shield className="h-5 w-5" /> },
    { name: 'Contractors', path: '/admin/contractors', icon: <Users className="h-5 w-5" /> },
    { name: 'System Settings', path: '/admin/settings', icon: <Settings className="h-5 w-5" /> },
    { name: 'Activity Logs', path: '/admin/activity', icon: <Activity className="h-5 w-5" /> },
    { name: 'My Profile', path: '/admin/profile', icon: <UserCog className="h-5 w-5" /> },
  ];

  return (
    <div
      className={cn(
        'h-screen fixed top-0 left-0 z-50 border-r bg-white transition-all duration-300 ease-in-out',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      <div className="flex h-16 items-center gap-2 border-b px-4">
        <span className="text-lg font-bold text-amber-500">Z</span>
        {!collapsed && <span className="text-lg font-bold text-gray-900">Admin Panel</span>}
      </div>
      
      <div className="space-y-1 py-4">
        {sidebarItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-amber-600',
              {
                'bg-amber-50 text-amber-600': isActive(item.path),
                'mx-2': !collapsed,
                'justify-center': collapsed
              }
            )}
          >
            {item.icon}
            {!collapsed && <span>{item.name}</span>}
          </Link>
        ))}
      </div>
      
      <div className={cn(
        'absolute bottom-4 w-full px-3',
        collapsed ? 'flex justify-center' : ''
      )}>
        <LogoutButton className={cn(
          'w-full flex items-center gap-3 text-gray-500 hover:text-amber-600',
          {
            'justify-center': collapsed
          }
        )} />
      </div>
    </div>
  );
};

export default AdminSidebar;
