import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Pencil } from 'lucide-react';
import * as Icons from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ResourceIconSelectorProps {
  resourceId: string;
  currentIcon: string;
  onUpdate: (newIcon: string) => void;
  className?: string;
}

const iconOptions = [
  { value: 'Code', icon: Icons.Code },
  { value: 'Palette', icon: Icons.Palette },
  { value: 'Users', icon: Icons.Users },
  { value: 'BookOpen', icon: Icons.BookOpen },
  { value: 'GraduationCap', icon: Icons.GraduationCap },
  { value: 'Layout', icon: Icons.Layout },
  { value: 'Zap', icon: Icons.Zap },
  { value: 'Globe', icon: Icons.Globe },
  { value: 'Database', icon: Icons.Database },
  { value: 'Server', icon: Icons.Server },
  { value: 'Smartphone', icon: Icons.Smartphone },
  { value: 'Monitor', icon: Icons.Monitor },
  { value: 'Cloud', icon: Icons.Cloud },
  { value: 'Lock', icon: Icons.Lock },
  { value: 'Shield', icon: Icons.Shield },
  { value: 'Wrench', icon: Icons.Wrench },
  { value: 'Settings', icon: Icons.Settings },
  { value: 'Cpu', icon: Icons.Cpu },
  { value: 'HardDrive', icon: Icons.HardDrive },
  { value: 'Wifi', icon: Icons.Wifi },
  { value: 'Download', icon: Icons.Download },
  { value: 'Upload', icon: Icons.Upload },
  { value: 'Search', icon: Icons.Search },
  { value: 'Filter', icon: Icons.Filter },
  { value: 'BarChart', icon: Icons.BarChart },
  { value: 'PieChart', icon: Icons.PieChart },
  { value: 'TrendingUp', icon: Icons.TrendingUp },
  { value: 'Calendar', icon: Icons.Calendar },
  { value: 'Clock', icon: Icons.Clock },
  { value: 'Mail', icon: Icons.Mail },
  { value: 'MessageSquare', icon: Icons.MessageSquare },
  { value: 'Video', icon: Icons.Video },
  { value: 'Camera', icon: Icons.Camera },
  { value: 'Image', icon: Icons.Image },
  { value: 'FileText', icon: Icons.FileText },
  { value: 'Folder', icon: Icons.Folder },
  { value: 'Archive', icon: Icons.Archive },
  { value: 'Star', icon: Icons.Star },
  { value: 'Heart', icon: Icons.Heart },
  { value: 'Bookmark', icon: Icons.Bookmark },
  { value: 'Flag', icon: Icons.Flag },
  { value: 'Target', icon: Icons.Target },
  { value: 'Award', icon: Icons.Award },
  { value: 'Trophy', icon: Icons.Trophy },
  { value: 'Gift', icon: Icons.Gift },
  { value: 'ShoppingCart', icon: Icons.ShoppingCart },
  { value: 'CreditCard', icon: Icons.CreditCard },
  { value: 'DollarSign', icon: Icons.DollarSign },
  { value: 'Box', icon: Icons.Box }
];

export const ResourceIconSelector = ({ 
  resourceId, 
  currentIcon, 
  onUpdate, 
  className = '' 
}: ResourceIconSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const currentIconComponent = iconOptions.find(opt => opt.value === currentIcon)?.icon || Icons.Box;
  const CurrentIcon = currentIconComponent;

  const handleIconSelect = async (iconValue: string) => {
    if (iconValue === currentIcon) {
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('resources')
        .update({ icon_name: iconValue })
        .eq('id', resourceId);

      if (error) throw error;

      onUpdate(iconValue);
      setIsOpen(false);
      
      toast({
        title: "Success",
        description: "Icon updated successfully"
      });
    } catch (error) {
      console.error('Error updating icon:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update icon"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`group relative ${className}`}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-2 hover:bg-muted/20 transition-colors"
            disabled={isLoading}
          >
            <CurrentIcon size={20} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4">
          <div className="grid grid-cols-8 gap-2">
            {iconOptions.map(({ value, icon: IconComponent }) => (
              <Button
                key={value}
                variant={currentIcon === value ? "default" : "ghost"}
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handleIconSelect(value)}
                disabled={isLoading}
              >
                <IconComponent size={16} />
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
      <Button
        size="sm"
        variant="ghost"
        onClick={() => setIsOpen(true)}
        className="opacity-0 group-hover:opacity-100 absolute -top-1 -right-1 h-5 w-5 p-0 transition-all duration-200 text-blue-500 hover:text-blue-600"
        title="Change icon"
      >
        <Pencil className="h-3 w-3" />
      </Button>
    </div>
  );
};