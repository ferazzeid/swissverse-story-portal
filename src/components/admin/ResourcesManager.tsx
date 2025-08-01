import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  ArrowUp, 
  ArrowDown,
  ExternalLink,
  Eye,
  EyeOff
} from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface Resource {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  link_url: string | null;
  category: string;
  display_order: number;
  is_active: boolean;
}

interface SectionTitle {
  id: string;
  section_name: string;
  title: string;
  subtitle: string | null;
}

const ICON_OPTIONS = [
  'Code', 'Globe', 'Smartphone', 'Cpu', 'Database', 'Cloud', 'Shield', 'Zap',
  'Gamepad2', 'Palette', 'Camera', 'Music', 'Video', 'Image', 'FileText', 'Book',
  'Users', 'MessageCircle', 'Mail', 'Phone', 'Calendar', 'Clock', 'Settings',
  'Tool', 'Wrench', 'Hammer', 'Screwdriver', 'Package', 'Box', 'Archive'
];

const CATEGORY_OPTIONS = [
  'tool', 'platform', 'service', 'guide', 'template', 'library', 'framework', 'other'
];

export const ResourcesManager = () => {
  const { toast } = useToast();
  const [resources, setResources] = useState<Resource[]>([]);
  const [sectionTitle, setSectionTitle] = useState<SectionTitle | null>(null);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [editingSection, setEditingSection] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    icon_name: 'Tool',
    link_url: '',
    category: 'tool'
  });
  const [sectionData, setSectionData] = useState({
    title: '',
    subtitle: ''
  });

  useEffect(() => {
    fetchResources();
    fetchSectionTitle();
  }, []);

  const fetchResources = async () => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setResources(data || []);
    } catch (error) {
      console.error('Error fetching resources:', error);
      toast({
        title: "Error",
        description: "Failed to fetch resources",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSectionTitle = async () => {
    try {
      const { data, error } = await supabase
        .from('section_titles')
        .select('*')
        .eq('section_name', 'resources')
        .maybeSingle();

      if (error) throw error;
      if (data) {
        setSectionTitle(data);
        setSectionData({
          title: data.title,
          subtitle: data.subtitle || ''
        });
      }
    } catch (error) {
      console.error('Error fetching section title:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const maxOrder = Math.max(...resources.map(r => r.display_order), 0);
      
      if (editingResource) {
        const { error } = await supabase
          .from('resources')
          .update({
            title: formData.title,
            description: formData.description,
            icon_name: formData.icon_name,
            link_url: formData.link_url || null,
            category: formData.category
          })
          .eq('id', editingResource.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Resource updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('resources')
          .insert({
            title: formData.title,
            description: formData.description,
            icon_name: formData.icon_name,
            link_url: formData.link_url || null,
            category: formData.category,
            display_order: maxOrder + 1
          });

        if (error) throw error;
        toast({
          title: "Success",
          description: "Resource created successfully",
        });
      }

      setFormData({
        title: '',
        description: '',
        icon_name: 'Tool',
        link_url: '',
        category: 'tool'
      });
      setEditingResource(null);
      fetchResources();
    } catch (error) {
      console.error('Error saving resource:', error);
      toast({
        title: "Error",
        description: "Failed to save resource",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (resource: Resource) => {
    setEditingResource(resource);
    setFormData({
      title: resource.title,
      description: resource.description,
      icon_name: resource.icon_name,
      link_url: resource.link_url || '',
      category: resource.category
    });
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('resources')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      await fetchResources();
      toast({
        title: "Success",
        description: "Resource deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting resource:', error);
      toast({
        title: "Error",
        description: "Failed to delete resource",
        variant: "destructive",
      });
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('resources')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      toast({
        title: "Success",
        description: `Resource ${!currentStatus ? 'enabled' : 'disabled'} successfully`,
      });
      fetchResources();
    } catch (error) {
      console.error('Error updating resource status:', error);
      toast({
        title: "Error",
        description: "Failed to update resource status",
        variant: "destructive",
      });
    }
  };

  const moveResource = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = resources.findIndex(r => r.id === id);
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === resources.length - 1)
    ) {
      return;
    }

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const updatedResources = [...resources];
    [updatedResources[currentIndex], updatedResources[newIndex]] = 
    [updatedResources[newIndex], updatedResources[currentIndex]];

    try {
      const updates = updatedResources.map((resource, index) => 
        supabase
          .from('resources')
          .update({ display_order: index })
          .eq('id', resource.id)
      );

      await Promise.all(updates);
      fetchResources();
      toast({
        title: "Success",
        description: "Resource order updated successfully",
      });
    } catch (error) {
      console.error('Error updating resource order:', error);
      toast({
        title: "Error",
        description: "Failed to update resource order",
        variant: "destructive",
      });
    }
  };

  const saveSectionTitle = async () => {
    try {
      if (sectionTitle) {
        const { error } = await supabase
          .from('section_titles')
          .update({
            title: sectionData.title,
            subtitle: sectionData.subtitle || null
          })
          .eq('id', sectionTitle.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('section_titles')
          .insert({
            section_name: 'resources',
            title: sectionData.title,
            subtitle: sectionData.subtitle || null
          });

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Section title updated successfully",
      });
      setEditingSection(false);
      fetchSectionTitle();
    } catch (error) {
      console.error('Error saving section title:', error);
      toast({
        title: "Error",
        description: "Failed to update section title",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading resources...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Section Title Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Resources Section Settings
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditingSection(!editingSection)}
            >
              {editingSection ? <X size={16} /> : <Edit2 size={16} />}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {editingSection ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Section Title</label>
                <Input
                  value={sectionData.title}
                  onChange={(e) => setSectionData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Tools & Resources"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Section Subtitle</label>
                <Input
                  value={sectionData.subtitle}
                  onChange={(e) => setSectionData(prev => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="Optional subtitle"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={saveSectionTitle}>
                  <Save size={16} className="mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setEditingSection(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-semibold">{sectionTitle?.title || 'No title set'}</h3>
              {sectionTitle?.subtitle && (
                <p className="text-muted-foreground">{sectionTitle.subtitle}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Resource Form */}
      <Card>
        <CardHeader>
          <CardTitle>
            {editingResource ? 'Edit Resource' : 'Add New Resource'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Resource title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORY_OPTIONS.map(category => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Resource description"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Icon</label>
                <Select value={formData.icon_name} onValueChange={(value) => setFormData(prev => ({ ...prev, icon_name: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ICON_OPTIONS.map(icon => (
                      <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Link URL (Optional)</label>
                <Input
                  value={formData.link_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, link_url: e.target.value }))}
                  placeholder="https://example.com"
                  type="url"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit">
                <Save size={16} className="mr-2" />
                {editingResource ? 'Update Resource' : 'Add Resource'}
              </Button>
              {editingResource && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setEditingResource(null);
                    setFormData({
                      title: '',
                      description: '',
                      icon_name: 'Tool',
                      link_url: '',
                      category: 'tool'
                    });
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Resources List */}
      <Card>
        <CardHeader>
          <CardTitle>Manage Resources ({resources.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {resources.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No resources found. Add your first resource above.
              </p>
            ) : (
              resources.map((resource, index) => (
                <div key={resource.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{resource.title}</h3>
                      <Badge variant={resource.category === 'tool' ? 'default' : 'secondary'}>
                        {resource.category}
                      </Badge>
                      <Badge variant={resource.is_active ? 'default' : 'secondary'}>
                        {resource.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{resource.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Icon: {resource.icon_name}</span>
                      {resource.link_url && (
                        <a 
                          href={resource.link_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 hover:text-primary"
                        >
                          <ExternalLink size={12} />
                          Visit Link
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveResource(resource.id, 'up')}
                      disabled={index === 0}
                    >
                      <ArrowUp size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => moveResource(resource.id, 'down')}
                      disabled={index === resources.length - 1}
                    >
                      <ArrowDown size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleStatus(resource.id, resource.is_active)}
                    >
                      {resource.is_active ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(resource)}
                    >
                      <Edit2 size={16} />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Resource</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{resource.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(resource.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};