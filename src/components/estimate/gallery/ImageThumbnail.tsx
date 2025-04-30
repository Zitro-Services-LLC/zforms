
import React from 'react';
import { ZoomIn, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { EstimateImage } from '@/types/database.d';
import { getEstimateImageUrl } from '@/services/estimate';

interface ImageThumbnailProps {
  image: EstimateImage;
  onPreview: (image: EstimateImage) => void;
  onDelete: (image: EstimateImage) => void;
  readOnly?: boolean;
}

const ImageThumbnail: React.FC<ImageThumbnailProps> = ({
  image,
  onPreview,
  onDelete,
  readOnly = false
}) => {
  return (
    <div className="relative border rounded-md overflow-hidden group">
      <img 
        src={getEstimateImageUrl(image.storage_path)} 
        alt={image.caption || image.file_name}
        className="w-full h-24 object-cover"
      />
      
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
        <div className="flex gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 bg-white bg-opacity-90 hover:bg-opacity-100"
                onClick={() => onPreview(image)}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Preview</TooltipContent>
          </Tooltip>
          
          {!readOnly && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 bg-white bg-opacity-90 hover:bg-opacity-100"
                  onClick={() => onDelete(image)}
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Delete</TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>
      
      {image.caption && (
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-xs text-white p-1 truncate">
          {image.caption}
        </div>
      )}
    </div>
  );
};

export default ImageThumbnail;
