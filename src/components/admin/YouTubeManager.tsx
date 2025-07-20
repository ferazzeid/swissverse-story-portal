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
import { Plus, Edit, Trash2, ChevronUp, ChevronDown, Save, X, Play, ExternalLink, Youtube } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface YouTubeVideo {
  id: string;
  video_id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface SectionTitle {
  id: string;
  section_name: string;
  title: string;
  subtitle: string | null;
  is_active: boolean;
}

interface EditVideoData {
  video_id: string;
  title: string;
  description: string;
  thumbnail_url: string;
}

interface EditSectionData {
  title: string;
  subtitle: string;
}

export const YouTubeManager = () => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [sectionTitle, setSectionTitle] = useState<SectionTitle | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false);
  const [isSectionDialogOpen, setIsSectionDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<YouTubeVideo | null>(null);
  const [videoData, setVideoData] = useState<EditVideoData>({
    video_id: '',
    title: '',
    description: '',
    thumbnail_url: ''
  });
  const [sectionData, setSectionData] = useState<EditSectionData>({
    title: '',
    subtitle: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch videos
      const { data: videosData, error: videosError } = await supabase
        .from('youtube_videos')
        .select('*')
        .order('display_order', { ascending: true });

      if (videosError) throw videosError;
      setVideos(videosData || []);

      // Fetch section title
      const { data: titleData, error: titleError } = await supabase
        .from('section_titles')
        .select('*')
        .eq('section_name', 'youtube')
        .maybeSingle();

      if (titleError && titleError.code !== 'PGRST116') throw titleError;
      
      if (titleData) {
        setSectionTitle(titleData);
        setSectionData({
          title: titleData.title,
          subtitle: titleData.subtitle || ''
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load YouTube data",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const extractVideoId = (url: string) => {
    // Extract video ID from various YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/ // Direct video ID
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return url; // Return as-is if no pattern matches
  };

  const getYouTubeThumbnail = (videoId: string) => {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  const getYouTubeUrl = (videoId: string) => {
    return `https://www.youtube.com/watch?v=${videoId}`;
  };

  const resetVideoForm = () => {
    setVideoData({
      video_id: '',
      title: '',
      description: '',
      thumbnail_url: ''
    });
    setEditingVideo(null);
  };

  const openVideoDialog = (video?: YouTubeVideo) => {
    if (video) {
      setEditingVideo(video);
      setVideoData({
        video_id: video.video_id,
        title: video.title,
        description: video.description || '',
        thumbnail_url: video.thumbnail_url || ''
      });
    } else {
      resetVideoForm();
    }
    setIsVideoDialogOpen(true);
  };

  const closeVideoDialog = () => {
    setIsVideoDialogOpen(false);
    resetVideoForm();
  };

  const saveVideo = async () => {
    if (!videoData.video_id || !videoData.title) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Video ID/URL and title are required",
      });
      return;
    }

    const processedVideoId = extractVideoId(videoData.video_id);
    const thumbnailUrl = videoData.thumbnail_url || getYouTubeThumbnail(processedVideoId);

    setIsSaving(true);
    try {
      if (editingVideo) {
        // Update existing video
        const { error } = await supabase
          .from('youtube_videos')
          .update({
            video_id: processedVideoId,
            title: videoData.title,
            description: videoData.description || null,
            thumbnail_url: thumbnailUrl
          })
          .eq('id', editingVideo.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Video updated successfully",
        });
      } else {
        // Create new video
        const maxOrder = Math.max(...videos.map(v => v.display_order), 0);
        const { error } = await supabase
          .from('youtube_videos')
          .insert({
            video_id: processedVideoId,
            title: videoData.title,
            description: videoData.description || null,
            thumbnail_url: thumbnailUrl,
            display_order: maxOrder + 1
          });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Video added successfully",
        });
      }

      closeVideoDialog();
      fetchData();
    } catch (error) {
      console.error('Error saving video:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save video",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const saveSectionTitle = async () => {
    if (!sectionData.title) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Section title is required",
      });
      return;
    }

    setIsSaving(true);
    try {
      if (sectionTitle) {
        // Update existing section title
        const { error } = await supabase
          .from('section_titles')
          .update({
            title: sectionData.title,
            subtitle: sectionData.subtitle || null
          })
          .eq('id', sectionTitle.id);

        if (error) throw error;
      } else {
        // Create new section title
        const { error } = await supabase
          .from('section_titles')
          .insert({
            section_name: 'youtube',
            title: sectionData.title,
            subtitle: sectionData.subtitle || null
          });

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Section title updated successfully",
      });

      setIsSectionDialogOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error saving section title:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save section title",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const toggleVideoStatus = async (video: YouTubeVideo) => {
    try {
      const { error } = await supabase
        .from('youtube_videos')
        .update({ is_active: !video.is_active })
        .eq('id', video.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Video ${!video.is_active ? 'enabled' : 'disabled'} successfully`,
      });

      fetchData();
    } catch (error) {
      console.error('Error toggling video status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update video status",
      });
    }
  };

  const deleteVideo = async (video: YouTubeVideo) => {
    if (!confirm(`Are you sure you want to delete "${video.title}"?`)) return;

    try {
      const { error } = await supabase
        .from('youtube_videos')
        .delete()
        .eq('id', video.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Video deleted successfully",
      });

      fetchData();
    } catch (error) {
      console.error('Error deleting video:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete video",
      });
    }
  };

  const moveVideo = async (video: YouTubeVideo, direction: 'up' | 'down') => {
    const sortedVideos = [...videos].sort((a, b) => a.display_order - b.display_order);
    const currentIndex = sortedVideos.findIndex(v => v.id === video.id);
    
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === sortedVideos.length - 1)
    ) {
      return;
    }

    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const targetVideo = sortedVideos[targetIndex];

    try {
      // Swap display orders
      const { error: error1 } = await supabase
        .from('youtube_videos')
        .update({ display_order: targetVideo.display_order })
        .eq('id', video.id);

      const { error: error2 } = await supabase
        .from('youtube_videos')
        .update({ display_order: video.display_order })
        .eq('id', targetVideo.id);

      if (error1 || error2) throw error1 || error2;

      toast({
        title: "Success",
        description: "Video order updated successfully",
      });

      fetchData();
    } catch (error) {
      console.error('Error reordering videos:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reorder videos",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Loading YouTube content...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">YouTube Management</h2>
          <p className="text-muted-foreground">
            Manage YouTube videos and section content
          </p>
        </div>
      </div>

      <Tabs defaultValue="videos" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="section">Section Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="videos" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Video Management</h3>
            <Dialog open={isVideoDialogOpen} onOpenChange={setIsVideoDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => openVideoDialog()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Video
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingVideo ? 'Edit Video' : 'Add New Video'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingVideo ? 'Update the video details below.' : 'Add a new YouTube video to the section.'}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="video-id">YouTube URL or Video ID *</Label>
                    <Input
                      id="video-id"
                      value={videoData.video_id}
                      onChange={(e) => setVideoData(prev => ({ ...prev, video_id: e.target.value }))}
                      placeholder="https://youtube.com/watch?v=... or video_id"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="video-title">Title *</Label>
                    <Input
                      id="video-title"
                      value={videoData.title}
                      onChange={(e) => setVideoData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter video title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="video-description">Description</Label>
                    <Textarea
                      id="video-description"
                      value={videoData.description}
                      onChange={(e) => setVideoData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Optional description"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="thumbnail-url">Custom Thumbnail URL</Label>
                    <Input
                      id="thumbnail-url"
                      value={videoData.thumbnail_url}
                      onChange={(e) => setVideoData(prev => ({ ...prev, thumbnail_url: e.target.value }))}
                      placeholder="Optional custom thumbnail (auto-generated if empty)"
                    />
                  </div>
                  {videoData.video_id && (
                    <div className="space-y-2">
                      <Label>Preview</Label>
                      <div className="relative aspect-video bg-muted rounded overflow-hidden">
                        <img
                          src={videoData.thumbnail_url || getYouTubeThumbnail(extractVideoId(videoData.video_id))}
                          alt="Video thumbnail"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg';
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-red-600 rounded-full p-3">
                            <Play size={20} className="text-white ml-1" fill="currentColor" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2 pt-4">
                    <Button onClick={saveVideo} disabled={isSaving} className="flex-1">
                      <Save className="mr-2 h-4 w-4" />
                      {isSaving ? "Saving..." : (editingVideo ? "Update" : "Add")}
                    </Button>
                    <Button variant="outline" onClick={closeVideoDialog}>
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Videos Grid */}
          <div className="grid gap-4">
            {videos.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Youtube className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No videos yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Add your first YouTube video to get started
                  </p>
                  <Button onClick={() => openVideoDialog()}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add First Video
                  </Button>
                </CardContent>
              </Card>
            ) : (
              videos
                .sort((a, b) => a.display_order - b.display_order)
                .map((video, index) => (
                  <Card key={video.id} className="overflow-hidden">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <div className="relative w-32 h-18 bg-muted">
                          <img
                            src={video.thumbnail_url || getYouTubeThumbnail(video.video_id)}
                            alt={video.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg';
                            }}
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-red-600/80 rounded-full p-1">
                              <Play size={12} className="text-white ml-0.5" fill="currentColor" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1 mr-4">
                            <h3 className="font-semibold line-clamp-1">{video.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              Order: {video.display_order} | ID: {video.video_id}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={video.is_active ? "default" : "secondary"}>
                              {video.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </div>
                        
                        {video.description && (
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {video.description}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => moveVideo(video, 'up')}
                                disabled={index === 0}
                              >
                                <ChevronUp className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => moveVideo(video, 'down')}
                                disabled={index === videos.length - 1}
                              >
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <Switch
                              checked={video.is_active}
                              onCheckedChange={() => toggleVideoStatus(video)}
                            />
                          </div>
                          
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(getYouTubeUrl(video.video_id), '_blank')}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openVideoDialog(video)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteVideo(video)}
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
        </TabsContent>

        <TabsContent value="section" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>YouTube Section Settings</CardTitle>
              <CardDescription>
                Configure the title and subtitle for the YouTube section
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="section-title">Section Title *</Label>
                <Input
                  id="section-title"
                  value={sectionData.title}
                  onChange={(e) => setSectionData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Latest Videos, YouTube Content"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="section-subtitle">Section Subtitle</Label>
                <Textarea
                  id="section-subtitle"
                  value={sectionData.subtitle}
                  onChange={(e) => setSectionData(prev => ({ ...prev, subtitle: e.target.value }))}
                  placeholder="Optional description for the YouTube section"
                  rows={3}
                />
              </div>
              <Button onClick={saveSectionTitle} disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : "Save Section Settings"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};