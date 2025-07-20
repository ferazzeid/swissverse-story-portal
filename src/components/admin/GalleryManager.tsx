import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "@/components/ui/image-upload";
import { Plus, Edit, Trash2, Eye, EyeOff, ChevronUp, ChevronDown, Upload, Save, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface GalleryImage {
  id: string;
  title: string;
  description: string | null;
  alt_text: string;
  image_url: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface EditImageData {
  title: string;
  description: string;
  alt_text: string;
  image_url: string;
}

export const GalleryManager = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [imageData, setImageData] = useState<EditImageData>({
    title: '',
    description: '',
    alt_text: '',
    image_url: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setImages(data || []);
    } catch (error) {
      console.error('Error fetching images:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load gallery images",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setImageData({
      title: '',
      description: '',
      alt_text: '',
      image_url: ''
    });
    setEditingImage(null);
  };

  const openDialog = (image?: GalleryImage) => {
    if (image) {
      setEditingImage(image);
      setImageData({
        title: image.title,
        description: image.description || '',
        alt_text: image.alt_text,
        image_url: image.image_url
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

  const saveImage = async () => {
    if (!imageData.title || !imageData.alt_text || !imageData.image_url) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Title, alt text, and image URL are required",
      });
      return;
    }

    setIsSaving(true);
    try {
      if (editingImage) {
        // Update existing image
        const { error } = await supabase
          .from('gallery_images')
          .update({
            title: imageData.title,
            description: imageData.description || null,
            alt_text: imageData.alt_text,
            image_url: imageData.image_url
          })
          .eq('id', editingImage.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Image updated successfully",
        });
      } else {
        // Create new image
        const maxOrder = Math.max(...images.map(img => img.display_order), 0);
        const { error } = await supabase
          .from('gallery_images')
          .insert({
            title: imageData.title,
            description: imageData.description || null,
            alt_text: imageData.alt_text,
            image_url: imageData.image_url,
            display_order: maxOrder + 1
          });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Image added successfully",
        });
      }

      closeDialog();
      fetchImages();
    } catch (error) {
      console.error('Error saving image:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save image",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const toggleImageStatus = async (image: GalleryImage) => {
    try {
      const { error } = await supabase
        .from('gallery_images')
        .update({ is_active: !image.is_active })
        .eq('id', image.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Image ${!image.is_active ? 'enabled' : 'disabled'} successfully`,
      });

      fetchImages();
    } catch (error) {
      console.error('Error toggling image status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update image status",
      });
    }
  };

  const deleteImage = async (image: GalleryImage) => {
    if (!confirm(`Are you sure you want to delete "${image.title}"?`)) return;

    try {
      const { error } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', image.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Image deleted successfully",
      });

      fetchImages();
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete image",
      });
    }
  };

  const moveImage = async (image: GalleryImage, direction: 'up' | 'down') => {
    const sortedImages = [...images].sort((a, b) => a.display_order - b.display_order);
    const currentIndex = sortedImages.findIndex(img => img.id === image.id);
    
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === sortedImages.length - 1)
    ) {
      return;
    }

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const targetImage = sortedImages[targetIndex];

    try {
      // Swap display orders
      const { error: error1 } = await supabase
        .from('gallery_images')
        .update({ display_order: targetImage.display_order })
        .eq('id', image.id);

      const { error: error2 } = await supabase
        .from('gallery_images')
        .update({ display_order: image.display_order })
        .eq('id', targetImage.id);

      if (error1 || error2) throw error1 || error2;

      toast({
        title: "Success",
        description: "Image order updated successfully",
      });

      fetchImages();
    } catch (error) {
      console.error('Error reordering images:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reorder images",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Loading gallery images...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gallery Management</h2>
          <p className="text-muted-foreground">
            Manage images displayed in the metaverse gallery section
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Image
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingImage ? 'Edit Image' : 'Add New Image'}
              </DialogTitle>
              <DialogDescription>
                {editingImage ? 'Update the image details below.' : 'Add a new image to the gallery.'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={imageData.title}
                  onChange={(e) => setImageData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter image title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image">Image</Label>
                <ImageUpload
                  bucket="gallery-images"
                  currentImage={imageData.image_url}
                  onUploadComplete={(url) => setImageData(prev => ({ ...prev, image_url: url }))}
                />
                <div className="mt-2">
                  <Label htmlFor="image-url">Or enter image URL</Label>
                  <Input
                    id="image-url"
                    value={imageData.image_url}
                    onChange={(e) => setImageData(prev => ({ ...prev, image_url: e.target.value }))}
                    placeholder="https://example.com/image.jpg or /src/assets/image.jpg"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="alt-text">Alt Text *</Label>
                <Input
                  id="alt-text"
                  value={imageData.alt_text}
                  onChange={(e) => setImageData(prev => ({ ...prev, alt_text: e.target.value }))}
                  placeholder="Describe the image for accessibility"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={imageData.description}
                  onChange={(e) => setImageData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Optional description"
                  rows={3}
                />
              </div>
              {imageData.image_url && (
                <div className="space-y-2">
                  <Label>Preview</Label>
                  <img
                    src={imageData.image_url}
                    alt="Preview"
                    className="w-full h-32 object-cover rounded border"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
              <div className="flex gap-2 pt-4">
                <Button onClick={saveImage} disabled={isSaving} className="flex-1">
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? "Saving..." : (editingImage ? "Update" : "Add")}
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

      {/* Images Grid */}
      <div className="grid gap-4">
        {images.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No images yet</h3>
              <p className="text-muted-foreground mb-4">
                Add your first image to get started with the gallery
              </p>
              <Button onClick={() => openDialog()}>
                <Plus className="mr-2 h-4 w-4" />
                Add First Image
              </Button>
            </CardContent>
          </Card>
        ) : (
          images
            .sort((a, b) => a.display_order - b.display_order)
            .map((image, index) => (
              <Card key={image.id} className="overflow-hidden">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <img
                      src={image.image_url}
                      alt={image.alt_text}
                      className="w-24 h-24 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=400&fit=crop';
                      }}
                    />
                  </div>
                  <div className="flex-1 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">{image.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Order: {image.display_order}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={image.is_active ? "default" : "secondary"}>
                          {image.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                    
                    {image.description && (
                      <p className="text-sm text-muted-foreground mb-3">
                        {image.description}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => moveImage(image, 'up')}
                            disabled={index === 0}
                          >
                            <ChevronUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => moveImage(image, 'down')}
                            disabled={index === images.length - 1}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <Switch
                          checked={image.is_active}
                          onCheckedChange={() => toggleImageStatus(image)}
                        />
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDialog(image)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteImage(image)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
        )}
      </div>
    </div>
  );
};