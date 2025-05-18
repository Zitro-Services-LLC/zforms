
import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface SystemAlertProps {
  alerts: string[];
}

const SystemAlert: React.FC<SystemAlertProps> = ({ alerts }) => {
  if (alerts.length === 0) return null;
  
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-md p-4 flex items-start space-x-3">
      <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
      <div>
        <h3 className="font-medium text-amber-800">System Alerts</h3>
        <ul className="mt-1 text-sm text-amber-700 list-disc pl-5">
          {alerts.map((alert, idx) => (
            <li key={idx}>{alert}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SystemAlert;
