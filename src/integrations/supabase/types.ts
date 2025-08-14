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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          badge_type: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          points_required: number | null
        }
        Insert: {
          badge_type?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          points_required?: number | null
        }
        Update: {
          badge_type?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          points_required?: number | null
        }
        Relationships: []
      }
      activity_log: {
        Row: {
          action: string
          created_at: string | null
          description: string | null
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      app_config: {
        Row: {
          key: string
          value: string
        }
        Insert: {
          key: string
          value: string
        }
        Update: {
          key?: string
          value?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string | null
          favorite_user_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          favorite_user_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          favorite_user_id?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          applicant_id: string
          created_at: string | null
          id: string
          job_id: string
          message: string | null
          status: string | null
        }
        Insert: {
          applicant_id: string
          created_at?: string | null
          id?: string
          job_id: string
          message?: string | null
          status?: string | null
        }
        Update: {
          applicant_id?: string
          created_at?: string | null
          id?: string
          job_id?: string
          message?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      job_tickets: {
        Row: {
          applicant_id: string
          completed_at: string | null
          created_at: string | null
          id: string
          job_id: string
          karma_awarded: boolean | null
          payment_released: boolean | null
          status: string | null
        }
        Insert: {
          applicant_id: string
          completed_at?: string | null
          created_at?: string | null
          id?: string
          job_id: string
          karma_awarded?: boolean | null
          payment_released?: boolean | null
          status?: string | null
        }
        Update: {
          applicant_id?: string
          completed_at?: string | null
          created_at?: string | null
          id?: string
          job_id?: string
          karma_awarded?: boolean | null
          payment_released?: boolean | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "job_tickets_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          assigned_to: string | null
          budget: number | null
          category: string
          created_at: string | null
          creator_id: string
          description: string | null
          due_date: string | null
          estimated_duration: number | null
          id: string
          images: string[] | null
          job_level: number | null
          job_type: string
          karma_reward: number | null
          latitude: number | null
          location: string
          longitude: number | null
          required_karma: number | null
          required_rank: Database["public"]["Enums"]["user_rank"] | null
          requirements: string[] | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          budget?: number | null
          category: string
          created_at?: string | null
          creator_id: string
          description?: string | null
          due_date?: string | null
          estimated_duration?: number | null
          id?: string
          images?: string[] | null
          job_level?: number | null
          job_type: string
          karma_reward?: number | null
          latitude?: number | null
          location: string
          longitude?: number | null
          required_karma?: number | null
          required_rank?: Database["public"]["Enums"]["user_rank"] | null
          requirements?: string[] | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          budget?: number | null
          category?: string
          created_at?: string | null
          creator_id?: string
          description?: string | null
          due_date?: string | null
          estimated_duration?: number | null
          id?: string
          images?: string[] | null
          job_level?: number | null
          job_type?: string
          karma_reward?: number | null
          latitude?: number | null
          location?: string
          longitude?: number | null
          required_karma?: number | null
          required_rank?: Database["public"]["Enums"]["user_rank"] | null
          requirements?: string[] | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      karma_transactions: {
        Row: {
          created_at: string | null
          id: string
          job_id: string | null
          mission_id: string | null
          points: number
          reason: string
          transaction_type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          job_id?: string | null
          mission_id?: string | null
          points: number
          reason: string
          transaction_type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          job_id?: string | null
          mission_id?: string | null
          points?: number
          reason?: string
          transaction_type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "karma_transactions_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "karma_transactions_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          job_id: string
          message_type: string | null
          read_at: string | null
          recipient_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          job_id: string
          message_type?: string | null
          read_at?: string | null
          recipient_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          job_id?: string
          message_type?: string | null
          read_at?: string | null
          recipient_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      missions: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          karma_reward: number
          max_completions_per_week: number | null
          mission_type: Database["public"]["Enums"]["mission_type"]
          photo_required: boolean | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          karma_reward?: number
          max_completions_per_week?: number | null
          mission_type?: Database["public"]["Enums"]["mission_type"]
          photo_required?: boolean | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          karma_reward?: number
          max_completions_per_week?: number | null
          mission_type?: Database["public"]["Enums"]["mission_type"]
          photo_required?: boolean | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          read_at: string | null
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          read_at?: string | null
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          read_at?: string | null
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          job_id: string
          status: string | null
          stripe_payment_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          job_id: string
          status?: string | null
          stripe_payment_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          job_id?: string
          status?: string | null
          stripe_payment_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          cash_points: number | null
          created_at: string | null
          first_name: string | null
          good_deeds_completed: number | null
          id: string
          is_verified: boolean | null
          karma_points: number | null
          last_active: string | null
          last_name: string | null
          location: string | null
          phone: string | null
          rank: Database["public"]["Enums"]["user_rank"] | null
          rating: number | null
          streak_days: number | null
          stripe_customer_id: string | null
          total_earned: number | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          cash_points?: number | null
          created_at?: string | null
          first_name?: string | null
          good_deeds_completed?: number | null
          id: string
          is_verified?: boolean | null
          karma_points?: number | null
          last_active?: string | null
          last_name?: string | null
          location?: string | null
          phone?: string | null
          rank?: Database["public"]["Enums"]["user_rank"] | null
          rating?: number | null
          streak_days?: number | null
          stripe_customer_id?: string | null
          total_earned?: number | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          cash_points?: number | null
          created_at?: string | null
          first_name?: string | null
          good_deeds_completed?: number | null
          id?: string
          is_verified?: boolean | null
          karma_points?: number | null
          last_active?: string | null
          last_name?: string | null
          location?: string | null
          phone?: string | null
          rank?: Database["public"]["Enums"]["user_rank"] | null
          rating?: number | null
          streak_days?: number | null
          stripe_customer_id?: string | null
          total_earned?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      ratings: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          job_id: string
          rated_id: string
          rater_id: string
          score: number
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          job_id: string
          rated_id: string
          rater_id: string
          score: number
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          job_id?: string
          rated_id?: string
          rater_id?: string
          score?: number
        }
        Relationships: [
          {
            foreignKeyName: "ratings_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          bonus_karma: number | null
          created_at: string | null
          id: string
          referred_email: string
          referred_user_id: string | null
          referrer_id: string
          status: string | null
        }
        Insert: {
          bonus_karma?: number | null
          created_at?: string | null
          id?: string
          referred_email: string
          referred_user_id?: string | null
          referrer_id: string
          status?: string | null
        }
        Update: {
          bonus_karma?: number | null
          created_at?: string | null
          id?: string
          referred_email?: string
          referred_user_id?: string | null
          referrer_id?: string
          status?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          job_id: string
          rating: number
          reviewee_id: string
          reviewer_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          job_id: string
          rating: number
          reviewee_id: string
          reviewer_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          job_id?: string
          rating?: number
          reviewee_id?: string
          reviewer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          id: string
          job_id: string | null
          status: string | null
          stripe_payment_intent_id: string | null
          transaction_type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          id?: string
          job_id?: string | null
          status?: string | null
          stripe_payment_intent_id?: string | null
          transaction_type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
          job_id?: string | null
          status?: string | null
          stripe_payment_intent_id?: string | null
          transaction_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      tutorial_progress: {
        Row: {
          category_id: string
          completed_at: string | null
          id: string
          lesson_id: string
          time_spent: number | null
          user_id: string
          xp_earned: number | null
        }
        Insert: {
          category_id: string
          completed_at?: string | null
          id?: string
          lesson_id: string
          time_spent?: number | null
          user_id: string
          xp_earned?: number | null
        }
        Update: {
          category_id?: string
          completed_at?: string | null
          id?: string
          lesson_id?: string
          time_spent?: number | null
          user_id?: string
          xp_earned?: number | null
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_id: string
          earned_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          achievement_id: string
          earned_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          achievement_id?: string
          earned_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      user_missions: {
        Row: {
          completed_at: string | null
          id: string
          karma_awarded: number | null
          mission_id: string
          photo_url: string | null
          user_id: string
          verification_status: string | null
        }
        Insert: {
          completed_at?: string | null
          id?: string
          karma_awarded?: number | null
          mission_id: string
          photo_url?: string | null
          user_id: string
          verification_status?: string | null
        }
        Update: {
          completed_at?: string | null
          id?: string
          karma_awarded?: number | null
          mission_id?: string
          photo_url?: string | null
          user_id?: string
          verification_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_missions_mission_id_fkey"
            columns: ["mission_id"]
            isOneToOne: false
            referencedRelation: "missions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          created_at: string | null
          dark_mode: boolean | null
          email_notifications: boolean | null
          id: string
          language: string | null
          notifications_enabled: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          dark_mode?: boolean | null
          email_notifications?: boolean | null
          id?: string
          language?: string | null
          notifications_enabled?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          dark_mode?: boolean | null
          email_notifications?: boolean | null
          id?: string
          language?: string | null
          notifications_enabled?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      verifications: {
        Row: {
          created_at: string | null
          document_type: string
          document_url: string
          status: string | null
          user_id: string
          verified_at: string | null
        }
        Insert: {
          created_at?: string | null
          document_type: string
          document_url: string
          status?: string | null
          user_id: string
          verified_at?: string | null
        }
        Update: {
          created_at?: string | null
          document_type?: string
          document_url?: string
          status?: string | null
          user_id?: string
          verified_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      award_karma: {
        Args: {
          user_id: string
          points: number
          reason: string
          job_id?: string
          mission_id?: string
          transaction_type?: string
        }
        Returns: boolean
      }
      calculate_user_level: {
        Args: { user_id: string }
        Returns: number
      }
      calculate_user_rank: {
        Args: { user_id: string }
        Returns: Database["public"]["Enums"]["user_rank"]
      }
      can_access_job: {
        Args: { user_id: string; job_id: string }
        Returns: boolean
      }
      complete_mission: {
        Args: { user_id: string; mission_id: string; photo_url?: string }
        Returns: Json
      }
      create_job_with_error_handling: {
        Args: {
          p_title: string
          p_description: string
          p_category: string
          p_job_type: string
          p_budget: number
          p_karma_reward: number
          p_location: string
          p_latitude?: number
          p_longitude?: number
          p_estimated_duration?: number
          p_due_date?: string
          p_images?: string[]
          p_requirements?: string[]
        }
        Returns: Json
      }
      find_unused_indexes: {
        Args: Record<PropertyKey, never>
        Returns: {
          index_name: string
          table_name: string
          index_size: string
          index_scans: number
        }[]
      }
      get_table_sizes: {
        Args: Record<PropertyKey, never>
        Returns: {
          table_name: string
          table_size: string
          index_size: string
          total_size: string
          row_count: number
        }[]
      }
      handle_error: {
        Args:
          | {
              error_code: string
              error_message?: string
              error_detail?: string
              error_hint?: string
              error_context?: string
            }
          | { error_message: string }
        Returns: undefined
      }
      is_valid_email: {
        Args: { email: string }
        Returns: boolean
      }
      is_valid_url: {
        Args: { url: string }
        Returns: boolean
      }
      perform_advanced_maintenance: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      search_jobs_secure: {
        Args: {
          search_term: string
          category_filter?: string
          location_filter?: string
          status_filter?: string
          page_number?: number
          page_size?: number
        }
        Returns: {
          id: string
          title: string
          description: string
          category: string
          location: string
          status: string
          created_at: string
          creator_id: string
          budget: number
          karma_reward: number
        }[]
      }
      update_user_rating: {
        Args: { user_id: string }
        Returns: undefined
      }
      update_user_streak: {
        Args: { user_id: string }
        Returns: undefined
      }
      validate_and_sanitize_input: {
        Args: { input: string } | { input_text: string; input_type?: string }
        Returns: string
      }
    }
    Enums: {
      mission_type: "good_deed" | "social_challenge" | "tutorial" | "referral"
      user_rank:
        | "starter"
        | "community"
        | "erfahren"
        | "vertrauensperson"
        | "vorbild"
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
      mission_type: ["good_deed", "social_challenge", "tutorial", "referral"],
      user_rank: [
        "starter",
        "community",
        "erfahren",
        "vertrauensperson",
        "vorbild",
      ],
    },
  },
} as const
