
import React from 'react';

interface EstimateErrorStateProps {
  error: string | null;
}

const EstimateErrorState: React.FC<EstimateErrorStateProps> = ({ error }) => {
  return (
    <div className="container mx-auto p-6">
      <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9v4a1 1 0 102 0V9a1 1 0 10-2 0zm0-4a1 1 0 112 0 1 1 0 01-2 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm leading-5 text-red-700">
              {error || "Estimate not found or cannot be loaded."}
            </p>
          </div>
        </div>
      </div>
      <button 
        onClick={() => window.history.back()}
        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md"
      >
        Go Back
      </button>
    </div>
  );
};

export default EstimateErrorState;
