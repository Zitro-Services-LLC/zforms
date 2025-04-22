
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import type { ContractorLicense } from "@/types/license";
import { updateContractorLicense } from '@/services/licenseService';

const ContractorLicenseSection: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const form = useForm<ContractorLicense>({
    defaultValues: {
      agency: '',
      number: '',
      issueDate: '',
      expiryDate: '',
    }
  });

  const onSubmit = async (data: ContractorLicense) => {
    try {
      setLoading(true);
      await updateContractorLicense('your-contractor-id', data);
      toast({
        title: "License Updated",
        description: "Your license information has been updated successfully."
      });
    } catch (error) {
      console.error('Error updating license:', error);
      toast({
        title: "Error",
        description: "Failed to update license information. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">License Information</h2>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="agency" className="block text-sm font-medium">
              Issuing Agency/State
            </label>
            <Input
              id="agency"
              {...form.register('agency')}
              placeholder="Enter issuing agency"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="number" className="block text-sm font-medium">
              License Number
            </label>
            <Input
              id="number"
              {...form.register('number')}
              placeholder="Enter license number"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="issueDate" className="block text-sm font-medium">
              Issue Date
            </label>
            <Input
              id="issueDate"
              type="date"
              {...form.register('issueDate')}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="expiryDate" className="block text-sm font-medium">
              Expiry Date
            </label>
            <Input
              id="expiryDate"
              type="date"
              {...form.register('expiryDate')}
            />
          </div>
        </div>

        <Button 
          type="submit" 
          disabled={loading}
          className="w-full md:w-auto"
        >
          {loading ? 'Saving...' : 'Save License Information'}
        </Button>
      </form>
    </div>
  );
};

export default ContractorLicenseSection;
