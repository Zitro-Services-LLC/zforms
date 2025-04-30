
import React from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyGalleryStateProps {
  onUploadClick: () => void;
  readOnly?: boolean;
}

const EmptyGalleryState: React.FC<EmptyGalleryStateProps> = ({ 
  onUploadClick,
  readOnly = false
}) => {
  return (
    <div className="border border-dashed rounded-lg p-8 text-center text-gray-500 bg-gray-50">
      <ImageIcon className="w-12 h-12 mx-auto mb-2 text-gray-400" />
      <p>No images have been added to this estimate</p>
      
      {!readOnly && (
        <Button 
          variant="outline" 
          size="sm"
          onClick={onUploadClick}
          className="mt-4"
        >
          <Upload className="w-4 h-4 mr-1" />
          Upload Images
        </Button>
      )}
    </div>
  );
};

export default EmptyGalleryState;
