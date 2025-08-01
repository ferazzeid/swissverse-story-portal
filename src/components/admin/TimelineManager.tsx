import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "@/components/ui/image-upload";
import { Plus, Edit, Trash2, ChevronUp, ChevronDown, Save, X, Calendar, Clock } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

// Lucide icon options for timeline moments
import {
  Rocket, Coins, Globe, Cpu, Users, Mountain, Calendar as CalendarIcon,
  Sparkles, Zap, Eye, Heart, Star, Trophy, Target, Lightbulb,
  Code, Database, Shield, Lock, Key, Wifi, Cloud, Server
} from "lucide-react";

interface TimelineMoment {
  id: string;
  year: number;
  year_title: string;
  month: string;
  title: string;
  content: string;
  highlight: string;
  icon_name: string;
  image_url: string | null;
  gradient_class: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  has_story: boolean;
  story_slug: string | null;
  full_story: string | null;
  story_image_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
}

interface EditMomentData {
  year: number;
  year_title: string;
  month: string;
  title: string;
  content: string;
  highlight: string;
  icon_name: string;
  image_url: string;
  gradient_class: string;
  has_story: boolean;
  story_slug: string;
  full_story: string;
  story_image_url: string;
  meta_title: string;
  meta_description: string;
}

interface YearGroup {
  year: number;
  year_title: string;
  moments: TimelineMoment[];
}

// Available icons with their components
const iconOptions = [
  { name: 'rocket', icon: Rocket, label: 'Rocket' },
  { name: 'coins', icon: Coins, label: 'Coins' },
  { name: 'globe', icon: Globe, label: 'Globe' },
  { name: 'cpu', icon: Cpu, label: 'CPU' },
  { name: 'users', icon: Users, label: 'Users' },
  { name: 'mountain', icon: Mountain, label: 'Mountain' },
  { name: 'calendar', icon: CalendarIcon, label: 'Calendar' },
  { name: 'sparkles', icon: Sparkles, label: 'Sparkles' },
  { name: 'zap', icon: Zap, label: 'Zap' },
  { name: 'eye', icon: Eye, label: 'Eye' },
  { name: 'heart', icon: Heart, label: 'Heart' },
  { name: 'star', icon: Star, label: 'Star' },
  { name: 'trophy', icon: Trophy, label: 'Trophy' },
  { name: 'target', icon: Target, label: 'Target' },
  { name: 'lightbulb', icon: Lightbulb, label: 'Lightbulb' },
  { name: 'code', icon: Code, label: 'Code' },
  { name: 'database', icon: Database, label: 'Database' },
  { name: 'shield', icon: Shield, label: 'Shield' },
  { name: 'lock', icon: Lock, label: 'Lock' },
  { name: 'key', icon: Key, label: 'Key' },
  { name: 'wifi', icon: Wifi, label: 'Wifi' },
  { name: 'cloud', icon: Cloud, label: 'Cloud' },
  { name: 'server', icon: Server, label: 'Server' }
];

// Available gradient options
const gradientOptions = [
  { value: 'from-purple-500 to-pink-500', label: 'Purple to Pink' },
  { value: 'from-cyan-500 to-purple-500', label: 'Cyan to Purple' },
  { value: 'from-blue-500 to-cyan-500', label: 'Blue to Cyan' },
  { value: 'from-green-500 to-cyan-500', label: 'Green to Cyan' },
  { value: 'from-emerald-500 to-green-500', label: 'Emerald to Green' },
  { value: 'from-orange-500 to-pink-500', label: 'Orange to Pink' },
  { value: 'from-red-500 to-orange-500', label: 'Red to Orange' },
  { value: 'from-yellow-500 to-orange-500', label: 'Yellow to Orange' },
  { value: 'from-indigo-500 to-purple-500', label: 'Indigo to Purple' },
  { value: 'from-pink-500 to-red-500', label: 'Pink to Red' }
];

