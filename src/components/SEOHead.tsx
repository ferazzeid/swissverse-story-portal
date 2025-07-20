import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SEOHeadProps {
  pageName: string;
}

export const SEOHead = ({ pageName }: SEOHeadProps) => {
  useEffect(() => {
    const updateSEO = async () => {
      try {
        const { data, error } = await supabase
          .from('seo_metadata')
          .select('meta_title, meta_description')
          .eq('page_name', pageName)
          .eq('is_active', true)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          if (data.meta_title) {
            document.title = data.meta_title;
          }
          
          if (data.meta_description) {
            // Update or create meta description
            let metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) {
              metaDesc.setAttribute('content', data.meta_description);
            } else {
              metaDesc = document.createElement('meta');
              metaDesc.setAttribute('name', 'description');
              metaDesc.setAttribute('content', data.meta_description);
              document.head.appendChild(metaDesc);
            }

            // Update Open Graph description
            let ogDesc = document.querySelector('meta[property="og:description"]');
            if (ogDesc) {
              ogDesc.setAttribute('content', data.meta_description);
            }

            // Update Open Graph title
            if (data.meta_title) {
              let ogTitle = document.querySelector('meta[property="og:title"]');
              if (ogTitle) {
                ogTitle.setAttribute('content', data.meta_title);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error loading SEO metadata:', error);
      }
    };

    updateSEO();
  }, [pageName]);

  return null; // This component doesn't render anything
};