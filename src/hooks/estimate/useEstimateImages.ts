
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function useEstimateImages() {
  const { toast } = useToast();
  const [estimateImages, setEstimateImages] = useState<File[]>([]);

  const handleAddEstimateImage = (files: File[]) => {
    setEstimateImages(prev => [...prev, ...files]);
    if (files.length === 1) {
      toast({
        title: "Image Added",
        description: `${files[0].name} will be uploaded when saving the estimate.`,
      });
    } else {
      toast({
        title: "Images Added",
        description: `${files.length} images will be uploaded when saving the estimate.`,
      });
    }
  };

  const handleRemoveEstimateImage = (index: number) => {
    setEstimateImages(prev => prev.filter((_, i) => i !== index));
    toast({
      title: "Image Removed",
      description: "The image has been removed from the upload queue.",
    });
  };

  return {
    estimateImages,
    handleAddEstimateImage,
    handleRemoveEstimateImage
  };
}
