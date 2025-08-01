import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ResourceQuickAddDialog } from './ResourceQuickAddDialog';

interface ResourceInsertIndicatorProps {
  afterResourceId?: string;
  displayOrder: number;
  onResourceAdded: () => void;
}

export const ResourceInsertIndicator = ({ 
  afterResourceId, 
  displayOrder, 
  onResourceAdded 
}: ResourceInsertIndicatorProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <div 
        className="relative h-6 flex items-center justify-center group col-span-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Insert line - only visible on hover */}
        <div className={`absolute inset-x-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-opacity duration-200 ${
          isHovered ? 'opacity-50' : 'opacity-0'
        }`} />
        
        {/* Insert button */}
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsDialogOpen(true)}
          className={`h-6 w-6 p-0 rounded-full border-2 border-dashed transition-all duration-200 ${
            isHovered 
              ? 'opacity-100 scale-100 border-blue-500 bg-blue-500/10 hover:bg-blue-500/20' 
              : 'opacity-0 scale-90'
          }`}
          title="Add resource here"
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>

      <ResourceQuickAddDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        displayOrder={displayOrder}
        onResourceAdded={() => {
          onResourceAdded();
          setIsDialogOpen(false);
        }}
      />
    </>
  );
};