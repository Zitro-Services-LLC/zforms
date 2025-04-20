
import React from 'react';

type Status = 'drafting' | 'submitted' | 'approved' | 'needs-update' | 'paid';

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
  
  return (
    <span className={`status-badge status-${status}`}>
      {statusLabels[status]}
    </span>
  );
};

export default StatusBadge;
