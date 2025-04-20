
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Plus } from "lucide-react";

interface License {
  id: string;
  agency: string;
  number: string;
  issueDate: string;
  expirationDate: string;
}

const ContractorLicenseSection: React.FC = () => {
  const [licenses, setLicenses] = useState<License[]>([
    { 
      id: '1', 
      agency: 'California State License Board', 
      number: '123456', 
      issueDate: '2023-01-15',
      expirationDate: '2025-01-15' 
    }
  ]);

  const addLicense = () => {
    const newId = (Math.max(0, ...licenses.map(l => parseInt(l.id))) + 1).toString();
    setLicenses([
      ...licenses, 
      { id: newId, agency: '', number: '', issueDate: '', expirationDate: '' }
    ]);
  };

  const removeLicense = (id: string) => {
    setLicenses(licenses.filter(license => license.id !== id));
  };

  const updateLicense = (id: string, field: keyof License, value: string) => {
    setLicenses(licenses.map(license => 
      license.id === id ? { ...license, [field]: value } : license
    ));
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">License Information</h2>
      
      {licenses.map((license, index) => (
        <div key={license.id} className="p-4 border rounded-md bg-gray-50 relative">
          <button
            type="button"
            onClick={() => removeLicense(license.id)}
            className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
            aria-label="Remove license"
          >
            <X className="h-4 w-4" />
          </button>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <Label htmlFor={`agency-${license.id}`}>Issuing Agency/State</Label>
              <Input
                id={`agency-${license.id}`}
                value={license.agency}
                onChange={(e) => updateLicense(license.id, 'agency', e.target.value)}
                placeholder="Enter agency or state name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`number-${license.id}`}>License Number</Label>
              <Input
                id={`number-${license.id}`}
                value={license.number}
                onChange={(e) => updateLicense(license.id, 'number', e.target.value)}
                placeholder="Enter license number"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`issue-date-${license.id}`}>Issue Date</Label>
              <Input
                id={`issue-date-${license.id}`}
                type="date"
                value={license.issueDate}
                onChange={(e) => updateLicense(license.id, 'issueDate', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`expiration-date-${license.id}`}>Expiration Date</Label>
              <Input
                id={`expiration-date-${license.id}`}
                type="date"
                value={license.expirationDate}
                onChange={(e) => updateLicense(license.id, 'expirationDate', e.target.value)}
              />
            </div>
          </div>
        </div>
      ))}
      
      <Button 
        type="button"
        variant="outline" 
        onClick={addLicense}
        className="flex items-center gap-2 text-amber-600 border-amber-300 hover:bg-amber-50"
      >
        <Plus className="h-4 w-4" />
        <span>Add License</span>
      </Button>
    </div>
  );
};

export default ContractorLicenseSection;
