
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileUploadGalleryProps {
  files: File[];
  onAddFiles: (files: File[]) => void;
  onRemoveFile: (index: number) => void;
  className?: string;
}

const FileUploadGallery: React.FC<FileUploadGalleryProps> = ({
  files,
  onAddFiles,
  onRemoveFile,
  className = ''
}) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
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
        onAddFiles(validFiles);
      }
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className={className}>
      <div className="mb-3 flex justify-between items-center">
        <h3 className="font-semibold text-gray-700">Pending Uploads</h3>
        
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1"
        >
          <Upload className="w-4 h-4 mr-1" />
          Add Images
        </Button>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          accept="image/*"
          className="hidden"
        />
      </div>
      
      {files.length === 0 ? (
        <div className="border border-dashed rounded-lg p-4 text-center text-gray-500">
          <p>No images queued for upload</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {files.map((file, index) => (
            <div 
              key={index} 
              className="relative border rounded-md overflow-hidden group"
            >
              <img 
                src={URL.createObjectURL(file)}
                alt={file.name}
                className="w-full h-24 object-cover"
              />
              
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 bg-white bg-opacity-90 hover:bg-opacity-100"
                  onClick={() => onRemoveFile(index)}
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-xs text-white p-1 truncate">
                {file.name}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploadGallery;
