
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import AppLayout from '../components/layouts/AppLayout';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { UserRound, Upload } from "lucide-react";

interface CustomerProfileFormValues {
  fullName: string;
  phone: string;
  billingAddress: string;
  propertyAddress: string;
  sameAsBilling: boolean;
  currentPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
}

const CustomerProfile = () => {
  const { toast } = useToast();
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [isFirstTimeSetup, setIsFirstTimeSetup] = useState(false);
  
  const form = useForm<CustomerProfileFormValues>({
    defaultValues: {
      fullName: "Alice Smith",
      phone: "(555) 987-6543",
      billingAddress: "456 Home Ave, Hometown, HT 67890",
      propertyAddress: "",
      sameAsBilling: true,
    }
  });

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

  const sameAsBilling = form.watch('sameAsBilling');
  
  React.useEffect(() => {
    if (sameAsBilling) {
      const billingAddress = form.getValues('billingAddress');
      form.setValue('propertyAddress', billingAddress);
    }
  }, [sameAsBilling, form]);

  const onSubmit = (data: CustomerProfileFormValues) => {
    console.log("Profile data:", data);
    console.log("Profile picture:", profilePicture);
    
    const passwordsMatch = data.newPassword === data.confirmNewPassword;
    if (data.newPassword && !passwordsMatch) {
      form.setError("confirmNewPassword", {
        type: "manual",
        message: "Passwords do not match"
      });
      return;
    }
    
    toast({
      title: "Profile Saved",
      description: "Your profile has been updated successfully.",
    });
  };

  return (
    <AppLayout userType="customer">
      <div className="container max-w-4xl">
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h1 className="text-2xl font-bold mb-6 text-gray-900">Your Profile</h1>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                      {profilePicture ? (
                        <img src={profilePicture} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <UserRound className="h-12 w-12 text-gray-300" />
                      )}
                    </div>
                    
                    <div className="mt-3 flex flex-col items-center">
                      <label 
                        htmlFor="profile-upload" 
                        className="cursor-pointer text-sm text-amber-600 hover:text-amber-700"
                      >
                        Change Photo
                      </label>
                      <input 
                        id="profile-upload" 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleProfilePictureChange}
                      />
                    </div>
                  </div>
                
                  <div className="flex-grow space-y-4">
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Alice Smith" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="(555) 987-6543" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">Email:</span>
                      <span className="text-sm text-gray-500">alice@example.com</span>
                    </div>
                  </div>
                </div>
                
                <div className="pt-2 border-t">
                  <h2 className="text-lg font-semibold my-4">Address Information</h2>
                  
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="billingAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Billing Address</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="456 Home Ave, Hometown, HT 67890" 
                              className="min-h-[80px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="sameAsBilling"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Property Address is same as Billing Address
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                    
                    {!sameAsBilling && (
                      <FormField
                        control={form.control}
                        name="propertyAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Property Address</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Enter property address" 
                                className="min-h-[80px]" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </div>
                
                <div className="pt-2 border-t">
                  <h2 className="text-lg font-semibold my-4">Change Password</h2>
                  
                  <div className="space-y-4">
                    {!isFirstTimeSetup && (
                      <FormField
                        control={form.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    
                    <FormField
                      control={form.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="confirmNewPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm New Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end">
                      <Button 
                        type="button" 
                        className="bg-amber-500 hover:bg-amber-600"
                        onClick={() => {
                          const newPassword = form.getValues('newPassword');
                          const confirmNewPassword = form.getValues('confirmNewPassword');
                          
                          if (!newPassword) {
                            form.setError("newPassword", {
                              type: "manual",
                              message: "New password is required"
                            });
                            return;
                          }
                          
                          if (newPassword !== confirmNewPassword) {
                            form.setError("confirmNewPassword", {
                              type: "manual",
                              message: "Passwords do not match"
                            });
                            return;
                          }
                          
                          toast({
                            title: "Password Updated",
                            description: "Your password has been updated successfully.",
                          });
                        }}
                      >
                        Update Password
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end">
                <Button type="submit" className="bg-amber-500 hover:bg-amber-600">
                  Save Profile
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </AppLayout>
  );
};

export default CustomerProfile;
