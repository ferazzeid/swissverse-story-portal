import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SEOHeadProps {
  pageName: string;
}

export const SEOHead = ({ pageName }: SEOHeadProps) => {
  useEffect(() => {
    const ensureMeta = (selector: string, attrs: Record<string, string>) => {
      let el = document.head.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
        document.head.appendChild(el!);
      }
      return el!;
    };

    const ensureLink = (rel: string, href: string) => {
      let el = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!el) {
        el = document.createElement('link');
        el.rel = rel;
        document.head.appendChild(el);
      }
      el.href = href;
      return el;
    };

    const updateSEO = async () => {
      try {
        const { data, error } = await supabase
          .from('seo_metadata')
          .select('meta_title, meta_description')
          .eq('page_name', pageName)
          .eq('is_active', true)
          .maybeSingle();

        if (error) throw error;

        const title = data?.meta_title || document.title || 'SWISSVERSE';
        const description = data?.meta_description || 'SWISSVERSE: Web3, NFT, AI and Metaverse.';
        const url = window.location.href;

        // Title
        document.title = title;

        // Meta description
        const descMeta = ensureMeta('meta[name="description"]', { name: 'description', content: description });
        descMeta.setAttribute('content', description);

        // Canonical
        ensureLink('canonical', url);

        // Open Graph
        const ogTitle = ensureMeta('meta[property="og:title"]', { property: 'og:title', content: title });
        ogTitle.setAttribute('content', title);
        const ogDesc = ensureMeta('meta[property="og:description"]', { property: 'og:description', content: description });
        ogDesc.setAttribute('content', description);
        const ogType = ensureMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' });
        ogType.setAttribute('content', 'website');
        const ogUrl = ensureMeta('meta[property="og:url"]', { property: 'og:url', content: url });
        ogUrl.setAttribute('content', url);

        // Twitter
        const twCard = ensureMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
        twCard.setAttribute('content', 'summary_large_image');
        const twTitle = ensureMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title });
        twTitle.setAttribute('content', title);
        const twDesc = ensureMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description });
        twDesc.setAttribute('content', description);

        // Basic JSON-LD for WebSite
        const ldJson = {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: title,
          url,
          potentialAction: {
            '@type': 'SearchAction',
            target: `${window.location.origin}/?q={search_term_string}`,
            'query-input': 'required name=search_term_string'
          }
        };
        let script = document.getElementById('ld-website') as HTMLScriptElement | null;
        if (!script) {
          script = document.createElement('script') as HTMLScriptElement;
          script.type = 'application/ld+json';
          script.id = 'ld-website';
          document.head.appendChild(script);
        }
        script.textContent = JSON.stringify(ldJson);
      } catch (error) {
        console.error('Error loading SEO metadata:', error);
      }
    };

    updateSEO();
  }, [pageName]);

  return null; // This component doesn't render anything
};