import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Rocket, Coins, Globe, Cpu, Users, Mountain, Sparkles, Zap, Eye, Heart, Star, Trophy, Target, Lightbulb, Code, Database, Shield, Lock, Key, Wifi, Cloud, Server, Building, Crown } from 'lucide-react';

interface QuickAddDialogProps {
  isOpen: boolean;
  onClose: () => void;
  year: number;
  displayOrder: number;
  onMomentAdded: () => void;
}

const iconOptions = [
  { value: 'calendar', label: 'Calendar', icon: Calendar },
  { value: 'rocket', label: 'Rocket', icon: Rocket },
  { value: 'coins', label: 'Coins', icon: Coins },
  { value: 'globe', label: 'Globe', icon: Globe },
  { value: 'cpu', label: 'CPU', icon: Cpu },
  { value: 'users', label: 'Users', icon: Users },
  { value: 'mountain', label: 'Mountain', icon: Mountain },
  { value: 'sparkles', label: 'Sparkles', icon: Sparkles },
  { value: 'zap', label: 'Zap', icon: Zap },
  { value: 'eye', label: 'Eye', icon: Eye },
  { value: 'heart', label: 'Heart', icon: Heart },
  { value: 'star', label: 'Star', icon: Star },
  { value: 'trophy', label: 'Trophy', icon: Trophy },
  { value: 'target', label: 'Target', icon: Target },
  { value: 'lightbulb', label: 'Lightbulb', icon: Lightbulb },
  { value: 'code', label: 'Code', icon: Code },
  { value: 'database', label: 'Database', icon: Database },
  { value: 'shield', label: 'Shield', icon: Shield },
  { value: 'lock', label: 'Lock', icon: Lock },
  { value: 'key', label: 'Key', icon: Key },
  { value: 'wifi', label: 'WiFi', icon: Wifi },
  { value: 'cloud', label: 'Cloud', icon: Cloud },
  { value: 'server', label: 'Server', icon: Server },
  { value: 'building', label: 'Building', icon: Building },
  { value: 'crown', label: 'Crown', icon: Crown },
];

const gradientOptions = [
  { value: 'from-purple-500 to-pink-500', label: 'Purple to Pink' },
  { value: 'from-cyan-500 to-purple-500', label: 'Cyan to Purple' },
  { value: 'from-blue-500 to-cyan-500', label: 'Blue to Cyan' },
  { value: 'from-green-500 to-cyan-500', label: 'Green to Cyan' },
  { value: 'from-emerald-500 to-green-500', label: 'Emerald to Green' },
  { value: 'from-orange-500 to-pink-500', label: 'Orange to Pink' },
  { value: 'from-red-500 to-orange-500', label: 'Red to Orange' },
  { value: 'from-yellow-500 to-orange-500', label: 'Yellow to Orange' },
];

export const QuickAddDialog = ({ isOpen, onClose, year, displayOrder, onMomentAdded }: QuickAddDialogProps) => {
  const [formData, setFormData] = useState({
    year_title: '',
    month: '',
    title: '',
    content: '',
    highlight: '',
    icon_name: 'calendar',
    gradient_class: 'from-purple-500 to-pink-500'
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!formData.title || !formData.content || !formData.highlight) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('timeline_content')
        .insert({
          year,
          year_title: formData.year_title || `Year ${year}`,
          month: formData.month,
          title: formData.title,
          content: formData.content,
          highlight: formData.highlight,
          icon_name: formData.icon_name,
          gradient_class: formData.gradient_class,
          display_order: displayOrder,
          is_active: true
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Timeline moment added successfully"
      });

      onMomentAdded();
      
      // Reset form
      setFormData({
        year_title: '',
        month: '',
        title: '',
        content: '',
        highlight: '',
        icon_name: 'calendar',
        gradient_class: 'from-purple-500 to-pink-500'
      });
    } catch (error) {
      console.error('Error adding timeline moment:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add timeline moment"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const selectedIcon = iconOptions.find(option => option.value === formData.icon_name)?.icon || Calendar;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Timeline Moment - {year}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="year_title">Year Title</Label>
              <Input
                id="year_title"
                value={formData.year_title}
                onChange={(e) => setFormData(prev => ({ ...prev, year_title: e.target.value }))}
                placeholder={`Year ${year}`}
              />
            </div>
            <div>
              <Label htmlFor="month">Month</Label>
              <Input
                id="month"
                value={formData.month}
                onChange={(e) => setFormData(prev => ({ ...prev, month: e.target.value }))}
                placeholder="e.g., March, Early 2024"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Timeline moment title"
            />
          </div>

          <div>
            <Label htmlFor="highlight">Highlight *</Label>
            <Input
              id="highlight"
              value={formData.highlight}
              onChange={(e) => setFormData(prev => ({ ...prev, highlight: e.target.value }))}
              placeholder="e.g., Major Milestone, Tech Achievement"
            />
          </div>

          <div>
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Describe this timeline moment..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="icon">Icon</Label>
              <Select value={formData.icon_name} onValueChange={(value) => setFormData(prev => ({ ...prev, icon_name: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((option) => {
                    const IconComponent = option.icon;
                    return (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <IconComponent size={16} />
                          {option.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="gradient">Gradient</Label>
              <Select value={formData.gradient_class} onValueChange={(value) => setFormData(prev => ({ ...prev, gradient_class: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {gradientOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded bg-gradient-to-r ${option.value}`} />
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Preview */}
          <div className="border rounded-lg p-4 bg-muted/20">
            <Label className="text-sm font-medium mb-2 block">Preview</Label>
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-full bg-gradient-to-br ${formData.gradient_class} shadow-lg border-2 border-white/30`}>
                {React.createElement(selectedIcon, { size: 24, className: "text-white" })}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-lg font-bold">{formData.title || 'Timeline Title'}</h4>
                  {formData.highlight && (
                    <span className="px-2 py-1 text-xs border rounded">{formData.highlight}</span>
                  )}
                </div>
                {formData.month && (
                  <p className="text-sm text-muted-foreground mb-2">{formData.month}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  {formData.content || 'Timeline content will appear here...'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? 'Adding...' : 'Add Moment'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};