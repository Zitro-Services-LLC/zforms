
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const PublicHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <span className="text-2xl font-bold text-amber-500">z</span>
                <span className="text-2xl font-bold text-gray-900">forms</span>
              </Link>
            </div>
            <nav className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-8">
              <Link to="/" className="text-gray-900 hover:text-amber-500 px-3 py-2 text-sm font-medium">
                Home
              </Link>
              <Link to="/features" className="text-gray-500 hover:text-amber-500 px-3 py-2 text-sm font-medium">
                Features
              </Link>
              <Link to="/pricing" className="text-gray-500 hover:text-amber-500 px-3 py-2 text-sm font-medium">
                Pricing
              </Link>
            </nav>
          </div>
          <div className="hidden sm:flex items-center">
            <Link
              to="/login"
              className="text-gray-900 hover:text-amber-600 px-3 py-2 text-sm font-medium mr-4"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="btn-amber"
            >
              Sign up
            </Link>
          </div>
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50 hover:text-amber-500"
            >
              Home
            </Link>
            <Link
              to="/features"
              className="block px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-amber-500"
            >
              Features
            </Link>
            <Link
              to="/pricing"
              className="block px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-amber-500"
            >
              Pricing
            </Link>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="space-y-1">
                <Link
                  to="/login"
                  className="block px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50 hover:text-amber-500"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="block px-3 py-2 text-base font-medium bg-amber-500 text-white hover:bg-amber-600"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default PublicHeader;