export const TimelineManager = () => {
  const [moments, setMoments] = useState<TimelineMoment[]>([]);
  const [yearGroups, setYearGroups] = useState<YearGroup[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMoment, setEditingMoment] = useState<TimelineMoment | null>(null);
  const [momentData, setMomentData] = useState<EditMomentData>({
    year: new Date().getFullYear(),
    year_title: '',
    month: '',
    title: '',
    content: '',
    highlight: '',
    icon_name: 'calendar',
    image_url: '',
    gradient_class: 'from-purple-500 to-pink-500',
    has_story: false,
    story_slug: '',
    full_story: '',
    story_image_url: '',
    meta_title: '',
    meta_description: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchTimelineData();
  }, []);

  const fetchTimelineData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('timeline_content')
        .select('*')
        .order('year', { ascending: true })
        .order('display_order', { ascending: true });

      if (error) throw error;
      
      setMoments(data || []);
      
      // Group moments by year
      const groups = groupMomentsByYear(data || []);
      setYearGroups(groups);
      
      // Set initial selected year
      if (groups.length > 0 && !selectedYear) {
        setSelectedYear(groups[0].year);
      }
    } catch (error) {
      console.error('Error fetching timeline data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load timeline content",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const groupMomentsByYear = (moments: TimelineMoment[]): YearGroup[] => {
    const groups: { [year: number]: YearGroup } = {};
    
    moments.forEach(moment => {
      if (!groups[moment.year]) {
        groups[moment.year] = {
          year: moment.year,
          year_title: moment.year_title,
          moments: []
        };
      }
      groups[moment.year].moments.push(moment);
    });
    
    return Object.values(groups).sort((a, b) => a.year - b.year);
  };

  const getIconComponent = (iconName: string) => {
    const iconOption = iconOptions.find(opt => opt.name === iconName);
    return iconOption ? iconOption.icon : Calendar;
  };

  const resetForm = () => {
    setMomentData({
      year: selectedYear || new Date().getFullYear(),
      year_title: yearGroups.find(g => g.year === selectedYear)?.year_title || '',
      month: '',
      title: '',
      content: '',
      highlight: '',
      icon_name: 'calendar',
      image_url: '',
      gradient_class: 'from-purple-500 to-pink-500',
      has_story: false,
      story_slug: '',
      full_story: '',
      story_image_url: '',
      meta_title: '',
      meta_description: ''
    });
    setEditingMoment(null);
  };

  const openDialog = (moment?: TimelineMoment) => {
    if (moment) {
      setEditingMoment(moment);
      setMomentData({
        year: moment.year,
        year_title: moment.year_title,
        month: moment.month,
        title: moment.title,
        content: moment.content,
        highlight: moment.highlight,
        icon_name: moment.icon_name,
        image_url: moment.image_url || '',
        gradient_class: moment.gradient_class,
        has_story: moment.has_story || false,
        story_slug: moment.story_slug || '',
        full_story: moment.full_story || '',
        story_image_url: moment.story_image_url || '',
        meta_title: moment.meta_title || '',
        meta_description: moment.meta_description || ''
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const saveMoment = async () => {
    if (!momentData.title || !momentData.content || !momentData.year_title) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Year title, title, and content are required",
      });
      return;
    }

    setIsSaving(true);
    try {
      if (editingMoment) {
        // Update existing moment
        const { error } = await supabase
          .from('timeline_content')
          .update({
            year: momentData.year,
            year_title: momentData.year_title,
            month: momentData.month,
            title: momentData.title,
            content: momentData.content,
            highlight: momentData.highlight,
            icon_name: momentData.icon_name,
            image_url: momentData.image_url || null,
            gradient_class: momentData.gradient_class,
            has_story: momentData.has_story,
            story_slug: momentData.has_story ? momentData.story_slug || null : null,
            full_story: momentData.has_story ? momentData.full_story || null : null,
            story_image_url: momentData.has_story ? momentData.story_image_url || null : null,
            meta_title: momentData.has_story ? momentData.meta_title || null : null,
            meta_description: momentData.has_story ? momentData.meta_description || null : null
          })
          .eq('id', editingMoment.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Timeline moment updated successfully",
        });
      } else {
        // Create new moment
        const yearMoments = moments.filter(m => m.year === momentData.year);
        const maxOrder = Math.max(...yearMoments.map(m => m.display_order), 0);
        
        const { error } = await supabase
          .from('timeline_content')
          .insert({
            year: momentData.year,
            year_title: momentData.year_title,
            month: momentData.month,
            title: momentData.title,
            content: momentData.content,
            highlight: momentData.highlight,
            icon_name: momentData.icon_name,
            image_url: momentData.image_url || null,
            gradient_class: momentData.gradient_class,
            display_order: maxOrder + 1,
            has_story: momentData.has_story,
            story_slug: momentData.has_story ? momentData.story_slug || null : null,
            full_story: momentData.has_story ? momentData.full_story || null : null,
            story_image_url: momentData.has_story ? momentData.story_image_url || null : null,
            meta_title: momentData.has_story ? momentData.meta_title || null : null,
            meta_description: momentData.has_story ? momentData.meta_description || null : null
          });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Timeline moment added successfully",
        });
      }

      closeDialog();
      fetchTimelineData();
    } catch (error) {
      console.error('Error saving moment:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save timeline moment",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const toggleMomentStatus = async (moment: TimelineMoment) => {
    try {
      const { error } = await supabase
        .from('timeline_content')
        .update({ is_active: !moment.is_active })
        .eq('id', moment.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Moment ${!moment.is_active ? 'enabled' : 'disabled'} successfully`,
      });

      fetchTimelineData();
    } catch (error) {
      console.error('Error toggling moment status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update moment status",
      });
    }
  };

  const deleteMoment = async (moment: TimelineMoment) => {
    try {
      const { error } = await supabase
        .from('timeline_content')
        .delete()
        .eq('id', moment.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Timeline moment deleted successfully",
      });

      fetchTimelineData();
    } catch (error) {
      console.error('Error deleting moment:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete timeline moment",
      });
    }
  };

  const moveMoment = async (moment: TimelineMoment, direction: 'up' | 'down') => {
    const yearMoments = moments
      .filter(m => m.year === moment.year)
      .sort((a, b) => a.display_order - b.display_order);
    
    const currentIndex = yearMoments.findIndex(m => m.id === moment.id);
    
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === yearMoments.length - 1)
    ) {
      return;
    }

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const targetMoment = yearMoments[targetIndex];

    try {
      // Swap display orders
      const { error: error1 } = await supabase
        .from('timeline_content')
        .update({ display_order: targetMoment.display_order })
        .eq('id', moment.id);

      const { error: error2 } = await supabase
        .from('timeline_content')
        .update({ display_order: moment.display_order })
        .eq('id', targetMoment.id);

      if (error1 || error2) throw error1 || error2;

      toast({
        title: "Success",
        description: "Moment order updated successfully",
      });

      fetchTimelineData();
    } catch (error) {
      console.error('Error reordering moments:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reorder moments",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Loading timeline content...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Timeline Management</h2>
          <p className="text-muted-foreground">
            Manage the SWISSVERSE story timeline content by year
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Moment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingMoment ? 'Edit Timeline Moment' : 'Add New Timeline Moment'}
              </DialogTitle>
              <DialogDescription>
                {editingMoment ? 'Update the timeline moment details below.' : 'Add a new moment to the timeline story.'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {/* Year and Year Title */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">Year *</Label>
                  <Input
                    id="year"
                    type="number"
                    value={momentData.year}
                    onChange={(e) => setMomentData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                    placeholder="2024"
                    min="2000"
                    max="2050"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="month">Month/Period</Label>
                  <Input
                    id="month"
                    value={momentData.month}
                    onChange={(e) => setMomentData(prev => ({ ...prev, month: e.target.value }))}
                    placeholder="March, Early 2024, Q1 (optional)"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="year-title">Year Title *</Label>
                <Input
                  id="year-title"
                  value={momentData.year_title}
                  onChange={(e) => setMomentData(prev => ({ ...prev, year_title: e.target.value }))}
                  placeholder="The Genesis Era, Foundation Building, etc."
                />
              </div>

              {/* Title and Highlight */}
              <div className="space-y-2">
                <Label htmlFor="title">Moment Title *</Label>
                <Input
                  id="title"
                  value={momentData.title}
                  onChange={(e) => setMomentData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Digital Birth, Platform Evolution, etc."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="highlight">Highlight Badge *</Label>
                <Input
                  id="highlight"
                  value={momentData.highlight}
                  onChange={(e) => setMomentData(prev => ({ ...prev, highlight: e.target.value }))}
                  placeholder="Project Genesis, Tech Development, etc."
                />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  value={momentData.content}
                  onChange={(e) => setMomentData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Describe what happened during this moment..."
                  rows={4}
                />
              </div>

              {/* Icon and Gradient */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="icon">Icon</Label>
                  <Select
                    value={momentData.icon_name}
                    onValueChange={(value) => setMomentData(prev => ({ ...prev, icon_name: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map((icon) => {
                        const IconComponent = icon.icon;
                        return (
                          <SelectItem key={icon.name} value={icon.name}>
                            <div className="flex items-center gap-2">
                              <IconComponent size={16} />
                              {icon.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gradient">Gradient</Label>
                  <Select
                    value={momentData.gradient_class}
                    onValueChange={(value) => setMomentData(prev => ({ ...prev, gradient_class: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {gradientOptions.map((gradient) => (
                        <SelectItem key={gradient.value} value={gradient.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded bg-gradient-to-r ${gradient.value}`} />
                            {gradient.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="image">Image</Label>
                <ImageUpload
                  bucket="timeline-images"
                  currentImage={momentData.image_url}
                  onUploadComplete={(url) => setMomentData(prev => ({ ...prev, image_url: url }))}
                />
                <div className="mt-2">
                  <Label htmlFor="image-url">Or enter image URL</Label>
                  <Input
                    id="image-url"
                    value={momentData.image_url}
                    onChange={(e) => setMomentData(prev => ({ ...prev, image_url: e.target.value }))}
                    placeholder="Optional image URL"
                  />
                </div>
              </div>

              {/* Story Section */}
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="has-story"
                    checked={momentData.has_story}
                    onCheckedChange={(checked) => setMomentData(prev => ({ 
                      ...prev, 
                      has_story: checked,
                      story_slug: checked ? prev.story_slug || prev.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') : '',
                      meta_title: checked ? prev.meta_title || prev.title : '',
                      meta_description: checked ? prev.meta_description || prev.content.substring(0, 150) + '...' : ''
                    }))}
                  />
                  <Label htmlFor="has-story">Enable Full Story</Label>
                </div>

                {momentData.has_story && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="story-slug">Story URL Slug</Label>
                      <Input
                        id="story-slug"
                        value={momentData.story_slug}
                        onChange={(e) => setMomentData(prev => ({ ...prev, story_slug: e.target.value }))}
                        placeholder="story-url-slug"
                      />
                      <p className="text-xs text-muted-foreground">
                        Story will be available at: /story/{momentData.story_slug || 'story-url-slug'}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="full-story">Full Story Content</Label>
                      <Textarea
                        id="full-story"
                        value={momentData.full_story}
                        onChange={(e) => setMomentData(prev => ({ ...prev, full_story: e.target.value }))}
                        placeholder="Enter the complete story content (HTML supported)..."
                        rows={6}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="story-image">Story Featured Image URL</Label>
                      <Input
                        id="story-image"
                        value={momentData.story_image_url}
                        onChange={(e) => setMomentData(prev => ({ ...prev, story_image_url: e.target.value }))}
                        placeholder="Optional story featured image URL"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="meta-title">Meta Title (SEO)</Label>
                       <Input
                         id="meta-title"
                         value={momentData.meta_title}
                         onChange={(e) => setMomentData(prev => ({ ...prev, meta_title: e.target.value }))}
                         placeholder={`${momentData.title || 'Story title'} - SWISSVERSE Timeline`}
                       />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="meta-description">Meta Description (SEO)</Label>
                       <Textarea
                         id="meta-description"
                         value={momentData.meta_description}
                         onChange={(e) => setMomentData(prev => ({ ...prev, meta_description: e.target.value }))}
                         placeholder={`Discover the story of ${momentData.title || 'this moment'} in the SWISSVERSE timeline. ${momentData.content ? momentData.content.substring(0, 100) + '...' : 'Learn more about this important milestone.'}`}
                         rows={3}
                       />
                    </div>
                  </>
                )}
              </div>

              {/* Preview */}
              <div className="space-y-2">
                <Label>Preview</Label>
                <Card className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-full bg-gradient-to-br ${momentData.gradient_class}`}>
                      {(() => {
                        const IconComponent = getIconComponent(momentData.icon_name);
                        return <IconComponent size={20} className="text-white" />;
                      })()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-bold">{momentData.title || 'Moment Title'}</h4>
                        <Badge variant="outline" className="text-xs">
                          {momentData.highlight || 'Highlight'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{momentData.month || 'Month'}</p>
                      <p className="text-sm line-clamp-2">{momentData.content || 'Content description...'}</p>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={saveMoment} disabled={isSaving} className="flex-1">
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? "Saving..." : (editingMoment ? "Update" : "Add")}
                </Button>
                <Button variant="outline" onClick={closeDialog}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Year Tabs */}
      {yearGroups.length > 0 && (
        <Tabs value={selectedYear?.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
          <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${yearGroups.length}, 1fr)` }}>
            {yearGroups.map((group) => (
              <TabsTrigger key={group.year} value={group.year.toString()}>
                {group.year}
              </TabsTrigger>
            ))}
          </TabsList>

          {yearGroups.map((group) => (
            <TabsContent key={group.year} value={group.year.toString()} className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    {group.year} - {group.year_title}
                  </CardTitle>
                  <CardDescription>
                    {group.moments.length} moment{group.moments.length !== 1 ? 's' : ''} in this year
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Moments for this year */}
              <div className="grid gap-4">
                {group.moments.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-8">
                      <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No moments yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Add the first moment for {group.year}
                      </p>
                      <Button onClick={() => openDialog()}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add First Moment
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  group.moments
                    .sort((a, b) => a.display_order - b.display_order)
                    .map((moment, index) => {
                      const IconComponent = getIconComponent(moment.icon_name);
                      return (
                        <Card key={moment.id} className="overflow-hidden">
                          <div className="flex">
                            {moment.image_url && (
                              <div className="flex-shrink-0">
                                <img
                                  src={moment.image_url}
                                  alt={moment.title}
                                  className="w-24 h-24 object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              </div>
                            )}
                            <div className="flex-1 p-4">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex items-start gap-3 flex-1 mr-4">
                                  <div className={`p-2 rounded-full bg-gradient-to-br ${moment.gradient_class} flex-shrink-0`}>
                                    <IconComponent size={16} className="text-white" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h3 className="font-semibold">{moment.title}</h3>
                                      <Badge variant="outline" className="text-xs">
                                        {moment.highlight}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-1">{moment.month}</p>
                                    <p className="text-sm line-clamp-2">{moment.content}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant={moment.is_active ? "default" : "secondary"}>
                                    {moment.is_active ? "Active" : "Inactive"}
                                  </Badge>
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center gap-1">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => moveMoment(moment, 'up')}
                                      disabled={index === 0}
                                    >
                                      <ChevronUp className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => moveMoment(moment, 'down')}
                                      disabled={index === group.moments.length - 1}
                                    >
                                      <ChevronDown className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  
                                  <Switch
                                    checked={moment.is_active}
                                    onCheckedChange={() => toggleMomentStatus(moment)}
                                  />
                                </div>
                                
                                 <div className="flex gap-2">
                                   <Button
                                     variant="outline"
                                     size="sm"
                                     onClick={() => openDialog(moment)}
                                   >
                                     <Edit className="h-4 w-4" />
                                   </Button>
                                   <AlertDialog>
                                     <AlertDialogTrigger asChild>
                                       <Button
                                         variant="destructive"
                                         size="sm"
                                       >
                                         <Trash2 className="h-4 w-4" />
                                       </Button>
                                     </AlertDialogTrigger>
                                     <AlertDialogContent>
                                       <AlertDialogHeader>
                                         <AlertDialogTitle>Delete Timeline Moment</AlertDialogTitle>
                                         <AlertDialogDescription>
                                           Are you sure you want to delete "{moment.title}"? This action cannot be undone.
                                         </AlertDialogDescription>
                                       </AlertDialogHeader>
                                       <AlertDialogFooter>
                                         <AlertDialogCancel>Cancel</AlertDialogCancel>
                                         <AlertDialogAction onClick={() => deleteMoment(moment)}>
                                           Delete
                                         </AlertDialogAction>
                                       </AlertDialogFooter>
                                     </AlertDialogContent>
                                   </AlertDialog>
                                 </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      );
                    })
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}

      {yearGroups.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No timeline content yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first timeline moment to get started
            </p>
            <Button onClick={() => openDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add First Moment
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};