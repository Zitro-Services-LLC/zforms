
import React, { useState } from 'react';
import { 
  Upload, X, Image as ImageIcon, 
  ZoomIn, Download, Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from "@/hooks/use-toast";
import { getEstimateImageUrl, deleteEstimateImage } from '@/services/estimateService';
import type { EstimateImage } from '@/types/database.d';

interface EstimateImageGalleryProps {
  images: EstimateImage[];
  onImagesChange?: (images: EstimateImage[]) => void;
  onAddImages?: (files: File[]) => void;
  readOnly?: boolean;
  className?: string;
}

const EstimateImageGallery: React.FC<EstimateImageGalleryProps> = ({
  images,
  onImagesChange,
  onAddImages,
  readOnly = false,
  className = ""
}) => {
  const { toast } = useToast();
  const [previewImage, setPreviewImage] = useState<EstimateImage | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0 && onAddImages) {
      const filesArray = Array.from(event.target.files);
      
      // Check file types and sizes
      const validFiles = filesArray.filter(file => {
        if (!file.type.startsWith('image/')) {
          toast({
            title: "Invalid File Type",
            description: `${file.name} is not an image file.`,
            variant: "destructive"
          });
          return false;
        }
        
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
          toast({
            title: "File Too Large",
            description: `${file.name} exceeds the 5MB size limit.`,
            variant: "destructive"
          });
          return false;
        }
        
        return true;
      });
      
      if (validFiles.length > 0) {
        onAddImages(validFiles);
      }
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteImage = async (image: EstimateImage) => {
    if (readOnly) return;
    
    try {
      await deleteEstimateImage(image.id);
      if (onImagesChange) {
        onImagesChange(images.filter(img => img.id !== image.id));
      }
      toast({
        title: "Image Deleted",
        description: "Image was successfully deleted.",
      });
    } catch (error) {
      console.error("Error deleting image:", error);
      toast({
        title: "Delete Failed",
        description: "Failed to delete the image. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className={className}>
      <div className="mb-3 flex justify-between items-center">
        <h3 className="font-semibold text-gray-700">Images</h3>
        
        {!readOnly && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1"
          >
            <Upload className="w-4 h-4 mr-1" />
            Add Images
          </Button>
        )}
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          accept="image/*"
          className="hidden"
        />
      </div>
      
      {images.length === 0 ? (
        <div className="border border-dashed rounded-lg p-8 text-center text-gray-500 bg-gray-50">
          <ImageIcon className="w-12 h-12 mx-auto mb-2 text-gray-400" />
          <p>No images have been added to this estimate</p>
          
          {!readOnly && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="mt-4"
            >
              <Upload className="w-4 h-4 mr-1" />
              Upload Images
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {images.map((image) => (
            <div 
              key={image.id} 
              className="relative border rounded-md overflow-hidden group"
            >
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
                        onClick={() => setPreviewImage(image)}
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
                          onClick={() => handleDeleteImage(image)}
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
          ))}
        </div>
      )}
      
      <Dialog open={!!previewImage} onOpenChange={(open) => !open && setPreviewImage(null)}>
        <DialogContent className="max-w-3xl">
          {previewImage && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">{previewImage.caption || previewImage.file_name}</h2>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setPreviewImage(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="bg-gray-100 rounded-lg p-2 flex justify-center">
                <img 
                  src={getEstimateImageUrl(previewImage.storage_path)} 
                  alt={previewImage.caption || previewImage.file_name}
                  className="max-h-[70vh] object-contain"
                />
              </div>
              
              <div className="flex justify-between text-sm text-gray-500">
                <span>Uploaded: {new Date(previewImage.created_at).toLocaleString()}</span>
                <span>
                  {previewImage.size ? `${(previewImage.size / 1024).toFixed(1)} KB` : ''}
                </span>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline"
                  onClick={() => window.open(getEstimateImageUrl(previewImage.storage_path), '_blank')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EstimateImageGallery;
