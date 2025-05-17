
import React, { useState } from 'react';
import { Download, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { supabase, SUPABASE_FUNCTIONS_PATH, SUPABASE_PUBLISHABLE_KEY } from '@/integrations/supabase/client';

interface DownloadPdfButtonProps {
  documentType: 'estimate' | 'contract' | 'invoice';
  documentId: string;
  compact?: boolean;
}

type PDFMode = 'download' | 'preview';

const DownloadPdfButton: React.FC<DownloadPdfButtonProps> = ({ 
  documentType, 
  documentId, 
  compact = false 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSupabaseAuth();
  const { toast } = useToast();

  const handlePdfAction = async (mode: PDFMode) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "You must be logged in to access documents.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      console.log(`Requesting PDF for ${documentType} ${documentId} in ${mode} mode`);
      
      // Get auth token for the request
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      
      if (!token) {
        throw new Error("Authentication token not available");
      }
      
      // Call the edge function with mode parameter
      const functionUrl = `${SUPABASE_FUNCTIONS_PATH}/generate-pdf?type=${documentType}&id=${documentId}&mode=${mode}`;
      
      const response = await fetch(functionUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'apikey': SUPABASE_PUBLISHABLE_KEY
        }
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error(`PDF generation error (${response.status}):`, errorData);
        throw new Error(`Error generating PDF: ${response.statusText}`);
      }
      
      // Get the PDF as a blob
      const pdfBlob = await response.blob();
      
      // Create download link
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      
      // Set attributes based on mode
      if (mode === 'download') {
        link.setAttribute('download', `${documentType}-${documentId}.pdf`);
      }
      
      // Always open in new tab for preview mode, and as safety fallback for download
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: mode === 'preview' ? "Preview opened" : "Download started",
        description: `Your ${documentType} PDF has been ${mode === 'preview' ? 'opened in a new tab' : 'downloaded'}.`
      });
    } catch (error) {
      console.error(`Error ${mode === 'preview' ? 'previewing' : 'downloading'} ${documentType}:`, error);
      toast({
        title: mode === 'preview' ? "Preview Failed" : "Download Failed",
        description: error instanceof Error ? error.message : `There was an error with your ${documentType} PDF.`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (compact) {
    return (
      <div className="flex space-x-1">
        <button
          onClick={() => handlePdfAction('preview')}
          disabled={isLoading}
          className="p-1 text-gray-500 hover:text-amber-600 disabled:opacity-50"
          title={`Preview ${documentType} as PDF`}
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-amber-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <Eye className="w-5 h-5" />
          )}
        </button>
        <button
          onClick={() => handlePdfAction('download')}
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
      </div>
    );
  }

  return (
    <div className="flex space-x-2">
      <Button
        onClick={() => handlePdfAction('preview')}
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
          <Eye className="h-5 w-5 mr-2 -ml-1 text-gray-500" />
        )}
        Preview PDF
      </Button>
      <Button
        onClick={() => handlePdfAction('download')}
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
    </div>
  );
};

export default DownloadPdfButton;
