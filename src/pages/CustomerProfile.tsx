
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layouts/AppLayout';
import CustomerProfileForm from '@/components/profile/CustomerProfileForm';
import CustomerPasswordSection from '@/components/profile/CustomerPasswordSection';
import CustomerPaymentMethodsSection from '@/components/profile/CustomerPaymentMethodsSection';
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User, Upload } from "lucide-react";
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
          
          <div className="flex flex-col md:flex-row mb-8 items-start md:items-center gap-6">
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-gray-100 border flex items-center justify-center overflow-hidden">
                  {profilePicture ? (
                    <img src={profilePicture} alt="Profile" className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-12 w-12 text-gray-300" />
                  )}
                </div>
                <label htmlFor="profile-upload" className="absolute bottom-0 right-0 bg-amber-500 text-white p-1 rounded-full cursor-pointer hover:bg-amber-600 transition-colors">
                  <Upload className="h-4 w-4" />
                  <span className="sr-only">Upload profile picture</span>
                </label>
                <input 
                  id="profile-upload" 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  disabled={loading}
                />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-medium">Your Profile Picture</h2>
              <p className="text-sm text-gray-500">Update your profile photo</p>
              {profilePicture && (
                <button 
                  onClick={handleRemoveProfilePicture}
                  disabled={loading}
                  className="text-sm text-red-600 hover:text-red-800 mt-1"
                >
                  {loading ? "Removing..." : "Remove picture"}
                </button>
              )}
            </div>
          </div>
          
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
              <TabsTrigger value="payment">Payment Methods</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="mt-6">
              <CustomerProfileForm />
            </TabsContent>
            
            <TabsContent value="password" className="mt-6">
              <CustomerPasswordSection />
            </TabsContent>
            
            <TabsContent value="payment" className="mt-6">
              <CustomerPaymentMethodsSection />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
};

export default CustomerProfile;
