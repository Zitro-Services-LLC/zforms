
import React from 'react';
import { Check, X } from 'lucide-react';

interface AdminStatusIndicatorProps {
  isActive: boolean;
}

const AdminStatusIndicator: React.FC<AdminStatusIndicatorProps> = ({ isActive }) => {
  return isActive ? (
    <div className="flex items-center">
      <Check className="h-4 w-4 text-green-500 mr-1" />
      <span>Active</span>
    </div>
  ) : (
    <div className="flex items-center">
      <X className="h-4 w-4 text-red-500 mr-1" />
      <span>Inactive</span>
    </div>
  );
};

export default AdminStatusIndicator;
