import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ImageUpload } from "@/components/ui/image-upload";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Eye, Edit, Trash2, Save, Plus, BookOpen, ExternalLink } from "lucide-react";

interface Story {
  id: string;
  title: string;
  content: string;
  full_story?: string;
  story_slug?: string;
  story_image_url?: string;
  has_story: boolean;
  year: number;
  year_title: string;
  highlight: string;
}

export const StoryManager = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const { data, error } = await supabase
        .from('timeline_content')
        .select('*')
        .eq('is_active', true)
        .order('year', { ascending: true })
        .order('display_order', { ascending: true });

      if (error) throw error;
      setStories(data || []);
    } catch (error) {
      console.error('Error fetching stories:', error);
      toast({
        title: "Error",
        description: "Failed to fetch stories",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleSaveStory = async () => {
    if (!selectedStory) return;

    try {
      // Auto-generate slug if not provided
      const slug = selectedStory.story_slug || generateSlug(selectedStory.title);

      const { error } = await supabase
        .from('timeline_content')
        .update({
          full_story: selectedStory.full_story,
          story_slug: slug,
          story_image_url: selectedStory.story_image_url,
          has_story: selectedStory.has_story,
        })
        .eq('id', selectedStory.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Story updated successfully",
      });

      await fetchStories();
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving story:', error);
      toast({
        title: "Error",
        description: "Failed to save story",
        variant: "destructive",
      });
    }
  };

  const handleImageUpload = (url: string) => {
    if (selectedStory) {
      setSelectedStory({ ...selectedStory, story_image_url: url });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Story Manager
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-4 bg-muted rounded w-5/6"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Stories List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Timeline Stories ({stories.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {stories.map((story) => (
              <div
                key={story.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedStory?.id === story.id 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setSelectedStory(story)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{story.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {story.year}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {story.highlight}
                      </Badge>
                      {story.has_story && (
                        <Badge variant="default" className="text-xs">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Story
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {story.story_slug && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(`/story/${story.story_slug}`, '_blank');
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Story Editor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              {selectedStory ? 'Edit Story' : 'Select a Story'}
            </span>
            {selectedStory && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>
                {isEditing && (
                  <Button size="sm" onClick={handleSaveStory}>
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                )}
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedStory ? (
            <div className="space-y-4">
              {/* Basic Info */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Timeline Entry</Label>
                <div className="p-3 bg-muted rounded-lg">
                  <h4 className="font-medium">{selectedStory.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedStory.content}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Story Settings */}
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-sm font-medium">Enable Full Story</Label>
                  <p className="text-xs text-muted-foreground">
                    Allow users to click and read the full story
                  </p>
                </div>
                <Switch
                  checked={selectedStory.has_story}
                  onCheckedChange={(checked) =>
                    setSelectedStory({ ...selectedStory, has_story: checked })
                  }
                  disabled={!isEditing}
                />
              </div>

              {selectedStory.has_story && (
                <>
                  {/* Story Slug */}
                  <div className="space-y-2">
                    <Label htmlFor="story_slug">Story URL Slug</Label>
                    <Input
                      id="story_slug"
                      value={selectedStory.story_slug || ''}
                      onChange={(e) =>
                        setSelectedStory({ ...selectedStory, story_slug: e.target.value })
                      }
                      placeholder="Auto-generated from title"
                      disabled={!isEditing}
                    />
                    {selectedStory.story_slug && (
                      <p className="text-xs text-muted-foreground">
                        URL: /story/{selectedStory.story_slug}
                      </p>
                    )}
                  </div>

                  {/* Story Image */}
                  <div className="space-y-2">
                    <Label>Story Image</Label>
                    {isEditing ? (
                      <ImageUpload
                        bucket="timeline-images"
                        currentImage={selectedStory.story_image_url || ''}
                        onUploadComplete={handleImageUpload}
                      />
                    ) : (
                      selectedStory.story_image_url && (
                        <img
                          src={selectedStory.story_image_url}
                          alt="Story"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      )
                    )}
                  </div>

                  {/* Full Story Content */}
                  <div className="space-y-2">
                    <Label htmlFor="full_story">Full Story Content</Label>
                    <Textarea
                      id="full_story"
                      value={selectedStory.full_story || ''}
                      onChange={(e) =>
                        setSelectedStory({ ...selectedStory, full_story: e.target.value })
                      }
                      placeholder="Write the full story here... (HTML supported)"
                      className="min-h-32"
                      disabled={!isEditing}
                    />
                    <p className="text-xs text-muted-foreground">
                      HTML tags are supported for rich formatting
                    </p>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Select a timeline entry to add or edit its full story</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};