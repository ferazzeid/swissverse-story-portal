import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, ChevronUp, ChevronDown, Save, X, Search, Eye } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  category: string;
  related_terms: string[] | null;
  term_slug: string | null;
  meta_title: string | null;
  meta_description: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface EditTermData {
  term: string;
  definition: string;
  category: string;
  related_terms: string[];
  term_slug: string;
  meta_title: string;
  meta_description: string;
}

const categoryOptions = [
  { value: 'blockchain', label: 'Blockchain' },
  { value: 'metaverse', label: 'Metaverse' },
  { value: 'technical', label: 'Technical' },
  { value: 'platforms', label: 'Platforms' },
  { value: 'general', label: 'General' }
];

export const GlossaryManager = () => {
  const { toast } = useToast();
  const [terms, setTerms] = useState<GlossaryTerm[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTerm, setEditingTerm] = useState<GlossaryTerm | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [termData, setTermData] = useState<EditTermData>({
    term: '',
    definition: '',
    category: 'general',
    related_terms: [],
    term_slug: '',
    meta_title: '',
    meta_description: ''
  });

  useEffect(() => {
    fetchTerms();
  }, []);

  const fetchTerms = async () => {
    const { data, error } = await supabase
      .from('glossary_terms')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('Error fetching terms:', error);
      toast({
        title: "Error",
        description: "Failed to load glossary terms",
        variant: "destructive",
      });
      return;
    }

    setTerms(data || []);
    setLoading(false);
  };

  const resetForm = () => {
    setTermData({
      term: '',
      definition: '',
      category: 'general',
      related_terms: [],
      term_slug: '',
      meta_title: '',
      meta_description: ''
    });
    setEditingTerm(null);
  };

  const openDialog = (term?: GlossaryTerm) => {
    if (term) {
      setEditingTerm(term);
      setTermData({
        term: term.term,
        definition: term.definition,
        category: term.category,
        related_terms: term.related_terms || [],
        term_slug: term.term_slug || '',
        meta_title: term.meta_title || '',
        meta_description: term.meta_description || ''
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

  const generateSlug = (term: string) => {
    return term.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const saveTerm = async () => {
    if (!termData.term.trim() || !termData.definition.trim()) {
      toast({
        title: "Validation Error",
        description: "Term and definition are required",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const slug = termData.term_slug || generateSlug(termData.term);

      if (editingTerm) {
        // Update existing term
        const { error } = await supabase
          .from('glossary_terms')
          .update({
            term: termData.term,
            definition: termData.definition,
            category: termData.category,
            related_terms: termData.related_terms.length > 0 ? termData.related_terms : null,
            term_slug: slug,
            meta_title: termData.meta_title || null,
            meta_description: termData.meta_description || null
          })
          .eq('id', editingTerm.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Term updated successfully",
        });
      } else {
        // Get max display order
        const maxOrder = terms.reduce((max, term) => Math.max(max, term.display_order), 0);

        // Create new term
        const { error } = await supabase
          .from('glossary_terms')
          .insert({
            term: termData.term,
            definition: termData.definition,
            category: termData.category,
            related_terms: termData.related_terms.length > 0 ? termData.related_terms : null,
            term_slug: slug,
            meta_title: termData.meta_title || null,
            meta_description: termData.meta_description || null,
            display_order: maxOrder + 1
          });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Term created successfully",
        });
      }

      await fetchTerms();
      closeDialog();
    } catch (error) {
      console.error('Error saving term:', error);
      toast({
        title: "Error",
        description: "Failed to save term",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const toggleTermStatus = async (term: GlossaryTerm) => {
    const { error } = await supabase
      .from('glossary_terms')
      .update({ is_active: !term.is_active })
      .eq('id', term.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update term status",
        variant: "destructive",
      });
      return;
    }

    await fetchTerms();
    toast({
      title: "Success",
      description: `Term ${!term.is_active ? 'activated' : 'deactivated'}`,
    });
  };

  const deleteTerm = async (term: GlossaryTerm) => {
    if (!confirm('Are you sure you want to delete this term?')) return;

    const { error } = await supabase
      .from('glossary_terms')
      .delete()
      .eq('id', term.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete term",
        variant: "destructive",
      });
      return;
    }

    await fetchTerms();
    toast({
      title: "Success",
      description: "Term deleted successfully",
    });
  };

  const moveTerm = async (term: GlossaryTerm, direction: 'up' | 'down') => {
    const sortedTerms = [...terms].sort((a, b) => a.display_order - b.display_order);
    const currentIndex = sortedTerms.findIndex(t => t.id === term.id);
    
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === sortedTerms.length - 1)
    ) {
      return;
    }

    const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const swapTerm = sortedTerms[swapIndex];

    const { error } = await supabase
      .from('glossary_terms')
      .update({ display_order: swapTerm.display_order })
      .eq('id', term.id);

    if (!error) {
      await supabase
        .from('glossary_terms')
        .update({ display_order: term.display_order })
        .eq('id', swapTerm.id);
    }

    if (error) {
      toast({
        title: "Error",
        description: "Failed to reorder terms",
        variant: "destructive",
      });
      return;
    }

    await fetchTerms();
  };

  const filteredTerms = terms.filter(term => {
    const matchesSearch = term.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         term.definition.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || term.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      blockchain: "bg-orange-100 text-orange-800 border-orange-200",
      metaverse: "bg-purple-100 text-purple-800 border-purple-200",
      technical: "bg-blue-100 text-blue-800 border-blue-200",
      platforms: "bg-green-100 text-green-800 border-green-200",
      general: "bg-gray-100 text-gray-800 border-gray-200"
    };
    return colors[category] || colors.general;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Glossary Management</h2>
          <p className="text-muted-foreground">
            Manage metaverse and Web3 terminology definitions
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => openDialog()}>
              <Plus className="mr-2 h-4 w-4" />
              Add Term
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingTerm ? 'Edit Term' : 'Add New Term'}
              </DialogTitle>
              <DialogDescription>
                {editingTerm ? 'Update the term details below.' : 'Add a new term to the glossary.'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="term">Term *</Label>
                  <Input
                    id="term"
                    value={termData.term}
                    onChange={(e) => {
                      const term = e.target.value;
                      setTermData(prev => ({ 
                        ...prev, 
                        term,
                        term_slug: prev.term_slug || generateSlug(term)
                      }))
                    }}
                    placeholder="NFT, Metaverse, etc."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={termData.category}
                    onValueChange={(value) => setTermData(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="definition">Definition *</Label>
                <Textarea
                  id="definition"
                  value={termData.definition}
                  onChange={(e) => setTermData(prev => ({ ...prev, definition: e.target.value }))}
                  placeholder="Clear and concise definition of the term..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="term-slug">URL Slug</Label>
                <Input
                  id="term-slug"
                  value={termData.term_slug}
                  onChange={(e) => setTermData(prev => ({ ...prev, term_slug: e.target.value }))}
                  placeholder="url-friendly-slug"
                />
                <p className="text-xs text-muted-foreground">
                  Term will be available at: /glossary/{termData.term_slug || 'term-slug'}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta-title">Meta Title (SEO)</Label>
                <Input
                  id="meta-title"
                  value={termData.meta_title}
                  onChange={(e) => setTermData(prev => ({ ...prev, meta_title: e.target.value }))}
                  placeholder="SEO title for this term"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="meta-description">Meta Description (SEO)</Label>
                <Textarea
                  id="meta-description"
                  value={termData.meta_description}
                  onChange={(e) => setTermData(prev => ({ ...prev, meta_description: e.target.value }))}
                  placeholder="SEO description for this term"
                  rows={2}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={saveTerm} disabled={isSaving} className="flex-1">
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? "Saving..." : (editingTerm ? "Update" : "Add")}
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

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search terms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categoryOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Terms List */}
      <div className="space-y-4">
        {filteredTerms.map((term) => (
          <Card key={term.id} className={`transition-all ${!term.is_active ? 'opacity-50' : ''}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-lg">{term.term}</CardTitle>
                  <Badge className={getCategoryColor(term.category)}>
                    {term.category}
                  </Badge>
                  {!term.is_active && (
                    <Badge variant="secondary">Inactive</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(`/glossary/${term.term_slug}`, '_blank')}
                    disabled={!term.term_slug}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => moveTerm(term, 'up')}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => moveTerm(term, 'down')}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <Switch
                    checked={term.is_active}
                    onCheckedChange={() => toggleTermStatus(term)}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openDialog(term)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteTerm(term)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="line-clamp-2">
                {term.definition}
              </CardDescription>
              {term.related_terms && term.related_terms.length > 0 && (
                <div className="mt-2">
                  <span className="text-sm text-muted-foreground">Related: </span>
                  <span className="text-sm">{term.related_terms.join(', ')}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {filteredTerms.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No terms found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};