import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { ImageUploadDialog } from './ImageUploadDialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface TimelineImageEditorProps {
  momentId: string;
  currentImageUrl?: string;
  onImageUpdate: (newImageUrl: string | null) => void;
}

export const TimelineImageEditor = ({ 
  momentId, 
  currentImageUrl, 
  onImageUpdate 
}: TimelineImageEditorProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleDirectDelete = async () => {
    setIsDeleting(true);
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
    } catch (error) {
      console.error('Error removing timeline image:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove timeline image",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1" style={{ zIndex: 9999 }}>
        {currentImageUrl ? (
          // Show edit and delete buttons when image exists
          <>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setIsDialogOpen(true)}
              className="h-8 w-8 p-0"
              title="Edit image"
            >
              <Pencil className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleDirectDelete}
              disabled={isDeleting}
              className="h-8 w-8 p-0"
              title="Delete image"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </>
        ) : (
          // Show add button when no image exists
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setIsDialogOpen(true)}
            className="h-8 w-8 p-0"
            title="Add image"
          >
            <Plus className="h-3 w-3" />
          </Button>
        )}
      </div>

      <ImageUploadDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        momentId={momentId}
        currentImageUrl={currentImageUrl}
        onImageUpdate={onImageUpdate}
      />
    </>
  );
};