
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CardContent, CardFooter } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import AvatarUpload from './AvatarUpload';

interface ProfileFormProps {
  user: any;
  fullName: string;
  setFullName: (name: string) => void;
  avatarUrl: string;
  isUploading: boolean;
  isSaving: boolean;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

const ProfileForm = ({
  user,
  fullName,
  setFullName,
  avatarUrl,
  isUploading,
  isSaving,
  onAvatarChange,
  onSubmit,
}: ProfileFormProps) => {
  return (
    <form onSubmit={onSubmit}>
      <CardContent className="space-y-6">
        <AvatarUpload
          fullName={fullName}
          avatarUrl={avatarUrl}
          isUploading={isUploading}
          onAvatarChange={onAvatarChange}
        />
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            value={user?.email || ''}
            disabled
            className="bg-muted"
          />
          <p className="text-xs text-muted-foreground">
            Email cannot be changed
          </p>
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
      </CardContent>
      <CardFooter>
        <Button type="submit" disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </CardFooter>
    </form>
  );
};

export default ProfileForm;
