// ─────────────────────────────────────────────────────────────────────────────
// Supabase Database Types for SARAL
// Auto-generate with `npx supabase gen types typescript` once connected —
// this hand-written version covers the initial schema.
// ─────────────────────────────────────────────────────────────────────────────

export type Plan = "free" | "pro" | "ultra";
export type Theme = "light" | "dark" | "system";
export type BillingCycle = "monthly" | "yearly";
export type SubscriptionStatus =
  | "active"
  | "cancelled"
  | "past_due"
  | "trialing";

// ── Row types (what you read from the DB) ───────────────────────────────────

export interface Profile {
  id: string; // uuid — FK to auth.users
  full_name: string;
  avatar_url: string | null;
  plan: Plan;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  user_id: string;
  title: string;
  content: string;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

export interface DownloadedDocument {
  id: string;
  user_id: string;
  document_id: string | null;
  title: string;
  file_url: string | null;
  file_type: string; // png, pdf, html, etc.
  file_size_bytes: number | null;
  downloaded_at: string;
}

export interface DownloadedAudio {
  id: string;
  user_id: string;
  document_id: string | null;
  title: string;
  file_url: string | null;
  duration_seconds: number | null;
  language: string; // en, ne
  downloaded_at: string;
}

export interface ScannedImage {
  id: string;
  user_id: string;
  document_id: string | null;
  original_filename: string | null;
  image_url: string | null;
  extracted_text: string | null;
  scanned_at: string;
}

export interface UserSession {
  id: string;
  user_id: string;
  started_at: string;
  ended_at: string | null;
  duration_seconds: number | null;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: Plan;
  billing_cycle: BillingCycle;
  amount: number;
  currency: string;
  payment_method: string | null;
  next_billing_date: string | null;
  status: SubscriptionStatus;
  created_at: string;
  updated_at: string;
}

export interface UserSettings {
  id: string;
  user_id: string;

  // Appearance
  theme: Theme;
  language: string;

  // Notifications
  notifications_enabled: boolean;
  email_notifications: boolean;

  // Typography (feature page defaults)
  font_size: number; // px
  font_family: string;
  line_height: number;
  letter_spacing: number; // px
  word_spacing: number; // px

  // TTS
  tts_speed: number; // 0.5 – 2.0
  tts_voice: string | null;

  // Feature toggles
  auto_highlight: boolean;
  color_coding_enabled: boolean;
  heatmap_enabled: boolean;
  syllable_splitting_enabled: boolean;

  // Additional studio settings
  background_color: string;
  background_texture: string;
  text_align: string;
  syllable_split_threshold: number;

  created_at: string;
  updated_at: string;
}

// ── Supabase Database type (for typed createClient<Database>) ───────────────

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: {
          id: string;
          full_name?: string;
          avatar_url?: string | null;
          plan?: Plan;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          avatar_url?: string | null;
          plan?: Plan;
          updated_at?: string;
        };
      };
      documents: {
        Row: Document;
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          content: string;
          is_favorite?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          title?: string;
          content?: string;
          is_favorite?: boolean;
          updated_at?: string;
        };
      };
      downloaded_documents: {
        Row: DownloadedDocument;
        Insert: {
          id?: string;
          user_id: string;
          document_id?: string | null;
          title: string;
          file_url?: string | null;
          file_type?: string;
          file_size_bytes?: number | null;
          downloaded_at?: string;
        };
        Update: {
          document_id?: string | null;
          title?: string;
          file_url?: string | null;
          file_type?: string;
          file_size_bytes?: number | null;
          downloaded_at?: string;
        };
      };
      downloaded_audio: {
        Row: DownloadedAudio;
        Insert: {
          id?: string;
          user_id: string;
          document_id?: string | null;
          title: string;
          file_url?: string | null;
          duration_seconds?: number | null;
          language?: string;
          downloaded_at?: string;
        };
        Update: {
          document_id?: string | null;
          title?: string;
          file_url?: string | null;
          duration_seconds?: number | null;
          language?: string;
          downloaded_at?: string;
        };
      };
      scanned_images: {
        Row: ScannedImage;
        Insert: {
          id?: string;
          user_id: string;
          document_id?: string | null;
          original_filename?: string | null;
          image_url?: string | null;
          extracted_text?: string | null;
          scanned_at?: string;
        };
        Update: {
          document_id?: string | null;
          original_filename?: string | null;
          image_url?: string | null;
          extracted_text?: string | null;
          scanned_at?: string;
        };
      };
      user_sessions: {
        Row: UserSession;
        Insert: {
          id?: string;
          user_id: string;
          started_at?: string;
          ended_at?: string | null;
        };
        Update: {
          started_at?: string;
          ended_at?: string | null;
        };
      };
      subscriptions: {
        Row: Subscription;
        Insert: {
          id?: string;
          user_id: string;
          plan?: Plan;
          billing_cycle?: BillingCycle;
          amount?: number;
          currency?: string;
          payment_method?: string | null;
          next_billing_date?: string | null;
          status?: SubscriptionStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          plan?: Plan;
          billing_cycle?: BillingCycle;
          amount?: number;
          currency?: string;
          payment_method?: string | null;
          next_billing_date?: string | null;
          status?: SubscriptionStatus;
          updated_at?: string;
        };
      };
      user_settings: {
        Row: UserSettings;
        Insert: {
          id?: string;
          user_id: string;
          theme?: Theme;
          language?: string;
          notifications_enabled?: boolean;
          email_notifications?: boolean;
          font_size?: number;
          font_family?: string;
          line_height?: number;
          letter_spacing?: number;
          word_spacing?: number;
          tts_speed?: number;
          tts_voice?: string | null;
          auto_highlight?: boolean;
          color_coding_enabled?: boolean;
          heatmap_enabled?: boolean;
          syllable_splitting_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          theme?: Theme;
          language?: string;
          notifications_enabled?: boolean;
          email_notifications?: boolean;
          font_size?: number;
          font_family?: string;
          line_height?: number;
          letter_spacing?: number;
          word_spacing?: number;
          tts_speed?: number;
          tts_voice?: string | null;
          auto_highlight?: boolean;
          color_coding_enabled?: boolean;
          heatmap_enabled?: boolean;
          syllable_splitting_enabled?: boolean;
          updated_at?: string;
        };
      };
    };
    Views: {
      user_stats: {
        Row: {
          user_id: string;
          full_name: string;
          plan: Plan;
          total_documents: number;
          favorite_documents: number;
          total_downloads: number;
          total_audio_exports: number;
          total_images_scanned: number;
          total_time_seconds: number;
        };
      };
    };
    Functions: Record<string, never>;
    Enums: {
      plan_type: Plan;
      theme_type: Theme;
      billing_cycle_type: BillingCycle;
      subscription_status_type: SubscriptionStatus;
    };
  };
}
