
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface AdminRoleBadgeProps {
  role: string;
}

const AdminRoleBadge: React.FC<AdminRoleBadgeProps> = ({ role }) => {
  switch (role) {
    case 'super_admin':
      return <Badge className="bg-purple-500">Super Admin</Badge>;
    case 'admin':
      return <Badge className="bg-blue-500">Admin</Badge>;
    case 'support':
      return <Badge className="bg-green-500">Support</Badge>;
    default:
      return <Badge className="bg-gray-500">{role}</Badge>;
  }
};

export default AdminRoleBadge;
