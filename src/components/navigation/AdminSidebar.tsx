
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Users, 
  UserCog, 
  Settings, 
  FileText, 
  BarChart3, 
  CreditCard, 
  Bell, 
  LogOut,
  ChevronRight,
  ChevronLeft,
  Activity,
  User
} from 'lucide-react';

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  collapsed: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, label, active, collapsed }) => {
  return (
    <Link to={to} className="block">
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start mb-1",
          collapsed ? "px-2" : "px-4",
          active ? "bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-700" : ""
        )}
      >
        <span className={cn("mr-2", collapsed ? "mr-0" : "")}>{icon}</span>
        {!collapsed && <span>{label}</span>}
      </Button>
    </Link>
  );
};

interface AdminSidebarProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-30 flex h-screen flex-col border-r border-gray-200 bg-white transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 py-2">
        {!collapsed && (
          <Link to="/admin" className="flex items-center">
            <span className="text-xl font-bold text-amber-600">Admin Portal</span>
          </Link>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className={cn(
            "h-8 w-8",
            collapsed ? "mx-auto" : "ml-auto"
          )}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <Separator />

      <div className="flex-1 overflow-auto py-4 px-2">
        <div className={collapsed ? "space-y-2" : "space-y-1"}>
          <SidebarLink
            to="/admin"
            icon={<LayoutDashboard size={collapsed ? 24 : 20} />}
            label="Dashboard"
            active={location.pathname === '/admin'}
            collapsed={collapsed}
          />
          
          <SidebarLink
            to="/admin/contractors"
            icon={<UserCog size={collapsed ? 24 : 20} />}
            label="Contractors"
            active={location.pathname.startsWith('/admin/contractors')}
            collapsed={collapsed}
          />
          
          <SidebarLink
            to="/admin/customers"
            icon={<Users size={collapsed ? 24 : 20} />}
            label="Customers"
            active={location.pathname.startsWith('/admin/customers')}
            collapsed={collapsed}
          />

          {!collapsed && <Separator className="my-2" />}
          
          <SidebarLink
            to="/admin/analytics"
            icon={<BarChart3 size={collapsed ? 24 : 20} />}
            label="Analytics"
            active={location.pathname.startsWith('/admin/analytics')}
            collapsed={collapsed}
          />
          
          <SidebarLink
            to="/admin/subscriptions"
            icon={<CreditCard size={collapsed ? 24 : 20} />}
            label="Subscriptions"
            active={location.pathname.startsWith('/admin/subscriptions')}
            collapsed={collapsed}
          />
          
          <SidebarLink
            to="/admin/documents"
            icon={<FileText size={collapsed ? 24 : 20} />}
            label="Documents"
            active={location.pathname.startsWith('/admin/documents')}
            collapsed={collapsed}
          />
          
          <SidebarLink
            to="/admin/notifications"
            icon={<Bell size={collapsed ? 24 : 20} />}
            label="Notifications"
            active={location.pathname.startsWith('/admin/notifications')}
            collapsed={collapsed}
          />

          <SidebarLink
            to="/admin/activity"
            icon={<Activity size={collapsed ? 24 : 20} />}
            label="Activity Logs"
            active={location.pathname.startsWith('/admin/activity')}
            collapsed={collapsed}
          />

          {!collapsed && <Separator className="my-2" />}
          
          <SidebarLink
            to="/admin/settings"
            icon={<Settings size={collapsed ? 24 : 20} />}
            label="System Settings"
            active={location.pathname.startsWith('/admin/settings')}
            collapsed={collapsed}
          />
          
          <SidebarLink
            to="/admin/profile"
            icon={<User size={collapsed ? 24 : 20} />}
            label="My Profile"
            active={location.pathname.startsWith('/admin/profile')}
            collapsed={collapsed}
          />
        </div>
      </div>

      <div className="border-t border-gray-200 p-2">
        <Button variant="ghost" className={cn("w-full justify-start", collapsed && "px-2")}>
          <LogOut className="mr-2" size={collapsed ? 24 : 20} />
          {!collapsed && <span>Logout</span>}
        </Button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
