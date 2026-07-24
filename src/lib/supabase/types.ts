export type UserRole = "producer" | "advisor";
export type AgriCategory = "GÜBRE" | "İLAÇ" | "DİĞER";
export type AppStatus = "planned" | "done" | "cancelled";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          role: UserRole;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      farms: {
        Row: {
          id: string;
          name: string;
          owner_id: string;
          location_label: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          owner_id: string;
          location_label?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["farms"]["Insert"]>;
      };
      farm_members: {
        Row: {
          id: string;
          farm_id: string;
          user_id: string;
          role: "owner" | "advisor" | "member";
          created_at: string;
        };
        Insert: {
          id?: string;
          farm_id: string;
          user_id: string;
          role?: "owner" | "advisor" | "member";
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["farm_members"]["Insert"]>;
      };
      parcels: {
        Row: {
          id: string;
          farm_id: string;
          name: string;
          crop: string | null;
          area_dekar: number | null;
          lat: number | null;
          lon: number | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          farm_id: string;
          name: string;
          crop?: string | null;
          area_dekar?: number | null;
          lat?: number | null;
          lon?: number | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["parcels"]["Insert"]>;
      };
      diseases: {
        Row: {
          id: string;
          plant: string;
          name: string;
          pathogen: string | null;
          symptoms: string[];
          cultural_measures: string[];
          chemical_measures: string[];
          severity_scale: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          plant: string;
          name: string;
          pathogen?: string | null;
          symptoms?: string[];
          cultural_measures?: string[];
          chemical_measures?: string[];
          severity_scale?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["diseases"]["Insert"]>;
      };
      analyses: {
        Row: {
          id: string;
          user_id: string;
          farm_id: string | null;
          parcel_id: string | null;
          disease_id: string | null;
          plant_name: string;
          diagnosis: string;
          confidence: number;
          severity: string | null;
          alternatives: unknown;
          treatment: string[];
          fertilizer: string[];
          spray_timing: string | null;
          weather_snapshot: unknown;
          image_path: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          farm_id?: string | null;
          parcel_id?: string | null;
          disease_id?: string | null;
          plant_name: string;
          diagnosis: string;
          confidence?: number;
          severity?: string | null;
          alternatives?: unknown;
          treatment?: string[];
          fertilizer?: string[];
          spray_timing?: string | null;
          weather_snapshot?: unknown;
          image_path?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["analyses"]["Insert"]>;
      };
      applications: {
        Row: {
          id: string;
          farm_id: string;
          parcel_id: string | null;
          user_id: string;
          item_id: string | null;
          item_name: string;
          active_ingredient: string | null;
          type: AgriCategory;
          quantity: number | null;
          unit: string | null;
          scheduled_at: string | null;
          applied_at: string | null;
          status: AppStatus;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          farm_id: string;
          parcel_id?: string | null;
          user_id: string;
          item_id?: string | null;
          item_name: string;
          active_ingredient?: string | null;
          type: AgriCategory;
          quantity?: number | null;
          unit?: string | null;
          scheduled_at?: string | null;
          applied_at?: string | null;
          status?: AppStatus;
          notes?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["applications"]["Insert"]>;
      };
      inventory_items: {
        Row: {
          id: string;
          farm_id: string;
          item_id: string | null;
          name: string;
          category: AgriCategory;
          quantity: number;
          unit: string;
          min_threshold: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          farm_id: string;
          item_id?: string | null;
          name: string;
          category: AgriCategory;
          quantity?: number;
          unit?: string;
          min_threshold?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["inventory_items"]["Insert"]>;
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          farm_id: string | null;
          type: string;
          title: string;
          body: string;
          read: boolean;
          meta: unknown;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          farm_id?: string | null;
          type: string;
          title: string;
          body: string;
          read?: boolean;
          meta?: unknown;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["notifications"]["Insert"]>;
      };
      push_subscriptions: {
        Row: {
          id: string;
          user_id: string;
          endpoint: string;
          p256dh: string;
          auth: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          endpoint: string;
          p256dh: string;
          auth: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["push_subscriptions"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      agri_category: AgriCategory;
      app_status: AppStatus;
    };
    CompositeTypes: Record<string, never>;
  };
};
