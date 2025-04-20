
import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import CustomerAddressSection from './CustomerAddressSection';
import CustomerContactSection from './CustomerContactSection';
import { supabase } from "@/integrations/supabase/client";
import type { Customer } from '@/types/customer';

export interface CustomerProfileFormValues {
  first_name: string;
  last_name: string;
  billing_address: string;
  property_address: string;
  same_as_billing: boolean;
  phone: string;
  email: string;
}

const CustomerProfileForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const form = useForm<CustomerProfileFormValues>({
    defaultValues: {
      first_name: "",
      last_name: "",
      billing_address: "",
      property_address: "",
      same_as_billing: true,
      phone: "",
      email: ""
    }
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          return; // No session, no profile to fetch
        }
        
        // Get profile data
        const { data, error } = await supabase
          .from('customers')
          .select('*')
          .eq('user_id', session.user.id)
          .maybeSingle();
        
        if (error) throw error;
        
        if (data) {
          form.reset({
            first_name: data.first_name || "",
            last_name: data.last_name || "",
            billing_address: data.billing_address || "",
            property_address: data.property_address || "",
            same_as_billing: data.same_as_billing || true,
            phone: data.phone || "",
            email: data.email || "",
          });
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [form, toast]);

  const onSubmit = async (data: CustomerProfileFormValues) => {
    try {
      setLoading(true);
      
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast({
          title: "Error",
          description: "You must be logged in to update your profile",
          variant: "destructive",
        });
        return;
      }

      // Check if profile already exists
      const { data: existingProfile } = await supabase
        .from('customers')
        .select('id')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (existingProfile) {
        // Update existing profile
        const { error } = await supabase
          .from('customers')
          .update({
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            phone: data.phone,
            billing_address: data.billing_address,
            property_address: data.property_address,
            same_as_billing: data.same_as_billing,
          })
          .eq('id', existingProfile.id);

        if (error) throw error;
      } else {
        // Insert new profile
        const { error } = await supabase
          .from('customers')
          .insert({
            user_id: session.user.id,
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
            phone: data.phone,
            billing_address: data.billing_address,
            property_address: data.property_address,
            same_as_billing: data.same_as_billing,
          });

        if (error) throw error;
      }

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });

    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <CustomerContactSection form={form} />
        <CustomerAddressSection form={form} />
        
        <div className="pt-6 flex justify-end">
          <Button 
            type="submit" 
            className="bg-amber-500 hover:bg-amber-600"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default CustomerProfileForm;
