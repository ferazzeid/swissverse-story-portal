import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, X, Edit2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface GlossaryInlineEditorProps {
  termId: string;
  field: 'term' | 'definition' | 'category' | 'term_slug' | 'meta_title' | 'meta_description';
  currentValue: string;
  onUpdate: (field: string, value: string) => void;
  className?: string;
  multiline?: boolean;
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

export const GlossaryInlineEditor = ({ 
  termId, 
  field, 
  currentValue, 
  onUpdate, 
  className = "",
  multiline = false 
}: GlossaryInlineEditorProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(currentValue);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    setValue(currentValue);
  }, [currentValue]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (inputRef.current instanceof HTMLInputElement || inputRef.current instanceof HTMLTextAreaElement) {
        inputRef.current.select();
      }
    }
  }, [isEditing]);

  const handleSave = async () => {
    if (value === currentValue) {
      setIsEditing(false);
      return;
    }

    setIsLoading(true);
    try {
      const updateData: any = { [field]: value };
      
      // Auto-generate slug if editing term
      if (field === 'term') {
        updateData.term_slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      }

      const { error } = await supabase
        .from('glossary_terms')
        .update(updateData)
        .eq('id', termId);

      if (error) throw error;

      onUpdate(field, value);
      if (field === 'term' && updateData.term_slug) {
        onUpdate('term_slug', updateData.term_slug);
      }
      
      setIsEditing(false);
      toast({
        title: "Success",
        description: `${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully`,
      });
    } catch (error) {
      console.error('Error updating term:', error);
      toast({
        title: "Error",
        description: "Failed to update term",
        variant: "destructive",
      });
      setValue(currentValue);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setValue(currentValue);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Enter' && e.ctrlKey && multiline) {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  if (!isEditing) {
    return (
      <div className={`group relative ${className}`}>
        <span className={field === 'definition' ? 'line-clamp-3' : ''}>
          {currentValue || `No ${field} set`}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsEditing(true)}
          className="absolute -right-8 top-0 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
        >
          <Edit2 className="w-3 h-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {field === 'category' ? (
        <Select value={value} onValueChange={setValue}>
          <SelectTrigger ref={inputRef as any}>
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
      ) : multiline ? (
        <Textarea
          ref={inputRef as any}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="min-h-20"
          placeholder={`Enter ${field}...`}
        />
      ) : (
        <Input
          ref={inputRef as any}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Enter ${field}...`}
        />
      )}
      
      <div className="flex gap-2">
        <Button
          variant="default"
          size="sm"
          onClick={handleSave}
          disabled={isLoading}
        >
          <Save className="w-3 h-3 mr-1" />
          Save
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCancel}
          disabled={isLoading}
        >
          <X className="w-3 h-3 mr-1" />
          Cancel
        </Button>
      </div>
    </div>
  );
};