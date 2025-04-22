
import { useForm, useWatch } from "react-hook-form";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ContactFormValues {
  contact_first_name: string;
  contact_last_name: string;
  contact_email: string;
  contact_phone: string;
  same_as_company: boolean;
}

export const useContractorContact = (companyInfo: {
  company_email: string;
  company_phone: string;
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

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

  return {
    form,
    loading,
    sameAsCompany,
    onSubmit
  };
};
