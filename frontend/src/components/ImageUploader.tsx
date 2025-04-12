import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, ImageIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  isAnalyzing: boolean;
}
const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageUpload,
  isAnalyzing
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    toast
  } = useToast();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };
  const processFile = (file: File) => {
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload an image file (jpg, png, bmp etc.)"
      });
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Image must be less than 5MB"
      });
      return;
    }
    setSelectedFile(file);
    onImageUpload(file);

    // Create image preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };
  const handleClick = () => {
    fileInputRef.current?.click();
  };
  return <Card className="w-full max-w-md mx-auto p-4 px-0 py-0">
      <h2 className="text-lg font-semibold text-center mb-2">Upload Cell Image</h2>
      
      <div className={`relative h-40 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${isDragging ? 'border-medical-purple bg-medical-lightPurple/10' : 'border-gray-300 hover:border-medical-purple'}`} onClick={handleClick} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
        {previewUrl ? <div className="w-full h-full relative">
            <img src={previewUrl} alt="Preview" className="w-full h-full object-contain rounded-lg" />
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-opacity rounded-lg flex items-center justify-center">
              <span className="text-transparent hover:text-white">Change image</span>
            </div>
          </div> : <>
            <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
            <p className="text-gray-500 mb-1 text-sm">Drag and drop your cell image here</p>
            <p className="text-xs text-gray-400">or click to browse</p>
          </>}
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={isAnalyzing} />
      </div>
      
      {previewUrl && <div className="mt-2 text-center">
          <p className="text-xs font-medium text-gray-500">
            {selectedFile?.name}
          </p>
        </div>}
    </Card>;
};
export default ImageUploader;