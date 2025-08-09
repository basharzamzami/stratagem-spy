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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      ads: {
        Row: {
          ad_creative_url: string | null
          campaign_type: string | null
          competitor: string
          creative_hash: string | null
          cta: string | null
          detected_patterns: Json | null
          engagement: Json | null
          estimated_spend_daily: number | null
          fetched_at: string | null
          first_seen: string | null
          id: string
          landing_page_snapshot: string | null
          landing_page_url: string | null
          last_seen: string | null
          offer: string | null
          platform: string
          status: string | null
          target_audience: Json | null
        }
        Insert: {
          ad_creative_url?: string | null
          campaign_type?: string | null
          competitor: string
          creative_hash?: string | null
          cta?: string | null
          detected_patterns?: Json | null
          engagement?: Json | null
          estimated_spend_daily?: number | null
          fetched_at?: string | null
          first_seen?: string | null
          id?: string
          landing_page_snapshot?: string | null
          landing_page_url?: string | null
          last_seen?: string | null
          offer?: string | null
          platform: string
          status?: string | null
          target_audience?: Json | null
        }
        Update: {
          ad_creative_url?: string | null
          campaign_type?: string | null
          competitor?: string
          creative_hash?: string | null
          cta?: string | null
          detected_patterns?: Json | null
          engagement?: Json | null
          estimated_spend_daily?: number | null
          fetched_at?: string | null
          first_seen?: string | null
          id?: string
          landing_page_snapshot?: string | null
          landing_page_url?: string | null
          last_seen?: string | null
          offer?: string | null
          platform?: string
          status?: string | null
          target_audience?: Json | null
        }
        Relationships: []
      }
      alerts: {
        Row: {
          channels: string[] | null
          created_at: string | null
          data: Json | null
          id: string
          message: string | null
          read: boolean | null
          severity: string | null
          title: string
          type: string
        }
        Insert: {
          channels?: string[] | null
          created_at?: string | null
          data?: Json | null
          id?: string
          message?: string | null
          read?: boolean | null
          severity?: string | null
          title: string
          type: string
        }
        Update: {
          channels?: string[] | null
          created_at?: string | null
          data?: Json | null
          id?: string
          message?: string | null
          read?: boolean | null
          severity?: string | null
          title?: string
          type?: string
        }
        Relationships: []
      }
      competitors: {
        Row: {
          created_at: string | null
          domain: string | null
          dominance_score: number | null
          estimated_monthly_spend: number | null
          id: string
          industry: string | null
          last_activity: string | null
          location_city: string | null
          location_state: string | null
          location_zip: string | null
          name: string
          total_ads_count: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          domain?: string | null
          dominance_score?: number | null
          estimated_monthly_spend?: number | null
          id?: string
          industry?: string | null
          last_activity?: string | null
          location_city?: string | null
          location_state?: string | null
          location_zip?: string | null
          name: string
          total_ads_count?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          domain?: string | null
          dominance_score?: number | null
          estimated_monthly_spend?: number | null
          id?: string
          industry?: string | null
          last_activity?: string | null
          location_city?: string | null
          location_state?: string | null
          location_zip?: string | null
          name?: string
          total_ads_count?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      external_crm_sync: {
        Row: {
          created_at: string | null
          crm_type: string
          error_message: string | null
          external_id: string
          id: string
          last_synced: string | null
          lead_id: string | null
          sync_data: Json | null
          sync_status: string | null
        }
        Insert: {
          created_at?: string | null
          crm_type: string
          error_message?: string | null
          external_id: string
          id?: string
          last_synced?: string | null
          lead_id?: string | null
          sync_data?: Json | null
          sync_status?: string | null
        }
        Update: {
          created_at?: string | null
          crm_type?: string
          error_message?: string | null
          external_id?: string
          id?: string
          last_synced?: string | null
          lead_id?: string | null
          sync_data?: Json | null
          sync_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "external_crm_sync_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      follow_up_tasks: {
        Row: {
          auto_generated: boolean | null
          created_at: string | null
          id: string
          lead_id: string | null
          task_id: string | null
          trigger_condition: Json | null
          trigger_type: string
        }
        Insert: {
          auto_generated?: boolean | null
          created_at?: string | null
          id?: string
          lead_id?: string | null
          task_id?: string | null
          trigger_condition?: Json | null
          trigger_type: string
        }
        Update: {
          auto_generated?: boolean | null
          created_at?: string | null
          id?: string
          lead_id?: string | null
          task_id?: string | null
          trigger_condition?: Json | null
          trigger_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "follow_up_tasks_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follow_up_tasks_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_journey: {
        Row: {
          id: string
          lead_id: string | null
          sequence_order: number | null
          stage: string
          stage_data: Json
          timestamp: string | null
        }
        Insert: {
          id?: string
          lead_id?: string | null
          sequence_order?: number | null
          stage: string
          stage_data: Json
          timestamp?: string | null
        }
        Update: {
          id?: string
          lead_id?: string | null
          sequence_order?: number | null
          stage?: string
          stage_data?: Json
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_journey_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_sources: {
        Row: {
          created_at: string | null
          id: string
          lead_id: string | null
          source_data: Json | null
          source_id: string
          source_type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          lead_id?: string | null
          source_data?: Json | null
          source_id: string
          source_type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          lead_id?: string | null
          source_data?: Json | null
          source_id?: string
          source_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_sources_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          company: string | null
          created_at: string | null
          email: string | null
          enrichment_data: Json | null
          id: string
          intent_score: number | null
          location_city: string | null
          location_state: string | null
          location_zip: string | null
          name: string | null
          notes: string | null
          phone: string | null
          source: string | null
          source_data: Json | null
          status: string | null
          tags: string[] | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          email?: string | null
          enrichment_data?: Json | null
          id?: string
          intent_score?: number | null
          location_city?: string | null
          location_state?: string | null
          location_zip?: string | null
          name?: string | null
          notes?: string | null
          phone?: string | null
          source?: string | null
          source_data?: Json | null
          status?: string | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string | null
          email?: string | null
          enrichment_data?: Json | null
          id?: string
          intent_score?: number | null
          location_city?: string | null
          location_state?: string | null
          location_zip?: string | null
          name?: string | null
          notes?: string | null
          phone?: string | null
          source?: string | null
          source_data?: Json | null
          status?: string | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      market_dominance: {
        Row: {
          ad_presence_score: number | null
          city: string | null
          competitor_id: string | null
          dominance_score: number | null
          id: string
          last_calculated: string | null
          review_score: number | null
          seo_rank_average: number | null
          state: string | null
          zip_code: string
        }
        Insert: {
          ad_presence_score?: number | null
          city?: string | null
          competitor_id?: string | null
          dominance_score?: number | null
          id?: string
          last_calculated?: string | null
          review_score?: number | null
          seo_rank_average?: number | null
          state?: string | null
          zip_code: string
        }
        Update: {
          ad_presence_score?: number | null
          city?: string | null
          competitor_id?: string | null
          dominance_score?: number | null
          id?: string
          last_calculated?: string | null
          review_score?: number | null
          seo_rank_average?: number | null
          state?: string | null
          zip_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "market_dominance_competitor_id_fkey"
            columns: ["competitor_id"]
            isOneToOne: false
            referencedRelation: "competitors"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          assigned_to: string | null
          category: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          estimated_impact: string | null
          execution_steps: Json | null
          id: string
          priority: number | null
          related_entities: Json | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          estimated_impact?: string | null
          execution_steps?: Json | null
          id?: string
          priority?: number | null
          related_entities?: Json | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          category?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          estimated_impact?: string | null
          execution_steps?: Json | null
          id?: string
          priority?: number | null
          related_entities?: Json | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
