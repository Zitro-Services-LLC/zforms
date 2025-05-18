
import React from 'react';
import PublicLayout from '@/components/layouts/PublicLayout';
import HeroSection from '@/components/landing/HeroSection';
import FeatureSection from '@/components/landing/FeatureSection';
import AppOverviewSection from '@/components/landing/AppOverviewSection';
import Footer from '@/components/landing/Footer';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <PublicLayout>
      <HeroSection />
      <FeatureSection />
      <AppOverviewSection />
      
      {/* Development links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 mb-10">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h3 className="font-semibold text-amber-800 mb-2">Development Links</h3>
          <div className="flex flex-wrap gap-3">
            <Link 
              to="/auth" 
              className="text-sm bg-amber-100 hover:bg-amber-200 text-amber-800 px-3 py-1 rounded-md"
            >
              Auth Page
            </Link>
            <Link 
              to="/admin/dev-setup" 
              className="text-sm bg-amber-100 hover:bg-amber-200 text-amber-800 px-3 py-1 rounded-md"
            >
              Admin Dev Setup
            </Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </PublicLayout>
  );
};

export default Landing;
