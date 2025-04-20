
import React from 'react';

const steps = [
  {
    id: 1,
    title: 'Contractor creates documents',
    description: 'Easily create estimates, contracts, and invoices using our intuitive templates.',
  },
  {
    id: 2,
    title: 'Customer reviews & approves',
    description: 'Customers receive documents electronically and can approve with a single click.',
  },
  {
    id: 3,
    title: 'Track progress',
    description: 'Monitor the status of all documents and get paid faster.',
  }
];

const AppOverviewSection = () => {
  return (
    <div className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center mb-16">
          <h2 className="text-base text-amber-600 font-semibold tracking-wide uppercase">How It Works</h2>
          <p className="mt-2 text-3xl leading-8 font-bold tracking-tight text-gray-900 sm:text-4xl">
            Simple Process, Powerful Results
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Our streamlined workflow makes managing your documents effortless.
          </p>
        </div>
        
        <div className="relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row justify-around">
            {steps.map((step) => (
              <div 
                key={step.id} 
                className="flex flex-col items-center text-center px-4 mb-10 md:mb-0"
              >
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-amber-500 text-white text-xl font-bold mb-4">
                  {step.id}
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-base text-gray-500 max-w-xs">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppOverviewSection;
