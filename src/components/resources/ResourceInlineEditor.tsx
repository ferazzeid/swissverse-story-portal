import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pencil, Check, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ResourceInlineEditorProps {
  resourceId: string;
  field: 'title' | 'description' | 'category' | 'link_url';
  currentValue: string;
  onUpdate: (field: string, newValue: string) => void;
  className?: string;
  multiline?: boolean;
  selectOptions?: string[];
}

const CATEGORY_OPTIONS = ['development', 'assets', 'community', 'docs', 'learning', 'templates'];

export const ResourceInlineEditor = ({ 
  resourceId, 
  field, 
  currentValue, 
  onUpdate, 
  className = '',
  multiline = false,
  selectOptions 
}: ResourceInlineEditorProps) => {
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
        .from('resources')
        .update({ [field]: value.trim() })
        .eq('id', resourceId);

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
    } else if (e.key === 'Escape') {
      handleCancel();
    } else if (e.key === 'Enter' && e.ctrlKey && multiline) {
      e.preventDefault();
      handleSave();
    }
  };

  const getFieldColor = () => {
    switch (field) {
      case 'title': return 'text-blue-500 hover:text-blue-600';
      case 'description': return 'text-green-500 hover:text-green-600';
      case 'category': return 'text-purple-500 hover:text-purple-600';
      case 'link_url': return 'text-orange-500 hover:text-orange-600';
      default: return 'text-muted-foreground hover:text-foreground';
    }
  };

  if (!isEditing) {
    return (
      <div className={`group inline-flex items-center gap-1 ${className}`}>
        <span className="cursor-pointer hover:bg-muted/20 rounded px-1 py-0.5 transition-colors min-w-0">
          {currentValue}
        </span>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setIsEditing(true)}
          className={`opacity-0 group-hover:opacity-100 h-5 w-5 p-0 transition-all duration-200 ${getFieldColor()}`}
          title={`Edit ${field}`}
        >
          <Pencil className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className="relative">
      {field === 'category' ? (
        <Select value={value} onValueChange={setValue} disabled={isLoading}>
          <SelectTrigger className={className}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CATEGORY_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : multiline ? (
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
          placeholder={field === 'link_url' ? 'https://...' : ''}
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