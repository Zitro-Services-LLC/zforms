
import React from 'react';
import type { EstimateImage } from '@/types/database.d';
import ImageThumbnail from './ImageThumbnail';

interface ImageGalleryProps {
  images: EstimateImage[];
  onImagePreview: (image: EstimateImage) => void;
  onImageDelete: (image: EstimateImage) => void;
  readOnly?: boolean;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  onImagePreview,
  onImageDelete,
  readOnly = false
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {images.map((image) => (
        <ImageThumbnail
          key={image.id}
          image={image}
          onPreview={onImagePreview}
          onDelete={onImageDelete}
          readOnly={readOnly}
        />
      ))}
    </div>
  );
};

export default ImageGallery;
