
import { useState, useEffect } from "react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { supabase } from "@/integrations/supabase/client";

export interface ContractorFormData {
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  logo_url?: string | null;
}

export const useContractorData = () => {
  const [loading, setLoading] = useState(true);
  const [contractorData, setContractorData] = useState<ContractorFormData | null>(null);
  const { user } = useSupabaseAuth();

  useEffect(() => {
    const fetchContractorData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('contractors')
          .select('company_name, company_address, company_phone, company_email, logo_url, user_id')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error("Error fetching contractor data:", error);
          return;
        }

        if (data) {
          setContractorData({
            companyName: data.company_name || '',
            companyAddress: data.company_address || '',
            companyPhone: data.company_phone || '',
            companyEmail: data.company_email || '',
            logo_url: data.logo_url || null,
            user_id: data.user_id
          });
        }
      } catch (error) {
        console.error("Error in fetchContractorData:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContractorData();
  }, [user]);

  const updateContractorData = async (data: ContractorFormData) => {
    if (!user) return;

    try {
      setLoading(true);

      // Check if contractor record exists
      const { data: existingData, error: fetchError } = await supabase
        .from('contractors')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (fetchError) {
        console.error("Error checking contractor existence:", fetchError);
        throw fetchError;
      }

      const updateData = {
        company_name: data.companyName,
        company_address: data.companyAddress,
        company_phone: data.companyPhone,
        company_email: data.companyEmail,
        logo_url: data.logo_url,
        user_id: user.id
      };

      let result;

      // If contractor exists, update, otherwise insert
      if (existingData) {
        result = await supabase
          .from('contractors')
          .update(updateData)
          .eq('user_id', user.id);
      } else {
        result = await supabase
          .from('contractors')
          .insert([updateData]);
      }

      if (result.error) {
        console.error("Error updating contractor data:", result.error);
        throw result.error;
      }

      // Update local state
      setContractorData({
        ...data,
        user_id: user.id
      });

    } catch (error) {
      console.error("Error in updateContractorData:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { loading, contractorData, updateContractorData };
};
