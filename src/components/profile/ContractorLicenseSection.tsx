
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import type { ContractorLicense, LicenseFormData } from '@/types/license';
import { getContractorLicenses, addContractorLicense, updateContractorLicense, deleteContractorLicense } from '@/services/licenseService';
import { LicenseCard } from './licenses/LicenseCard';
import { AddLicenseDialog } from './licenses/AddLicenseDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

const ContractorLicenseSection: React.FC = () => {
  const { toast } = useToast();
  const { user } = useSupabaseAuth();
  const [loading, setLoading] = useState(false);
  const [licenses, setLicenses] = useState<ContractorLicense[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingLicense, setEditingLicense] = useState<ContractorLicense | null>(null);
  const [licenseToDelete, setLicenseToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchLicenses = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const licenseData = await getContractorLicenses(user.id);
        setLicenses(licenseData);
      } catch (error) {
        console.error('Error fetching licenses:', error);
        toast({
          title: "Error",
          description: "Failed to load license information",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLicenses();
  }, [user, toast]);

  const handleAddLicense = () => {
    setEditingLicense(null);
    setIsDialogOpen(true);
  };

  const handleEditLicense = (license: ContractorLicense) => {
    setEditingLicense(license);
    setIsDialogOpen(true);
  };

  const handleDeleteLicense = (licenseId: string) => {
    setLicenseToDelete(licenseId);
  };

  const confirmDeleteLicense = async () => {
    if (!licenseToDelete) return;
    
    try {
      setIsDeleting(true);
      await deleteContractorLicense(licenseToDelete);
      
      setLicenses(licenses.filter(license => license.id !== licenseToDelete));
      
      toast({
        title: "License Deleted",
        description: "Your license has been removed successfully."
      });
    } catch (error) {
      console.error('Error deleting license:', error);
      toast({
        title: "Error",
        description: "Failed to delete license. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
      setLicenseToDelete(null);
    }
  };

  const handleSubmit = async (data: LicenseFormData) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to update your license.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setLoading(true);
      
      if (editingLicense) {
        // Update existing license
        const updatedLicense = await updateContractorLicense(editingLicense.id, data);
        setLicenses(licenses.map(license => 
          license.id === editingLicense.id ? updatedLicense : license
        ));
        
        toast({
          title: "License Updated",
          description: "Your license information has been updated successfully."
        });
      } else {
        // Add new license
        const newLicense = await addContractorLicense(user.id, data);
        setLicenses([...licenses, newLicense]);
        
        toast({
          title: "License Added",
          description: "Your license has been added successfully."
        });
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving license:', error);
      toast({
        title: "Error",
        description: "Failed to save license information. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">License Information</h2>
        <Button 
          onClick={handleAddLicense} 
          disabled={loading}
          variant="outline"
          className="flex items-center gap-1"
        >
          <PlusCircle className="h-4 w-4" />
          Add License
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading...</div>
      ) : licenses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {licenses.map(license => (
            <LicenseCard 
              key={license.id}
              license={license}
              onEdit={handleEditLicense}
              onDelete={handleDeleteLicense}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 border border-dashed rounded-md">
          <p className="text-gray-500">No licenses added yet. Click "Add License" to add your first license.</p>
        </div>
      )}
      
      <AddLicenseDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleSubmit}
        isSubmitting={loading}
        editingLicense={editingLicense}
      />
      
      <AlertDialog open={!!licenseToDelete} onOpenChange={() => setLicenseToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete License</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this license? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteLicense}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ContractorLicenseSection;
