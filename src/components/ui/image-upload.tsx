import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Image, Loader2 } from "lucide-react";

interface ImageUploadProps {
  bucket: string;
  onUploadComplete: (url: string) => void;
  currentImage?: string;
  className?: string;
  maxSizeMB?: number;
  acceptedTypes?: string[];
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  bucket,
  onUploadComplete,
  currentImage,
  className = "",
  maxSizeMB = 5,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
}) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    // Check file type
    if (!acceptedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: `Please select a valid image file (${acceptedTypes.join(', ')})`,
        variant: "destructive",
      });
      return false;
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      toast({
        title: "File too large",
        description: `Please select an image smaller than ${maxSizeMB}MB`,
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const generateFileName = (originalName: string): string => {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const extension = originalName.split('.').pop();
    return `${timestamp}-${randomStr}.${extension}`;
  };

  const uploadFile = async (file: File) => {
    if (!validateFile(file)) return;

    setIsUploading(true);
    
    try {
      const fileName = generateFileName(file.name);
      const filePath = fileName;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(data.path);

      const publicUrl = publicUrlData.publicUrl;
      
      setPreviewUrl(publicUrl);
      onUploadComplete(publicUrl);
      
      toast({
        title: "Upload successful",
        description: "Image uploaded successfully!",
      });

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed", 
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const clearImage = () => {
    setPreviewUrl(null);
    onUploadComplete('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const displayImage = previewUrl || currentImage;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Current/Preview Image */}
      {displayImage && (
        <div className="relative">
          <img
            src={displayImage}
            alt="Preview"
            className="w-full max-w-xs h-32 object-cover rounded-lg border"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={clearImage}
          >
            <X size={16} />
          </Button>
        </div>
      )}

      {/* Upload Area */}
      <div
        className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {isUploading ? (
          <div className="flex flex-col items-center space-y-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <Image className="h-8 w-8 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Click to upload or drag and drop</p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, WebP up to {maxSizeMB}MB
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Upload Button */}
      <Button
        type="button"
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="w-full"
      >
        <Upload size={16} className="mr-2" />
        Choose Image
      </Button>
    </div>
  );
};