export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      configurable_links: {
        Row: {
          button_size: string
          button_variant: string
          created_at: string
          display_order: number
          icon_name: string
          id: string
          is_active: boolean
          link_key: string
          title: string
          updated_at: string
          url: string
        }
        Insert: {
          button_size?: string
          button_variant?: string
          created_at?: string
          display_order?: number
          icon_name: string
          id?: string
          is_active?: boolean
          link_key: string
          title: string
          updated_at?: string
          url: string
        }
        Update: {
          button_size?: string
          button_variant?: string
          created_at?: string
          display_order?: number
          icon_name?: string
          id?: string
          is_active?: boolean
          link_key?: string
          title?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      gallery_images: {
        Row: {
          alt_text: string
          created_at: string
          description: string | null
          display_order: number
          id: string
          image_url: string
          is_active: boolean
          title: string
          updated_at: string
        }
        Insert: {
          alt_text: string
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          image_url: string
          is_active?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          alt_text?: string
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          image_url?: string
          is_active?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      glossary_terms: {
        Row: {
          category: string
          created_at: string
          definition: string
          display_order: number
          id: string
          is_active: boolean
          meta_description: string | null
          meta_title: string | null
          related_terms: string[] | null
          term: string
          term_slug: string | null
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          definition: string
          display_order?: number
          id?: string
          is_active?: boolean
          meta_description?: string | null
          meta_title?: string | null
          related_terms?: string[] | null
          term: string
          term_slug?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          definition?: string
          display_order?: number
          id?: string
          is_active?: boolean
          meta_description?: string | null
          meta_title?: string | null
          related_terms?: string[] | null
          term?: string
          term_slug?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      home_page_content: {
        Row: {
          content: string | null
          created_at: string
          id: string
          is_active: boolean
          section_key: string
          tag_type: string
          title: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          section_key: string
          tag_type?: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          section_key?: string
          tag_type?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      metaverse_projects: {
        Row: {
          created_at: string
          description: string
          display_order: number
          id: string
          image_url: string
          is_active: boolean
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          display_order?: number
          id?: string
          image_url: string
          is_active?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          display_order?: number
          id?: string
          image_url?: string
          is_active?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      resources: {
        Row: {
          category: string
          created_at: string
          description: string
          display_order: number
          icon_name: string
          id: string
          is_active: boolean
          link_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          description: string
          display_order?: number
          icon_name: string
          id?: string
          is_active?: boolean
          link_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          display_order?: number
          icon_name?: string
          id?: string
          is_active?: boolean
          link_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      section_titles: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          section_name: string
          subtitle: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          section_name: string
          subtitle?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          section_name?: string
          subtitle?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      seo_metadata: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          meta_description: string | null
          meta_title: string | null
          page_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          meta_description?: string | null
          meta_title?: string | null
          page_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          meta_description?: string | null
          meta_title?: string | null
          page_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      timeline_content: {
        Row: {
          content: string
          created_at: string
          display_order: number
          full_story: string | null
          gradient_class: string
          has_story: boolean | null
          highlight: string
          icon_name: string
          id: string
          image_url: string | null
          is_active: boolean
          meta_description: string | null
          meta_title: string | null
          month: string | null
          story_image_url: string | null
          story_slug: string | null
          title: string
          updated_at: string
          year: number
          year_title: string
        }
        Insert: {
          content: string
          created_at?: string
          display_order?: number
          full_story?: string | null
          gradient_class: string
          has_story?: boolean | null
          highlight: string
          icon_name: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          meta_description?: string | null
          meta_title?: string | null
          month?: string | null
          story_image_url?: string | null
          story_slug?: string | null
          title: string
          updated_at?: string
          year: number
          year_title: string
        }
        Update: {
          content?: string
          created_at?: string
          display_order?: number
          full_story?: string | null
          gradient_class?: string
          has_story?: boolean | null
          highlight?: string
          icon_name?: string
          id?: string
          image_url?: string | null
          is_active?: boolean
          meta_description?: string | null
          meta_title?: string | null
          month?: string | null
          story_image_url?: string | null
          story_slug?: string | null
          title?: string
          updated_at?: string
          year?: number
          year_title?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      youtube_videos: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          id: string
          is_active: boolean
          thumbnail_url: string | null
          title: string
          updated_at: string
          video_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          video_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          id?: string
          is_active?: boolean
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          video_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
