
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Navigate } from 'react-router-dom';
import ProfileForm from '@/components/profile/ProfileForm';
import { useProfileUpdate } from '@/hooks/useProfileUpdate';

const ProfilePage = () => {
  const { user, loading: authLoading } = useAuth();
  const {
    fullName,
    setFullName,
    avatarUrl,
    isUploading,
    isSaving,
    handleAvatarChange,
    handleSubmit,
  } = useProfileUpdate();

  if (authLoading) {
    return <div className="flex justify-center items-center h-[80vh]">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Your Profile</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Update your profile information
          </CardDescription>
        </CardHeader>
        <ProfileForm
          user={user}
          fullName={fullName}
          setFullName={setFullName}
          avatarUrl={avatarUrl}
          isUploading={isUploading}
          isSaving={isSaving}
          onAvatarChange={handleAvatarChange}
          onSubmit={handleSubmit}
        />
      </Card>
    </div>
  );
};

export default ProfilePage;
