
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Upload } from 'lucide-react';

const ProfilePage = () => {
  const { user, profile, updateProfile, roles } = useAuth();
  const { toast } = useToast();
  
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const getUserInitials = () => {
    if (!fullName) return user?.email?.substring(0, 2).toUpperCase() || 'U';
    return fullName.split(' ').map(part => part[0]).join('').toUpperCase().substring(0, 2);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }
    const file = e.target.files[0];
    setAvatarFile(file);
    
    // Preview image
    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    try {
      setIsSaving(true);
      
      // Upload avatar if changed
      let finalAvatarUrl = profile?.avatar_url || null;
      
      if (avatarFile) {
        setIsUploading(true);
        
        // Create a unique file path for the avatar
        const fileExt = avatarFile.name.split('.').pop();
        const filePath = `avatars/${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from('avatars')
          .upload(filePath, avatarFile);
          
        if (error) throw error;
        
        // Get public URL
        const { data: publicURLData } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);
          
        finalAvatarUrl = publicURLData.publicUrl;
        setIsUploading(false);
      }
      
      // Update profile
      await updateProfile({
        full_name: fullName,
        avatar_url: finalAvatarUrl
      });
      
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!user || !profile) {
    return <div className="p-4">Loading profile...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-muted-foreground">Manage your account settings and profile</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="mr-2 h-5 w-5" /> Profile Information
          </CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={avatarUrl || undefined} />
                <AvatarFallback className="text-lg">{getUserInitials()}</AvatarFallback>
              </Avatar>
              
              <div className="space-y-2">
                <Label htmlFor="avatar" className="block">Profile Picture</Label>
                <div className="flex items-center space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="relative"
                    disabled={isUploading}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Change Avatar
                    <Input
                      id="avatar"
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={handleAvatarChange}
                      disabled={isUploading}
                    />
                  </Button>
                  {isUploading && <span className="text-sm text-muted-foreground">Uploading...</span>}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user.email} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">Your email cannot be changed</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
            
            <div className="space-y-2">
              <Label>User Role</Label>
              <div className="flex flex-wrap gap-2">
                {roles.length > 0 ? (
                  roles.map((role) => (
                    <div key={role} className="bg-muted px-3 py-1 rounded-md text-sm">
                      {role.replace('_', ' ')}
                    </div>
                  ))
                ) : (
                  <div className="bg-muted px-3 py-1 rounded-md text-sm">No Role Assigned</div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Contact an admin to change your role
              </p>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ProfilePage;
