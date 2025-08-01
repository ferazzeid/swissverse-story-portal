import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface GlossaryQuickAddDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onTermAdded: () => void;
  afterDisplayOrder?: number;
}

const categoryOptions = [
  { value: 'blockchain', label: 'Blockchain' },
  { value: 'metaverse', label: 'Metaverse' },
  { value: 'technical', label: 'Technical' },
  { value: 'platforms', label: 'Platforms' },
  { value: 'general', label: 'General' },
  { value: 'identity', label: 'Identity' },
  { value: 'infrastructure', label: 'Infrastructure' },
  { value: 'finance', label: 'Finance' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'ai', label: 'AI' }
];

export const GlossaryQuickAddDialog = ({ 
  isOpen, 
  onClose, 
  onTermAdded, 
  afterDisplayOrder = 0 
}: GlossaryQuickAddDialogProps) => {
  const [term, setTerm] = useState("");
  const [definition, setDefinition] = useState("");
  const [category, setCategory] = useState("general");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const resetForm = () => {
    setTerm("");
    setDefinition("");
    setCategory("general");
  };

  const generateSlug = (term: string) => {
    return term.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  };

  const handleSave = async () => {
    if (!term.trim() || !definition.trim()) {
      toast({
        title: "Validation Error",
        description: "Term and definition are required",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const slug = generateSlug(term);
      
      const { error } = await supabase
        .from('glossary_terms')
        .insert({
          term: term.trim(),
          definition: definition.trim(),
          category,
          term_slug: slug,
          display_order: afterDisplayOrder + 1,
          is_active: true
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Glossary term added successfully",
      });

      resetForm();
      onTermAdded();
    } catch (error) {
      console.error('Error adding term:', error);
      toast({
        title: "Error",
        description: "Failed to add glossary term",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      resetForm();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add New Glossary Term</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="term">Term *</Label>
            <Input
              id="term"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="Enter glossary term"
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="definition">Definition *</Label>
            <Textarea
              id="definition"
              value={definition}
              onChange={(e) => setDefinition(e.target.value)}
              placeholder="Enter definition"
              className="min-h-20"
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory} disabled={isLoading}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
            >
              {isLoading ? "Adding..." : "Add Term"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};