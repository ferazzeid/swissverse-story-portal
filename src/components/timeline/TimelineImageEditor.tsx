import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ImageIcon, Pencil, Plus } from 'lucide-react';
import { ImageUploadDialog } from './ImageUploadDialog';

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

  return (
    <>
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setIsDialogOpen(true)}
          className="h-8 w-8 p-0"
        >
          {currentImageUrl ? (
            <Pencil className="h-3 w-3" />
          ) : (
            <Plus className="h-3 w-3" />
          )}
        </Button>
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