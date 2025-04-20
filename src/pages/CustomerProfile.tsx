
import React, { useState } from 'react';
import AppLayout from '@/components/layouts/AppLayout';
import CustomerProfileForm from '@/components/profile/CustomerProfileForm';
import CustomerPasswordSection from '@/components/profile/CustomerPasswordSection';
import CustomerPaymentMethodsSection from '@/components/profile/CustomerPaymentMethodsSection';
import { Separator } from "@/components/ui/separator";
import { User } from "lucide-react";

const CustomerProfile = () => {
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <AppLayout userType="customer">
      <div className="container max-w-4xl">
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h1 className="text-2xl font-bold mb-6 text-gray-900">Customer Profile</h1>
          
          {/* Profile Image Upload Section */}
          <div className="mb-8 flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 border rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden">
                {profilePicture ? (
                  <img src={profilePicture} alt="Profile" className="max-h-full max-w-full object-cover" />
                ) : (
                  <User className="h-16 w-16 text-gray-300" />
                )}
              </div>
            </div>
            <div className="flex-grow space-y-4">
              <p className="text-sm text-gray-500">Upload your profile picture.</p>
              <div className="flex items-center gap-4">
                <label 
                  htmlFor="profile-upload" 
                  className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md"
                >
                  <span>Choose File</span>
                </label>
                <input 
                  id="profile-upload" 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                />
                {profilePicture && (
                  <button 
                    type="button" 
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50" 
                    onClick={() => setProfilePicture(null)}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          <Separator className="my-6" />
          
          {/* Contact Info Section */}
          <CustomerProfileForm />

          <Separator className="my-6" />
          
          {/* Password Section */}
          <CustomerPasswordSection />

          <Separator className="my-6" />
          
          {/* Payment Methods Section */}
          <CustomerPaymentMethodsSection />
        </div>
      </div>
    </AppLayout>
  );
};

export default CustomerProfile;
