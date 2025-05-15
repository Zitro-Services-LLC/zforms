
import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { supabase } from '@/integrations/supabase/client';

interface DownloadPdfButtonProps {
  documentType: 'estimate' | 'contract' | 'invoice';
  documentId: string;
  compact?: boolean;
}

const DownloadPdfButton: React.FC<DownloadPdfButtonProps> = ({ 
  documentType, 
  documentId, 
  compact = false 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSupabaseAuth();
  const { toast } = useToast();

  const handleDownload = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to download documents.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      console.log(`Requesting PDF for ${documentType} ${documentId}`);
      
      const { data, error } = await supabase.functions.invoke('generate-pdf', {
        body: { documentType, documentId }
      });
      
      if (error) {
        console.error(`Error generating PDF: ${error.message}`);
        throw new Error(error.message);
      }
      
      if (!data || !data.fileUrl) {
        throw new Error("No file URL returned");
      }
      
      console.log(`PDF generated, downloading from: ${data.fileUrl}`);
      
      // Create download link
      const link = document.createElement('a');
      link.href = data.fileUrl;
      link.setAttribute('download', `${documentType}-${documentId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Download started",
        description: `Your ${documentType} PDF has been downloaded.`
      });
    } catch (error) {
      console.error(`Error downloading ${documentType}:`, error);
      toast({
        title: "Download Failed",
        description: error instanceof Error ? error.message : `There was an error downloading your ${documentType}.`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (compact) {
    return (
      <button
        onClick={handleDownload}
        disabled={isLoading}
        className="p-1 text-gray-500 hover:text-amber-600 disabled:opacity-50"
        title={`Download ${documentType} as PDF`}
      >
        {isLoading ? (
          <svg className="animate-spin h-5 w-5 text-amber-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <Download className="w-5 h-5" />
        )}
      </button>
    );
  }

  return (
    <Button
      onClick={handleDownload}
      disabled={isLoading}
      variant="outline"
      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
    >
      {isLoading ? (
        <svg className="animate-spin h-5 w-5 mr-2 -ml-1 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <Download className="h-5 w-5 mr-2 -ml-1 text-gray-500" />
      )}
      Download PDF
    </Button>
  );
};

export default DownloadPdfButton;
