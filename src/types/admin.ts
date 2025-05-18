
export interface AdminProfile {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: 'super_admin' | 'admin' | 'support';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminActivity {
  id: string;
  admin_id: string;
  action_type: string;
  entity_type: string;
  entity_id: string | null;
  ip_address: string | null;
  action_details: Record<string, any> | null;
  created_at: string;
}

export interface SystemSetting {
  id: string;
  key: string;
  value: any;
  description?: string | null;
  created_at: string;
  updated_at: string;
  created_by?: string | null;
  updated_by?: string | null;
}
