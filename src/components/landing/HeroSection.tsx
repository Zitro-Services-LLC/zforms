
import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-amber-50">
      <div className="max-w-7xl mx-auto">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-6">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Streamline Your</span>
              <span className="block text-amber-500">Home Renovation Business</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              Estimates, Contracts & Invoices Made Easy for Home Improvement Contractors. 
              Save time, get paid faster, and provide a better experience for your customers.
            </p>
            <div className="mt-10">
              <Link 
                to="/signup" 
                className="btn-amber inline-block shadow-lg hover:shadow-xl mr-4"
              >
                Get Started
              </Link>
              <Link 
                to="/login" 
                className="text-amber-600 font-medium hover:text-amber-700 inline-flex items-center"
              >
                <span>Already have an account? Log in</span>
              </Link>
            </div>
          </div>
          <div className="mt-12 lg:mt-0 lg:col-span-6">
            <div className="relative h-64 sm:h-72 md:h-96 lg:h-full">
              <div className="absolute inset-0 bg-amber-100 rounded-xl overflow-hidden">
                <svg className="absolute left-0 transform -translate-x-1/2" width="784" height="404" fill="none" viewBox="0 0 784 404">
                  <defs>
                    <pattern id="pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                      <rect x="0" y="0" width="4" height="4" fill="rgba(255, 191, 0, 0.1)" />
                    </pattern>
                  </defs>
                  <rect width="784" height="404" fill="url(#pattern)" />
                </svg>
                <img 
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80"
                  alt="Home Improvement Contractor using laptop" 
                  className="w-full h-full object-cover opacity-75"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
