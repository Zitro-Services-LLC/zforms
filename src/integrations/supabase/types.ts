export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_activities: {
        Row: {
          action_details: Json | null
          action_type: string
          admin_id: string
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
        }
        Insert: {
          action_details?: Json | null
          action_type: string
          admin_id: string
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
        }
        Update: {
          action_details?: Json | null
          action_type?: string
          admin_id?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_activities_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "admins"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_profiles: {
        Row: {
          created_at: string
          email: string
          first_name: string | null
          id: string
          is_active: boolean
          last_name: string | null
          role: Database["public"]["Enums"]["admin_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name?: string | null
          id: string
          is_active?: boolean
          last_name?: string | null
          role?: Database["public"]["Enums"]["admin_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          is_active?: boolean
          last_name?: string | null
          role?: Database["public"]["Enums"]["admin_role"]
          updated_at?: string
        }
        Relationships: []
      }
      admin_sessions: {
        Row: {
          admin_id: string
          id: string
          impersonated_user_id: string | null
          impersonated_user_type: string | null
          ip_address: string | null
          is_impersonating: boolean | null
          session_ended_at: string | null
          session_started_at: string
          user_agent: string | null
        }
        Insert: {
          admin_id: string
          id?: string
          impersonated_user_id?: string | null
          impersonated_user_type?: string | null
          ip_address?: string | null
          is_impersonating?: boolean | null
          session_ended_at?: string | null
          session_started_at?: string
          user_agent?: string | null
        }
        Update: {
          admin_id?: string
          id?: string
          impersonated_user_id?: string | null
          impersonated_user_type?: string | null
          ip_address?: string | null
          is_impersonating?: boolean | null
          session_ended_at?: string | null
          session_started_at?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_sessions_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "admins"
            referencedColumns: ["id"]
          },
        ]
      }
      admins: {
        Row: {
          created_at: string
          email: string
          first_name: string | null
          id: string
          is_super_admin: boolean
          last_login_at: string | null
          last_name: string | null
          permissions: Json | null
          role: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          first_name?: string | null
          id: string
          is_super_admin?: boolean
          last_login_at?: string | null
          last_name?: string | null
          permissions?: Json | null
          role?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          is_super_admin?: boolean
          last_login_at?: string | null
          last_name?: string | null
          permissions?: Json | null
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      contract_revisions: {
        Row: {
          comments: string | null
          contract_id: string
          created_at: string
          id: string
          revision_type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          comments?: string | null
          contract_id: string
          created_at?: string
          id?: string
          revision_type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          comments?: string | null
          contract_id?: string
          created_at?: string
          id?: string
          revision_type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contract_revisions_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
        ]
      }
      contractor_licenses: {
        Row: {
          agency: string
          contractor_id: string
          created_at: string | null
          expiry_date: string
          id: string
          issue_date: string
          license_no: string
          notification_sent_at: string | null
          notification_status: string | null
          updated_at: string | null
        }
        Insert: {
          agency: string
          contractor_id: string
          created_at?: string | null
          expiry_date: string
          id?: string
          issue_date: string
          license_no: string
          notification_sent_at?: string | null
          notification_status?: string | null
          updated_at?: string | null
        }
        Update: {
          agency?: string
          contractor_id?: string
          created_at?: string | null
          expiry_date?: string
          id?: string
          issue_date?: string
          license_no?: string
          notification_sent_at?: string | null
          notification_status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contractor_licenses_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
        ]
      }
      contractor_management: {
        Row: {
          contractor_id: string
          created_at: string
          id: string
          notes: string | null
          onboarding_completed: boolean
          status: string
          subscription_end_date: string | null
          subscription_start_date: string | null
          subscription_tier: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          contractor_id: string
          created_at?: string
          id?: string
          notes?: string | null
          onboarding_completed?: boolean
          status?: string
          subscription_end_date?: string | null
          subscription_start_date?: string | null
          subscription_tier?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          contractor_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          onboarding_completed?: boolean
          status?: string
          subscription_end_date?: string | null
          subscription_start_date?: string | null
          subscription_tier?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contractor_management_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: true
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contractor_management_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "admins"
            referencedColumns: ["id"]
          },
        ]
      }
      contractors: {
        Row: {
          company_address: string | null
          company_email: string | null
          company_name: string
          company_phone: string | null
          contact_email: string | null
          contact_first_name: string | null
          contact_last_name: string | null
          contact_phone: string | null
          created_at: string | null
          id: string
          insurance_info: Json | null
          logo_url: string | null
          owner_first_name: string | null
          owner_last_name: string | null
          payment_methods: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          company_address?: string | null
          company_email?: string | null
          company_name: string
          company_phone?: string | null
          contact_email?: string | null
          contact_first_name?: string | null
          contact_last_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          insurance_info?: Json | null
          logo_url?: string | null
          owner_first_name?: string | null
          owner_last_name?: string | null
          payment_methods?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          company_address?: string | null
          company_email?: string | null
          company_name?: string
          company_phone?: string | null
          contact_email?: string | null
          contact_first_name?: string | null
          contact_last_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          id?: string
          insurance_info?: Json | null
          logo_url?: string | null
          owner_first_name?: string | null
          owner_last_name?: string | null
          payment_methods?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      contracts: {
        Row: {
          contract_number: number
          contractor_signature_date: string | null
          created_at: string
          customer_id: string
          customer_signature_date: string | null
          display_id: string
          end_date: string | null
          estimate_id: string | null
          id: string
          scope_of_work: string | null
          signed_by_contractor: boolean
          signed_by_customer: boolean
          start_date: string | null
          status: string
          terms_and_conditions: string | null
          title: string
          total_amount: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          contract_number: number
          contractor_signature_date?: string | null
          created_at?: string
          customer_id: string
          customer_signature_date?: string | null
          display_id: string
          end_date?: string | null
          estimate_id?: string | null
          id?: string
          scope_of_work?: string | null
          signed_by_contractor?: boolean
          signed_by_customer?: boolean
          start_date?: string | null
          status?: string
          terms_and_conditions?: string | null
          title: string
          total_amount?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          contract_number?: number
          contractor_signature_date?: string | null
          created_at?: string
          customer_id?: string
          customer_signature_date?: string | null
          display_id?: string
          end_date?: string | null
          estimate_id?: string | null
          id?: string
          scope_of_work?: string | null
          signed_by_contractor?: boolean
          signed_by_customer?: boolean
          start_date?: string | null
          status?: string
          terms_and_conditions?: string | null
          title?: string
          total_amount?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contracts_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contracts_estimate_id_fkey"
            columns: ["estimate_id"]
            isOneToOne: false
            referencedRelation: "estimates"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          billing_address: string | null
          created_at: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          phone: string | null
          profile_image_url: string | null
          property_address: string | null
          same_as_billing: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          billing_address?: string | null
          created_at?: string | null
          email: string
          first_name: string
          id?: string
          last_name: string
          phone?: string | null
          profile_image_url?: string | null
          property_address?: string | null
          same_as_billing?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          billing_address?: string | null
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          phone?: string | null
          profile_image_url?: string | null
          property_address?: string | null
          same_as_billing?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      document_downloads: {
        Row: {
          created_at: string
          document_id: string
          document_type: string
          file_path: string
          file_size: number | null
          id: string
          user_id: string
          version: string | null
        }
        Insert: {
          created_at?: string
          document_id: string
          document_type: string
          file_path: string
          file_size?: number | null
          id?: string
          user_id: string
          version?: string | null
        }
        Update: {
          created_at?: string
          document_id?: string
          document_type?: string
          file_path?: string
          file_size?: number | null
          id?: string
          user_id?: string
          version?: string | null
        }
        Relationships: []
      }
      estimate_activities: {
        Row: {
          action_details: Json | null
          action_type: string
          created_at: string
          estimate_id: string
          id: string
          ip_address: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          action_details?: Json | null
          action_type: string
          created_at?: string
          estimate_id: string
          id?: string
          ip_address?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          action_details?: Json | null
          action_type?: string
          created_at?: string
          estimate_id?: string
          id?: string
          ip_address?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "estimate_activities_estimate_id_fkey"
            columns: ["estimate_id"]
            isOneToOne: false
            referencedRelation: "estimates"
            referencedColumns: ["id"]
          },
        ]
      }
      estimate_images: {
        Row: {
          caption: string | null
          content_type: string | null
          created_at: string
          estimate_id: string
          file_name: string
          id: string
          size: number | null
          storage_path: string
          updated_at: string
        }
        Insert: {
          caption?: string | null
          content_type?: string | null
          created_at?: string
          estimate_id: string
          file_name: string
          id?: string
          size?: number | null
          storage_path: string
          updated_at?: string
        }
        Update: {
          caption?: string | null
          content_type?: string | null
          created_at?: string
          estimate_id?: string
          file_name?: string
          id?: string
          size?: number | null
          storage_path?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "estimate_images_estimate_id_fkey"
            columns: ["estimate_id"]
            isOneToOne: false
            referencedRelation: "estimates"
            referencedColumns: ["id"]
          },
        ]
      }
      estimate_items: {
        Row: {
          amount: number
          created_at: string
          description: string
          estimate_id: string
          id: string
          quantity: number
          rate: number
          updated_at: string
        }
        Insert: {
          amount?: number
          created_at?: string
          description: string
          estimate_id: string
          id?: string
          quantity?: number
          rate?: number
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string
          estimate_id?: string
          id?: string
          quantity?: number
          rate?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "estimate_items_estimate_id_fkey"
            columns: ["estimate_id"]
            isOneToOne: false
            referencedRelation: "estimates"
            referencedColumns: ["id"]
          },
        ]
      }
      estimates: {
        Row: {
          created_at: string
          customer_id: string
          date: string
          expiry_date: string | null
          id: string
          job_description: string | null
          job_number: string | null
          last_modified_by: string | null
          last_viewed_at: string | null
          last_viewed_by: string | null
          notes: string | null
          status: string
          subtotal: number
          tax_amount: number | null
          tax_rate: number | null
          title: string
          total: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          date?: string
          expiry_date?: string | null
          id?: string
          job_description?: string | null
          job_number?: string | null
          last_modified_by?: string | null
          last_viewed_at?: string | null
          last_viewed_by?: string | null
          notes?: string | null
          status?: string
          subtotal?: number
          tax_amount?: number | null
          tax_rate?: number | null
          title: string
          total?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          date?: string
          expiry_date?: string | null
          id?: string
          job_description?: string | null
          job_number?: string | null
          last_modified_by?: string | null
          last_viewed_at?: string | null
          last_viewed_by?: string | null
          notes?: string | null
          status?: string
          subtotal?: number
          tax_amount?: number | null
          tax_rate?: number | null
          title?: string
          total?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "estimates_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_items: {
        Row: {
          amount: number
          created_at: string
          description: string
          id: string
          invoice_id: string
          quantity: number
          rate: number
          updated_at: string
        }
        Insert: {
          amount?: number
          created_at?: string
          description: string
          id?: string
          invoice_id: string
          quantity?: number
          rate?: number
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string
          id?: string
          invoice_id?: string
          quantity?: number
          rate?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          invoice_id: string
          notes: string | null
          payment_date: string
          payment_method: string | null
          transaction_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          invoice_id: string
          notes?: string | null
          payment_date?: string
          payment_method?: string | null
          transaction_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          invoice_id?: string
          notes?: string | null
          payment_date?: string
          payment_method?: string | null
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount_paid: number | null
          balance_due: number | null
          contract_id: string | null
          created_at: string
          customer_id: string
          due_date: string
          id: string
          invoice_number: string
          issue_date: string
          notes: string | null
          status: string
          subtotal: number
          tax_amount: number | null
          tax_rate: number | null
          total: number
          updated_at: string
          user_id: string
        }
        Insert: {
          amount_paid?: number | null
          balance_due?: number | null
          contract_id?: string | null
          created_at?: string
          customer_id: string
          due_date: string
          id?: string
          invoice_number: string
          issue_date?: string
          notes?: string | null
          status?: string
          subtotal?: number
          tax_amount?: number | null
          tax_rate?: number | null
          total?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          amount_paid?: number | null
          balance_due?: number | null
          contract_id?: string | null
          created_at?: string
          customer_id?: string
          due_date?: string
          id?: string
          invoice_number?: string
          issue_date?: string
          notes?: string | null
          status?: string
          subtotal?: number
          tax_amount?: number | null
          tax_rate?: number | null
          total?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_contract_id_fkey"
            columns: ["contract_id"]
            isOneToOne: false
            referencedRelation: "contracts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          contractor_id: string
          created_at: string | null
          email_enabled: boolean
          in_app_enabled: boolean
          sms_enabled: boolean
          timezone: string
          updated_at: string | null
        }
        Insert: {
          contractor_id: string
          created_at?: string | null
          email_enabled?: boolean
          in_app_enabled?: boolean
          sms_enabled?: boolean
          timezone?: string
          updated_at?: string | null
        }
        Update: {
          contractor_id?: string
          created_at?: string | null
          email_enabled?: boolean
          in_app_enabled?: boolean
          sms_enabled?: boolean
          timezone?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_preferences_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: true
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          contractor_id: string
          created_at: string | null
          id: string
          is_read: boolean
          level: string
          license_id: string | null
          payload: Json | null
          sent_at: string | null
          type: string
          updated_at: string | null
        }
        Insert: {
          contractor_id: string
          created_at?: string | null
          id?: string
          is_read?: boolean
          level: string
          license_id?: string | null
          payload?: Json | null
          sent_at?: string | null
          type: string
          updated_at?: string | null
        }
        Update: {
          contractor_id?: string
          created_at?: string | null
          id?: string
          is_read?: boolean
          level?: string
          license_id?: string | null
          payload?: Json | null
          sent_at?: string | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_contractor_id_fkey"
            columns: ["contractor_id"]
            isOneToOne: false
            referencedRelation: "contractors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_license_id_fkey"
            columns: ["license_id"]
            isOneToOne: false
            referencedRelation: "contractor_licenses"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          company_name: string | null
          created_at: string
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          updated_at: string
          user_type: string
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          email: string
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string
          user_type: string
        }
        Update: {
          company_name?: string | null
          created_at?: string
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string
          user_type?: string
        }
        Relationships: []
      }
      system_settings: {
        Row: {
          created_at: string
          created_by: string | null
          deleted_at: string | null
          description: string | null
          id: string
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          key: string
          updated_at?: string
          updated_by?: string | null
          value: Json
        }
        Update: {
          created_at?: string
          created_by?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: [
          {
            foreignKeyName: "system_settings_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "admins"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "system_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "admins"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      admin_role: "super_admin" | "admin" | "support"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      admin_role: ["super_admin", "admin", "support"],
    },
  },
} as const
