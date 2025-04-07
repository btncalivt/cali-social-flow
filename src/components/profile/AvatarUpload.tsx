
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, User } from 'lucide-react';

interface AvatarUploadProps {
  fullName: string;
  avatarUrl: string;
  isUploading: boolean;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AvatarUpload = ({ 
  fullName, 
  avatarUrl, 
  isUploading, 
  onAvatarChange 
}: AvatarUploadProps) => {
  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar className="w-24 h-24">
        <AvatarImage src={avatarUrl} alt={fullName} />
        <AvatarFallback className="text-lg">
          {fullName ? getInitials(fullName) : <User className="h-10 w-10" />}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex flex-col items-center space-y-2">
        <Label
          htmlFor="avatar"
          className="cursor-pointer text-sm font-medium text-primary"
        >
          {isUploading ? (
            <span className="flex items-center">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </span>
          ) : (
            'Change Profile Picture'
          )}
        </Label>
        <Input
          id="avatar"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onAvatarChange}
          disabled={isUploading}
        />
        <span className="text-xs text-muted-foreground">
          PNG, JPG up to 2MB
        </span>
      </div>
    </div>
  );
};

export default AvatarUpload;
