
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface ContractorFormData {
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
}

export const useContractorData = () => {
  const [loading, setLoading] = useState(true);
  const [contractorData, setContractorData] = useState<ContractorFormData | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchContractorData();
  }, []);

  const fetchContractorData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        toast({
          title: "Error",
          description: "You must be logged in to view your profile",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase
        .from('contractors')
        .select('company_name, company_address, company_phone, company_email')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setContractorData({
          companyName: data.company_name,
          companyAddress: data.company_address || '',
          companyPhone: data.company_phone || '',
          companyEmail: data.company_email || '',
        });
      }
    } catch (error) {
      console.error('Error fetching contractor data:', error);
      toast({
        title: "Error",
        description: "Failed to load contractor profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateContractorData = async (data: ContractorFormData) => {
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

      const { error } = await supabase
        .from('contractors')
        .update({
          company_name: data.companyName,
          company_address: data.companyAddress,
          company_phone: data.companyPhone,
          company_email: data.companyEmail,
        })
        .eq('user_id', session.user.id);

      if (error) throw error;

      setContractorData(data);
      toast({
        title: "Success",
        description: "Company profile updated successfully",
      });
    } catch (error) {
      console.error('Error updating contractor data:', error);
      toast({
        title: "Error",
        description: "Failed to update company profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    contractorData,
    updateContractorData,
  };
};
