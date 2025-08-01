import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Pencil, Check, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface InlineTextEditorProps {
  momentId: string;
  field: 'title' | 'content' | 'highlight' | 'month';
  currentValue: string;
  onUpdate: (field: string, newValue: string) => void;
  className?: string;
  multiline?: boolean;
}

export const InlineTextEditor = ({ 
  momentId, 
  field, 
  currentValue, 
  onUpdate, 
  className = '',
  multiline = false 
}: InlineTextEditorProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(currentValue);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      if (inputRef.current instanceof HTMLInputElement || inputRef.current instanceof HTMLTextAreaElement) {
        inputRef.current.select();
      }
    }
  }, [isEditing]);

  const handleSave = async () => {
    if (value.trim() === currentValue) {
      setIsEditing(false);
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('timeline_content')
        .update({ [field]: value.trim() })
        .eq('id', momentId);

      if (error) throw error;

      onUpdate(field, value.trim());
      setIsEditing(false);
      
      toast({
        title: "Success",
        description: `${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully`
      });
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to update ${field}`
      });
      setValue(currentValue); // Reset to original value
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
    } else if (e.key === 'Escape') {
      handleCancel();
    } else if (e.key === 'Enter' && e.ctrlKey && multiline) {
      e.preventDefault();
      handleSave();
    }
  };

  if (!isEditing) {
    return (
      <div className={`group relative inline-block ${className}`}>
        <span className="cursor-pointer hover:bg-muted/20 rounded px-1 py-0.5 transition-colors">
          {currentValue}
        </span>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setIsEditing(true)}
          className="opacity-0 group-hover:opacity-100 absolute -top-1 -right-6 h-6 w-6 p-0 transition-opacity"
          title={`Edit ${field}`}
        >
          <Pencil className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className="relative">
      {multiline ? (
        <Textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className={`min-h-[80px] ${className}`}
          disabled={isLoading}
        />
      ) : (
        <Input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className={className}
          disabled={isLoading}
        />
      )}
      
      <div className="flex gap-1 mt-2">
        <Button
          size="sm"
          onClick={handleSave}
          disabled={isLoading || !value.trim()}
          className="h-6 px-2"
        >
          <Check className="h-3 w-3" />
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={handleCancel}
          disabled={isLoading}
          className="h-6 px-2"
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
      
      {multiline && (
        <div className="text-xs text-muted-foreground mt-1">
          Press Ctrl+Enter to save, Escape to cancel
        </div>
      )}
    </div>
  );
};