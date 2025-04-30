
import React, { useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { deleteEstimateImage } from '@/services/estimate';
import type { EstimateImage } from '@/types/database.d';
import ImageGallery from './gallery/ImageGallery';
import ImagePreviewDialog from './gallery/ImagePreviewDialog';
import EmptyGalleryState from './gallery/EmptyGalleryState';

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
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  
  const handleUploadClick = () => fileInputRef.current?.click();

  return (
    <div className={className}>
      <div className="mb-3 flex justify-between items-center">
        <h3 className="font-semibold text-gray-700">Images</h3>
        
        {!readOnly && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleUploadClick}
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
        <EmptyGalleryState 
          onUploadClick={handleUploadClick} 
          readOnly={readOnly} 
        />
      ) : (
        <ImageGallery 
          images={images}
          onImagePreview={setPreviewImage}
          onImageDelete={handleDeleteImage}
          readOnly={readOnly}
        />
      )}
      
      <ImagePreviewDialog
        image={previewImage}
        open={!!previewImage}
        onOpenChange={(open) => !open && setPreviewImage(null)}
      />
    </div>
  );
};

export default EstimateImageGallery;
