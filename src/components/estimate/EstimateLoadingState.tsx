
import React from 'react';

const EstimateLoadingState: React.FC = () => {
  return (
    <div className="container mx-auto p-6 flex justify-center items-center h-[80vh]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-lg text-gray-600">Loading estimate data...</p>
      </div>
    </div>
  );
};

export default EstimateLoadingState;
