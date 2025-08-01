import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { QuickAddDialog } from './QuickAddDialog';

interface InsertPointIndicatorProps {
  year: number;
  afterMomentId?: string;
  beforeMomentId?: string;
  displayOrder: number;
  onMomentAdded: () => void;
}

export const InsertPointIndicator = ({ 
  year, 
  afterMomentId, 
  beforeMomentId, 
  displayOrder, 
  onMomentAdded 
}: InsertPointIndicatorProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <div 
        className="relative h-8 flex items-center justify-center group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Insert line - only visible on hover */}
        <div className={`absolute inset-x-0 h-0.5 bg-gradient-to-r from-purple-500 to-cyan-500 transition-opacity duration-200 ${
          isHovered ? 'opacity-50' : 'opacity-0'
        }`} />
        
        {/* Insert button */}
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsDialogOpen(true)}
          className={`h-8 w-8 p-0 rounded-full border-2 border-dashed transition-all duration-200 ${
            isHovered 
              ? 'opacity-100 scale-100 border-purple-500 bg-purple-500/10 hover:bg-purple-500/20' 
              : 'opacity-0 scale-90'
          }`}
          title="Add moment here"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <QuickAddDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        year={year}
        displayOrder={displayOrder}
        onMomentAdded={() => {
          onMomentAdded();
          setIsDialogOpen(false);
        }}
      />
    </>
  );
};