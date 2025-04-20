
import React from 'react';

interface ProgressBarProps {
  value: number; // 0 to 100
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value }) => {
  // Ensure the value is between 0 and 100
  const safeValue = Math.min(Math.max(value, 0), 100);
  
  return (
    <div className="progress-bar">
      <div 
        className="progress-value" 
        style={{ width: `${safeValue}%` }}
        role="progressbar" 
        aria-valuenow={safeValue} 
        aria-valuemin={0} 
        aria-valuemax={100}
      />
    </div>
  );
};

export default ProgressBar;
