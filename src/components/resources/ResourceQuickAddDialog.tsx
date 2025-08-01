import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ResourceQuickAddDialogProps {
  isOpen: boolean;
  onClose: () => void;
  displayOrder: number;
  onResourceAdded: () => void;
}

const CATEGORY_OPTIONS = ['development', 'assets', 'community', 'docs', 'learning', 'templates'];
const ICON_OPTIONS = ['Code', 'Palette', 'Users', 'BookOpen', 'GraduationCap', 'Layout', 'Zap', 'Globe'];

export const ResourceQuickAddDialog = ({
  isOpen,
  onClose,
  displayOrder,
  onResourceAdded
}: ResourceQuickAddDialogProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'development',
    icon_name: 'Code',
    link_url: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.description.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Title and description are required"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('resources')
        .insert({
          title: formData.title.trim(),
          description: formData.description.trim(),
          category: formData.category,
          icon_name: formData.icon_name,
          link_url: formData.link_url.trim() || null,
          display_order: displayOrder,
          is_active: true
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Resource added successfully"
      });

      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'development',
        icon_name: 'Code',
        link_url: ''
      });

      onResourceAdded();
    } catch (error) {
      console.error('Error adding resource:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add resource"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      category: 'development',
      icon_name: 'Code',
      link_url: ''
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Resource</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Resource title"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the resource"
              className="min-h-[80px]"
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_OPTIONS.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon">Icon</Label>
              <Select 
                value={formData.icon_name} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, icon_name: value }))}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ICON_OPTIONS.map((icon) => (
                    <SelectItem key={icon} value={icon}>
                      {icon}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="link_url">Link URL (optional)</Label>
            <Input
              id="link_url"
              type="url"
              value={formData.link_url}
              onChange={(e) => setFormData(prev => ({ ...prev, link_url: e.target.value }))}
              placeholder="https://..."
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Adding...' : 'Add Resource'}
            </Button>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};