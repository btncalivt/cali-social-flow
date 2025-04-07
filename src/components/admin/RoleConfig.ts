
import { AppRole } from '@/types/supabase';

export const roleColors: Record<AppRole, string> = {
  'admin': 'bg-red-100 text-red-800',
  'managing_editor': 'bg-blue-100 text-blue-800',
  'editor': 'bg-green-100 text-green-800',
  'designer': 'bg-purple-100 text-purple-800',
  'video_editor': 'bg-yellow-100 text-yellow-800',
  'caption_creator': 'bg-pink-100 text-pink-800',
  'seo_analyst': 'bg-indigo-100 text-indigo-800',
  'contributor': 'bg-orange-100 text-orange-800',
  'viewer': 'bg-gray-100 text-gray-800'
};

export const roleLabelMap: Record<AppRole, string> = {
  'admin': 'Admin',
  'managing_editor': 'Managing Editor',
  'editor': 'Editor',
  'designer': 'Designer',
  'video_editor': 'Video Editor',
  'caption_creator': 'Caption Creator',
  'seo_analyst': 'SEO Analyst',
  'contributor': 'Contributor',
  'viewer': 'Viewer'
};

export const roleOptions: AppRole[] = [
  'admin',
  'managing_editor',
  'editor',
  'designer',
  'video_editor',
  'caption_creator',
  'seo_analyst',
  'contributor',
  'viewer'
];
