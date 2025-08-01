import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { GlossaryQuickAddDialog } from "./GlossaryQuickAddDialog";

interface GlossaryInsertIndicatorProps {
  beforeTermId?: string;
  afterDisplayOrder?: number;
  onTermAdded: () => void;
}

export const GlossaryInsertIndicator = ({ 
  beforeTermId, 
  afterDisplayOrder = 0, 
  onTermAdded 
}: GlossaryInsertIndicatorProps) => {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <div className="flex justify-center py-2 opacity-0 hover:opacity-100 transition-opacity group-hover:opacity-100">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowDialog(true)}
          className="h-8 px-3 text-xs border-dashed border-primary/50 hover:border-primary bg-background/50 hover:bg-primary/10"
        >
          <Plus className="w-3 h-3 mr-1" />
          Add Term
        </Button>
      </div>

      <GlossaryQuickAddDialog
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
        onTermAdded={() => {
          onTermAdded();
          setShowDialog(false);
        }}
        afterDisplayOrder={afterDisplayOrder}
      />
    </>
  );
};