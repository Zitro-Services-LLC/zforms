
import React from 'react';
import AppLayout from '@/components/layouts/AppLayout';
import CustomerProfileForm from '@/components/profile/CustomerProfileForm';

const CustomerProfile = () => {
  return (
    <AppLayout userType="customer">
      <div className="container max-w-4xl">
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h1 className="text-2xl font-bold mb-6 text-gray-900">Customer Profile</h1>
          <CustomerProfileForm />
        </div>
      </div>
    </AppLayout>
  );
};

export default CustomerProfile;
