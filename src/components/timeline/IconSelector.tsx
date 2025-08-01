import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar, Rocket, Coins, Globe, Cpu, Users, Mountain, Sparkles, Zap, Eye, Heart, Star, Trophy, Target, Lightbulb, Code, Database, Shield, Lock, Key, Wifi, Cloud, Server, Building, Crown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface IconSelectorProps {
  momentId: string;
  currentIcon: string;
  onUpdate: (newIcon: string) => void;
  className?: string;
}

const iconOptions = [
  { value: 'calendar', icon: Calendar },
  { value: 'rocket', icon: Rocket },
  { value: 'coins', icon: Coins },
  { value: 'globe', icon: Globe },
  { value: 'cpu', icon: Cpu },
  { value: 'users', icon: Users },
  { value: 'mountain', icon: Mountain },
  { value: 'sparkles', icon: Sparkles },
  { value: 'zap', icon: Zap },
  { value: 'eye', icon: Eye },
  { value: 'heart', icon: Heart },
  { value: 'star', icon: Star },
  { value: 'trophy', icon: Trophy },
  { value: 'target', icon: Target },
  { value: 'lightbulb', icon: Lightbulb },
  { value: 'code', icon: Code },
  { value: 'database', icon: Database },
  { value: 'shield', icon: Shield },
  { value: 'lock', icon: Lock },
  { value: 'key', icon: Key },
  { value: 'wifi', icon: Wifi },
  { value: 'cloud', icon: Cloud },
  { value: 'server', icon: Server },
  { value: 'building', icon: Building },
  { value: 'crown', icon: Crown },
];

export const IconSelector = ({ momentId, currentIcon, onUpdate, className = '' }: IconSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const currentIconComponent = iconOptions.find(option => option.value === currentIcon)?.icon || Calendar;

  const handleIconSelect = async (iconValue: string) => {
    if (iconValue === currentIcon) {
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('timeline_content')
        .update({ icon_name: iconValue })
        .eq('id', momentId);

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
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`group p-0 h-auto hover:scale-105 transition-transform ${className}`}
          title="Change icon"
          disabled={isLoading}
        >
          <div className="relative">
            {React.createElement(currentIconComponent, { 
              size: 24, 
              className: "text-white drop-shadow-sm" 
            })}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Select Icon</h4>
          <div className="grid grid-cols-5 gap-2">
            {iconOptions.map((option) => {
              const IconComponent = option.icon;
              const isSelected = option.value === currentIcon;
              
              return (
                <Button
                  key={option.value}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleIconSelect(option.value)}
                  className={`h-10 w-10 p-0 ${isSelected ? 'bg-primary' : ''}`}
                  disabled={isLoading}
                  title={option.value}
                >
                  <IconComponent size={16} />
                </Button>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};