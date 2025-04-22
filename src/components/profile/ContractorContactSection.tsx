
import React from 'react';
import { Form } from "@/components/ui/form";
import { useContractorContact } from '@/hooks/useContractorContact';
import { ContactNameFields } from './contact/ContactNameFields';
import { ContactInfoFields } from './contact/ContactInfoFields';
import { ContactSameAsCompanyField } from './contact/ContactSameAsCompanyField';

const ContractorContactSection = () => {
  const companyInfo = {
    company_email: '',
    company_phone: ''
  };

  const { form, loading, sameAsCompany, onSubmit } = useContractorContact(companyInfo);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Contact Information</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ContactNameFields form={form} />
            <ContactInfoFields form={form} sameAsCompany={sameAsCompany} />
          </div>

          <ContactSameAsCompanyField form={form} />

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
