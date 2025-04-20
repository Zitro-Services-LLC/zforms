
import React from 'react';
import PublicLayout from '../components/layouts/PublicLayout';
import HeroSection from '../components/landing/HeroSection';
import FeatureSection from '../components/landing/FeatureSection';
import AppOverviewSection from '../components/landing/AppOverviewSection';

const Landing = () => {
  return (
    <PublicLayout>
      <HeroSection />
      <FeatureSection />
      <AppOverviewSection />
    </PublicLayout>
  );
};

export default Landing;
