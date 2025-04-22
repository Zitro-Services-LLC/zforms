
import React from 'react';
import { useForm, useWatch } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ContactFormValues {
  contact_first_name: string;
  contact_last_name: string;
  contact_email: string;
  contact_phone: string;
  same_as_company: boolean;
}

const ContractorContactSection = () => {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [companyInfo, setCompanyInfo] = React.useState({
    company_email: '',
    company_phone: ''
  });

  const form = useForm<ContactFormValues>({
    defaultValues: {
      contact_first_name: '',
      contact_last_name: '',
      contact_email: '',
      contact_phone: '',
      same_as_company: false
    }
  });

  const sameAsCompany = useWatch({
    control: form.control,
    name: "same_as_company"
  });

  // Fetch initial data
  React.useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const { data, error } = await supabase
        .from('contractors')
        .select('contact_first_name, contact_last_name, contact_email, contact_phone, company_email, company_phone')
        .eq('user_id', session.user.id)
        .single();

      if (error) {
        toast({ title: "Error", description: "Failed to load contact information", variant: "destructive" });
        return;
      }

      if (data) {
        setCompanyInfo({
          company_email: data.company_email || '',
          company_phone: data.company_phone || ''
        });

        const sameAsCompany = data.contact_email === data.company_email && 
                            data.contact_phone === data.company_phone;

        form.reset({
          contact_first_name: data.contact_first_name || '',
          contact_last_name: data.contact_last_name || '',
          contact_email: data.contact_email || '',
          contact_phone: data.contact_phone || '',
          same_as_company: sameAsCompany
        });
      }
    };

    fetchData();
  }, [form, toast]);

  // Handle form submission
  const onSubmit = async (data: ContactFormValues) => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast({
          title: "Error",
          description: "You must be logged in to update your profile",
          variant: "destructive",
        });
        return;
      }

      const updateData = {
        contact_first_name: data.contact_first_name,
        contact_last_name: data.contact_last_name,
        contact_email: data.same_as_company ? companyInfo.company_email : data.contact_email,
        contact_phone: data.same_as_company ? companyInfo.company_phone : data.contact_phone,
      };

      const { error } = await supabase
        .from('contractors')
        .update(updateData)
        .eq('user_id', session.user.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Contact information updated successfully",
      });
    } catch (error) {
      console.error("Error updating contact information:", error);
      toast({
        title: "Error",
        description: "Failed to update contact information",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Contact Information</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="contact_first_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact First Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter first name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contact_last_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Last Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter last name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="Enter email address" 
                      {...field}
                      disabled={sameAsCompany} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contact_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Phone</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter phone number" 
                      {...field} 
                      disabled={sameAsCompany}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="same_as_company"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Use company contact information
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Contact Information"}
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ContractorContactSection;
