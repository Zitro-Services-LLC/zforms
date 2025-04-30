
import React from 'react';
import { X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import type { EstimateImage } from '@/types/database.d';
import { getEstimateImageUrl } from '@/services/estimate';

interface ImagePreviewDialogProps {
  image: EstimateImage | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ImagePreviewDialog: React.FC<ImagePreviewDialogProps> = ({
  image,
  open,
  onOpenChange
}) => {
  if (!image) return null;
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">{image.caption || image.file_name}</h2>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="bg-gray-100 rounded-lg p-2 flex justify-center">
            <img 
              src={getEstimateImageUrl(image.storage_path)} 
              alt={image.caption || image.file_name}
              className="max-h-[70vh] object-contain"
            />
          </div>
          
          <div className="flex justify-between text-sm text-gray-500">
            <span>Uploaded: {new Date(image.created_at).toLocaleString()}</span>
            <span>
              {image.size ? `${(image.size / 1024).toFixed(1)} KB` : ''}
            </span>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline"
              onClick={() => window.open(getEstimateImageUrl(image.storage_path), '_blank')}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImagePreviewDialog;
