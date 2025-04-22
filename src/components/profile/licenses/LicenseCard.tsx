
import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { formatDistanceToNow } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import type { ContractorLicense } from '@/types/license';
import { getLicenseStatus, getDaysUntilExpiry } from '@/types/license';

interface LicenseCardProps {
  license: ContractorLicense;
  onEdit: (license: ContractorLicense) => void;
  onDelete: (licenseId: string) => void;
}

export const LicenseCard: React.FC<LicenseCardProps> = ({ 
  license, 
  onEdit, 
  onDelete 
}) => {
  const status = getLicenseStatus(license.expiry_date);
  const daysUntilExpiry = getDaysUntilExpiry(license.expiry_date);
  
  const getStatusBadge = () => {
    switch (status) {
      case 'valid':
        return (
          <Badge className="bg-green-100 text-green-800 border-green-300">
            Valid
          </Badge>
        );
      case 'warning':
        return (
          <Badge className="bg-amber-100 text-amber-800 border-amber-300">
            Expiring Soon
          </Badge>
        );
      case 'expired':
        return (
          <Badge className="bg-red-100 text-red-800 border-red-300">
            Expired
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <Card className={`overflow-hidden ${
      status === 'expired' ? 'border-red-300' :
      status === 'warning' ? 'border-amber-300' : 'border-gray-200'
    }`}>
      <div className={`h-2 w-full ${
        status === 'expired' ? 'bg-red-500' :
        status === 'warning' ? 'bg-amber-500' : 'bg-green-500'
      }`} />
      <CardContent className="pt-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold">{license.license_no}</h3>
            <p className="text-sm text-gray-500">{license.agency}</p>
          </div>
          {getStatusBadge()}
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Issue Date:</span>
            <span>{new Date(license.issue_date).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Expiry Date:</span>
            <span className={status === 'expired' ? 'text-red-600 font-medium' : ''}>
              {new Date(license.expiry_date).toLocaleDateString()}
            </span>
          </div>
          
          <div className="text-sm">
            {daysUntilExpiry > 0 ? (
              <p className={`text-right ${status === 'warning' ? 'text-amber-600' : 'text-gray-500'}`}>
                Expires in {formatDistanceToNow(new Date(license.expiry_date))}
              </p>
            ) : (
              <p className="text-right text-red-600">
                Expired {formatDistanceToNow(new Date(license.expiry_date), { addSuffix: true })}
              </p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 bg-gray-50 py-2">
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-500"
          onClick={() => onEdit(license)}
        >
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="text-red-500"
          onClick={() => onDelete(license.id)}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};
