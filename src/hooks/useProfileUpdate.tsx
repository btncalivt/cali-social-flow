
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Profile } from '@/types/supabase';
import { useAvatarUpload } from './useAvatarUpload';

export function useProfileUpdate() {
  const { user, profile, updateProfile } = useAuth();
  const { toast } = useToast();
  const [fullName, setFullName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  const {
    avatarUrl,
    setAvatarUrl,
    isUploading,
    avatarFile,
    setAvatarFile,
    handleAvatarChange,
    uploadAvatar
  } = useAvatarUpload(user?.id);
  
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setAvatarUrl(profile.avatar_url || '');
    }
  }, [profile, setAvatarUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      let avatarPublicUrl = profile?.avatar_url || null;
      
      if (avatarFile) {
        avatarPublicUrl = await uploadAvatar();
        console.log('Avatar URL after upload:', avatarPublicUrl);
      }
      
      // Create a properly typed profile update object
      const updatedProfile: Profile = {
        id: user?.id || '',
        full_name: fullName,
        avatar_url: avatarPublicUrl,
        updated_at: new Date().toISOString(),
        // Use the existing created_at if available, or set a new one
        created_at: profile?.created_at || new Date().toISOString(),
      };
      
      console.log('Updating profile with:', updatedProfile);
      await updateProfile(updatedProfile);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      
      setAvatarFile(null);
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    user,
    profile,
    fullName,
    setFullName,
    avatarUrl,
    isUploading,
    isSaving,
    handleAvatarChange,
    handleSubmit,
  };
}
