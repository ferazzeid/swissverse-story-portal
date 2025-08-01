import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ImageUpload } from '@/components/ui/image-upload';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Trash2 } from 'lucide-react';

interface ImageUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  momentId: string;
  currentImageUrl?: string;
  onImageUpdate: (newImageUrl: string | null) => void;
}

export const ImageUploadDialog = ({ 
  isOpen, 
  onClose, 
  momentId, 
  currentImageUrl, 
  onImageUpdate 
}: ImageUploadDialogProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleImageUpload = async (url: string) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('timeline_content')
        .update({ image_url: url })
        .eq('id', momentId);

      if (error) throw error;

      onImageUpdate(url);
      toast({
        title: "Success",
        description: "Timeline image updated successfully",
      });
      onClose();
    } catch (error) {
      console.error('Error updating timeline image:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update timeline image",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveImage = async () => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('timeline_content')
        .update({ image_url: null })
        .eq('id', momentId);

      if (error) throw error;

      onImageUpdate(null);
      toast({
        title: "Success",
        description: "Timeline image removed successfully",
      });
      onClose();
    } catch (error) {
      console.error('Error removing timeline image:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove timeline image",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {currentImageUrl ? 'Update Timeline Image' : 'Add Timeline Image'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <ImageUpload
            bucket="timeline-images"
            onUploadComplete={handleImageUpload}
            currentImage={currentImageUrl}
            className="w-full"
          />
          
          {currentImageUrl && (
            <div className="flex justify-between items-center pt-4 border-t">
              <span className="text-sm text-muted-foreground">
                Remove current image
              </span>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleRemoveImage}
                disabled={isUpdating}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remove Image
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};