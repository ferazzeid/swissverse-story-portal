import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Save } from "lucide-react";

interface HomePageContent {
  id: string;
  section_key: string;
  title: string;
  content: string;
  tag_type: string;
}

interface SeoMetadata {
  id: string;
  page_name: string;
  meta_title: string;
  meta_description: string;
}

interface HeroLink {
  id: string;
  title: string;
  url: string;
}

export const HomePageManager = () => {
  const [homeContent, setHomeContent] = useState<HomePageContent[]>([]);
  const [seoData, setSeoData] = useState<SeoMetadata | null>(null);
  const [heroLinks, setHeroLinks] = useState<HeroLink[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchHomePageData();
  }, []);

  const fetchHomePageData = async () => {
    setIsLoading(true);
    try {
      // Fetch home page content
      const { data: contentData, error: contentError } = await supabase
        .from('home_page_content')
        .select('*')
        .eq('is_active', true)
        .order('section_key');

      if (contentError) throw contentError;

      // Fetch SEO metadata
      const { data: seoData, error: seoError } = await supabase
        .from('seo_metadata')
        .select('*')
        .eq('page_name', 'home')
        .eq('is_active', true)
        .maybeSingle();

      if (seoError) throw seoError;

      // Fetch hero links
      const { data: linksData, error: linksError } = await supabase
        .from('configurable_links')
        .select('id, title, url')
        .in('link_key', ['visit_metaverse', 'follow_x'])
        .eq('is_active', true)
        .order('display_order');

      if (linksError) throw linksError;

      setHomeContent(contentData || []);
      setSeoData(seoData);
      setHeroLinks(linksData || []);
    } catch (error) {
      console.error('Error fetching home page data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load home page content",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateContent = (sectionKey: string, field: string, value: string) => {
    setHomeContent(prev => 
      prev.map(item => 
        item.section_key === sectionKey 
          ? { ...item, [field]: value }
          : item
      )
    );
  };

  const updateSeoData = (field: string, value: string) => {
    setSeoData(prev => prev ? { ...prev, [field]: value } : null);
  };

  const updateHeroLink = (id: string, field: string, value: string) => {
    setHeroLinks(prev => 
      prev.map(link => 
        link.id === id 
          ? { ...link, [field]: value }
          : link
      )
    );
  };

  const saveChanges = async () => {
    setIsSaving(true);
    try {
      // Update home page content
      for (const item of homeContent) {
        const { error } = await supabase
          .from('home_page_content')
          .update({
            title: item.title,
            content: item.content,
            tag_type: item.tag_type
          })
          .eq('id', item.id);

        if (error) throw error;
      }

      // Update SEO metadata
      if (seoData) {
        const { error } = await supabase
          .from('seo_metadata')
          .update({
            meta_title: seoData.meta_title,
            meta_description: seoData.meta_description
          })
          .eq('id', seoData.id);

        if (error) throw error;
      }

      // Update hero links
      for (const link of heroLinks) {
        const { error } = await supabase
          .from('configurable_links')
          .update({
            title: link.title,
            url: link.url
          })
          .eq('id', link.id);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Home page content updated successfully",
      });
    } catch (error) {
      console.error('Error saving changes:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save changes",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getSectionLabel = (sectionKey: string) => {
    const labels: { [key: string]: string } = {
      'hero_title': 'Main Title (H1)',
      'hero_subtitle': 'Subtitle (H2)',
      'explorer_title': 'Explorer Title (H3)',
      'pioneer_title': 'Pioneer Title (H3)', 
      'creator_title': 'Creator Title (H3)'
    };
    return labels[sectionKey] || sectionKey;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Loading home page content...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Home Page Content</h2>
          <p className="text-muted-foreground">
            Manage the main content and SEO settings for your home page
          </p>
        </div>
        <Button onClick={saveChanges} disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Hero Links */}
      <Card>
        <CardHeader>
          <CardTitle>Hero Section Links</CardTitle>
          <CardDescription>
            Manage the main action buttons in the hero section
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {heroLinks.map((link) => (
            <div key={link.id} className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Button Text</Label>
                <Input
                  value={link.title}
                  onChange={(e) => updateHeroLink(link.id, 'title', e.target.value)}
                  placeholder="Enter button text"
                />
              </div>
              <div className="space-y-2">
                <Label>URL</Label>
                <Input
                  value={link.url}
                  onChange={(e) => updateHeroLink(link.id, 'url', e.target.value)}
                  placeholder="Enter URL"
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Hero Section Content */}
      <Card>
        <CardHeader>
          <CardTitle>Hero Section Content</CardTitle>
          <CardDescription>
            Edit the main titles and headings displayed on your home page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {homeContent.map((item) => (
            <div key={item.section_key} className="space-y-2">
              <Label>{getSectionLabel(item.section_key)}</Label>
              <div className="flex gap-2">
                <Input
                  value={item.title}
                  onChange={(e) => updateContent(item.section_key, 'title', e.target.value)}
                  placeholder="Enter title"
                  className="flex-1"
                />
                <Select
                  value={item.tag_type}
                  onValueChange={(value) => updateContent(item.section_key, 'tag_type', value)}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="h1">H1</SelectItem>
                    <SelectItem value="h2">H2</SelectItem>
                    <SelectItem value="h3">H3</SelectItem>
                    <SelectItem value="h4">H4</SelectItem>
                    <SelectItem value="h5">H5</SelectItem>
                    <SelectItem value="h6">H6</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {item.content !== null && (
                <Textarea
                  value={item.content}
                  onChange={(e) => updateContent(item.section_key, 'content', e.target.value)}
                  placeholder="Additional content (optional)"
                  rows={2}
                />
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Separator />

      {/* SEO Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>SEO Metadata</CardTitle>
          <CardDescription>
            Configure the SEO title and description for your home page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {seoData && (
            <>
              <div className="space-y-2">
                <Label htmlFor="meta-title">Meta Title</Label>
                <Input
                  id="meta-title"
                  value={seoData.meta_title || ''}
                  onChange={(e) => updateSeoData('meta_title', e.target.value)}
                  placeholder="Enter SEO title (recommended: 50-60 characters)"
                  maxLength={60}
                />
                <p className="text-xs text-muted-foreground">
                  {seoData.meta_title?.length || 0}/60 characters
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="meta-description">Meta Description</Label>
                <Textarea
                  id="meta-description"
                  value={seoData.meta_description || ''}
                  onChange={(e) => updateSeoData('meta_description', e.target.value)}
                  placeholder="Enter SEO description (recommended: 150-160 characters)"
                  maxLength={160}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  {seoData.meta_description?.length || 0}/160 characters
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};