import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Trash2, Save, Plus, Edit } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ConfigurableLink {
  id: string;
  link_key: string;
  title: string;
  url: string;
  icon_name: string;
  button_variant: string;
  button_size: string;
  is_active: boolean;
  display_order: number;
}

const iconOptions = [
  'Globe', 'Sparkles', 'Users', 'BookOpen', 'Twitter', 'Instagram', 'Youtube', 'Mail',
  'Heart', 'Star', 'Zap', 'Home', 'Settings', 'User', 'Search', 'Play'
];

const variantOptions = [
  'default', 'destructive', 'outline', 'secondary', 'ghost', 'link', 'cyber', 'glow'
];

const sizeOptions = [
  'default', 'sm', 'lg', 'xl', 'icon'
];

export const LinksManager = () => {
  const [links, setLinks] = useState<ConfigurableLink[]>([]);
  const [editingLink, setEditingLink] = useState<ConfigurableLink | Omit<ConfigurableLink, 'id'> | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const newLink: Omit<ConfigurableLink, 'id'> = {
    link_key: '',
    title: '',
    url: '',
    icon_name: 'Globe',
    button_variant: 'default',
    button_size: 'default',
    is_active: true,
    display_order: 0
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const { data, error } = await supabase
        .from('configurable_links')
        .select('*')
        .order('display_order');

      if (error) throw error;
      setLinks(data || []);
    } catch (error) {
      console.error('Error fetching links:', error);
      toast({
        title: "Error",
        description: "Failed to fetch links",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (link: ConfigurableLink | Omit<ConfigurableLink, 'id'>) => {
    try {
      setLoading(true);
      
      if ('id' in link) {
        // Update existing link
        const { error } = await supabase
          .from('configurable_links')
          .update({
            link_key: link.link_key,
            title: link.title,
            url: link.url,
            icon_name: link.icon_name,
            button_variant: link.button_variant,
            button_size: link.button_size,
            is_active: link.is_active,
            display_order: link.display_order
          })
          .eq('id', link.id);

        if (error) throw error;
      } else {
        // Create new link
        const { error } = await supabase
          .from('configurable_links')
          .insert(link);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `Link ${('id' in link) ? 'updated' : 'created'} successfully`,
      });

      setEditingLink(null);
      fetchLinks();
    } catch (error) {
      console.error('Error saving link:', error);
      toast({
        title: "Error",
        description: "Failed to save link",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this link?')) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('configurable_links')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Link deleted successfully",
      });

      fetchLinks();
    } catch (error) {
      console.error('Error deleting link:', error);
      toast({
        title: "Error",
        description: "Failed to delete link",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const LinkForm = ({ link, onSave, onCancel }: {
    link: ConfigurableLink | Omit<ConfigurableLink, 'id'>;
    onSave: (link: ConfigurableLink | Omit<ConfigurableLink, 'id'>) => void;
    onCancel: () => void;
  }) => {
    const [formData, setFormData] = useState(link);

    return (
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>{('id' in link) ? 'Edit Link' : 'Add New Link'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="link_key">Link Key</Label>
              <Input
                id="link_key"
                value={formData.link_key}
                onChange={(e) => setFormData({ ...formData, link_key: e.target.value })}
                placeholder="e.g., hero_visit_metaverse"
              />
            </div>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Button text"
              />
            </div>
            <div>
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://example.com"
              />
            </div>
            <div>
              <Label htmlFor="icon_name">Icon</Label>
              <Select value={formData.icon_name} onValueChange={(value) => setFormData({ ...formData, icon_name: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((icon) => (
                    <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="button_variant">Button Variant</Label>
              <Select value={formData.button_variant} onValueChange={(value) => setFormData({ ...formData, button_variant: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {variantOptions.map((variant) => (
                    <SelectItem key={variant} value={variant}>{variant}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="button_size">Button Size</Label>
              <Select value={formData.button_size} onValueChange={(value) => setFormData({ ...formData, button_size: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sizeOptions.map((size) => (
                    <SelectItem key={size} value={size}>{size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="display_order">Display Order</Label>
              <Input
                id="display_order"
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => onSave(formData)} disabled={!formData.link_key || !formData.title || !formData.url}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (loading && links.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Links & Buttons Manager</h2>
          <p className="text-muted-foreground">Manage configurable buttons and links throughout the site</p>
        </div>
        <Button onClick={() => setEditingLink(newLink as Omit<ConfigurableLink, 'id'>)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Link
        </Button>
      </div>

      {editingLink && (
        <LinkForm
          link={editingLink}
          onSave={handleSave}
          onCancel={() => setEditingLink(null)}
        />
      )}

      <div className="grid gap-4">
        {links.map((link) => (
          <Card key={link.id} className={!link.is_active ? 'opacity-50' : ''}>
            <CardContent className="pt-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{link.title}</span>
                    <span className="text-xs bg-secondary px-2 py-1 rounded">{link.link_key}</span>
                    {!link.is_active && <span className="text-xs bg-destructive px-2 py-1 rounded text-white">Inactive</span>}
                  </div>
                  <p className="text-sm text-muted-foreground">{link.url}</p>
                  <div className="flex gap-2 text-xs text-muted-foreground">
                    <span>Icon: {link.icon_name}</span>
                    <span>Variant: {link.button_variant}</span>
                    <span>Size: {link.button_size}</span>
                    <span>Order: {link.display_order}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingLink(link)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(link.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};