
import React from 'react';

export type Status = 'drafting' | 'submitted' | 'approved' | 'needs-update' | 'paid';

interface StatusBadgeProps {
  status: Status;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const statusLabels: Record<Status, string> = {
    'drafting': 'Drafting',
    'submitted': 'Submitted',
    'approved': 'Approved',
    'needs-update': 'Needs Update',
    'paid': 'Paid'
  };
  
  const getStatusClass = () => {
    let baseClasses = 'px-2 py-1 rounded-full text-xs font-medium inline-block';
    
    switch (status) {
      case 'drafting':
        return `${baseClasses} bg-gray-200 text-gray-800`;
      case 'submitted':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'approved':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'needs-update':
        return `${baseClasses} bg-amber-100 text-amber-800`;
      case 'paid':
        return `${baseClasses} bg-purple-100 text-purple-800`;
      default:
        return baseClasses;
    }
  };
  
  return (
    <span className={getStatusClass()}>
      {statusLabels[status]}
    </span>
  );
};

export default StatusBadge;
