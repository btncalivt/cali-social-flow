
import { Database } from "@/integrations/supabase/types";
import { PostgrestError } from "@supabase/supabase-js";

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];

export type SocialAccount = {
  id: string;
  platform: string;
  username: string;
  url: string;
  created_at: string;
  updated_at: string;
}

export type Task = {
  id: string;
  title: string;
  status: 'To Do' | 'In Progress' | 'In Review' | 'Done';
  due_date?: string;
  platform: string;
  assignee_id?: string;
  priority: 'Low' | 'Medium' | 'High';
  completed: boolean;
  created_at: string;
  updated_at: string;
  created_by?: string;
  assignee?: {
    id: string;
    full_name?: string;
    email?: string;
  };
}

export type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type UserRole = {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
  updated_at: string;
};

export type AppRole = 
  | 'admin'
  | 'managing_editor'
  | 'editor'
  | 'designer'
  | 'video_editor'
  | 'caption_creator'
  | 'seo_analyst'
  | 'contributor'
  | 'viewer';
