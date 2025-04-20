
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layouts/AppLayout';
import CustomerProfileForm from '@/components/profile/CustomerProfileForm';
import CustomerPasswordSection from '@/components/profile/CustomerPasswordSection';
import CustomerPaymentMethodsSection from '@/components/profile/CustomerPaymentMethodsSection';
import { Separator } from "@/components/ui/separator";
import { User } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const CustomerProfile = () => {
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;
        
        // Get profile data to get the profile_image_url
        const { data } = await supabase
          .from('customers')
          .select('profile_image_url')
          .eq('user_id', session.user.id)
          .maybeSingle();
        
        if (data?.profile_image_url) {
          setProfilePicture(data.profile_image_url);
        }
      } catch (error) {
        console.error("Error fetching profile image:", error);
      }
    };

    fetchProfileImage();
  }, []);

  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setLoading(true);
      
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast({
          title: "Error",
          description: "You must be logged in to update your profile picture",
          variant: "destructive",
        });
        return;
      }

      // Create a unique file path for the image
      const fileExt = file.name.split('.').pop();
      const filePath = `${session.user.id}/${Date.now()}.${fileExt}`;
      
      // Upload image to storage
      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // Get the public URL for the image
      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(filePath);
      
      // Update the profile with the new image URL
      const { error: updateError } = await supabase
        .from('customers')
        .update({ profile_image_url: publicUrl })
        .eq('user_id', session.user.id);
      
      if (updateError) throw updateError;
      
      // Update the UI
      setProfilePicture(publicUrl);
      
      toast({
        title: "Success",
        description: "Profile picture updated successfully",
      });
      
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      toast({
        title: "Error",
        description: "Failed to update profile picture",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveProfilePicture = async () => {
    try {
      setLoading(true);
      
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      
      // Get current profile image URL to delete the file
      const { data } = await supabase
        .from('customers')
        .select('profile_image_url')
        .eq('user_id', session.user.id)
        .maybeSingle();
      
      if (data?.profile_image_url) {
        // Extract the file path from the URL
        const urlParts = data.profile_image_url.split('/');
        const filePath = `${session.user.id}/${urlParts[urlParts.length - 1]}`;
        
        // Delete the file from storage
        await supabase.storage
          .from('profile-images')
          .remove([filePath]);
      }
      
      // Update the profile to remove the image URL
      const { error } = await supabase
        .from('customers')
        .update({ profile_image_url: null })
        .eq('user_id', session.user.id);
      
      if (error) throw error;
      
      // Update the UI
      setProfilePicture(null);
      
      toast({
        title: "Success",
        description: "Profile picture removed",
      });
      
    } catch (error) {
      console.error("Error removing profile picture:", error);
      toast({
        title: "Error",
        description: "Failed to remove profile picture",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
                  className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span>{loading ? 'Uploading...' : 'Choose File'}</span>
                </label>
                <input 
                  id="profile-upload" 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  disabled={loading}
                />
                {profilePicture && (
                  <button 
                    type="button" 
                    className={`px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={handleRemoveProfilePicture}
                    disabled={loading}
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
