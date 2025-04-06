
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Upload } from 'lucide-react';

const contentTypes = [
  { id: 'text', name: 'Text Post' },
  { id: 'image', name: 'Post with Image' },
  { id: 'video', name: 'Post with Video' },
  { id: 'reels', name: 'Reels/Shorts' },
  { id: 'stories', name: 'Stories' }
];

const platforms = [
  { id: 'instagram', name: 'Instagram' },
  { id: 'facebook', name: 'Facebook' },
  { id: 'twitter', name: 'Twitter' },
  { id: 'tiktok', name: 'TikTok' },
  { id: 'youtube', name: 'YouTube' },
  { id: 'pinterest', name: 'Pinterest' },
  { id: 'threads', name: 'Threads' }
];

type User = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
};

const NewIdeaForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [content, setContent] = useState('');
  const [contentType, setContentType] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [assignedTo, setAssignedTo] = useState('');
  const [inspirationFile, setInspirationFile] = useState<File | null>(null);
  const [inspirationPreview, setInspirationPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Fetch users for assignment dropdown
  useState(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url');
        
        if (error) throw error;
        
        setUsers(data || []);
      } catch (err) {
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  });
  
  const handlePlatformChange = (platformId: string) => {
    setSelectedPlatforms(current => 
      current.includes(platformId) 
        ? current.filter(id => id !== platformId) 
        : [...current, platformId]
    );
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Simple file type validation
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const validVideoTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
    
    if (![...validImageTypes, ...validVideoTypes].includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image (JPEG, PNG, GIF) or video file (MP4)",
        variant: "destructive",
      });
      return;
    }
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setInspirationPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    setInspirationFile(file);
  };
  
  const uploadInspiration = async (): Promise<string | null> => {
    if (!inspirationFile || !user) return null;
    
    try {
      // Check if inspirations bucket exists, create if not
      const { data: buckets } = await supabase.storage.listBuckets();
      const bucketExists = buckets?.some(bucket => bucket.name === 'inspirations');
      
      if (!bucketExists) {
        await supabase.storage.createBucket('inspirations', {
          public: true,
        });
      }
      
      // Upload file
      const fileExt = inspirationFile.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('inspirations')
        .upload(fileName, inspirationFile);
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data } = supabase.storage.from('inspirations').getPublicUrl(fileName);
      
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading inspiration:', error);
      return null;
    }
  };
  
  const addToBoard = async () => {
    if (!content || !contentType || selectedPlatforms.length === 0) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields and select at least one platform",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      let inspirationUrl = null;
      
      if (inspirationFile) {
        inspirationUrl = await uploadInspiration();
      }
      
      // In a real application, this would typically save to a database
      // For now we'll just show a success message
      toast({
        title: "Idea added to board!",
        description: "Your content idea has been added successfully.",
      });
      
      // Reset form
      setContent('');
      setContentType('');
      setSelectedPlatforms([]);
      setAssignedTo('');
      setInspirationFile(null);
      setInspirationPreview(null);
      
    } catch (error: any) {
      toast({
        title: "Error adding idea",
        description: error.message || "Failed to add your idea to the board",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>New Content Idea</CardTitle>
        <CardDescription>Share your content ideas with the team</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="content">Share your thoughts!</Label>
          <Textarea 
            id="content" 
            placeholder="What's your content idea?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px]" 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="contentType">What type of content?</Label>
          <Select 
            value={contentType} 
            onValueChange={(value) => setContentType(value)}
          >
            <SelectTrigger id="contentType">
              <SelectValue placeholder="Select content type" />
            </SelectTrigger>
            <SelectContent>
              {contentTypes.map(type => (
                <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="inspiration">Got an inspo?</Label>
          <div className="flex flex-col gap-3">
            <Button
              variant="outline"
              size="sm"
              className="w-full flex gap-2 h-auto py-2"
              onClick={() => document.getElementById('inspirationFile')?.click()}
            >
              <Upload className="h-4 w-4" />
              {inspirationFile ? 'Change File' : 'Upload File (JPG, PNG, MP4)'}
            </Button>
            <Input 
              id="inspirationFile" 
              type="file" 
              className="hidden" 
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png,.gif,.mp4,.mov,.avi,.webp"
            />
            
            {inspirationPreview && (
              <div className="mt-2 border rounded-md overflow-hidden">
                {inspirationFile?.type.startsWith('image/') ? (
                  <img 
                    src={inspirationPreview}
                    alt="Inspiration preview"
                    className="max-h-[200px] w-auto mx-auto"
                  />
                ) : inspirationFile?.type.startsWith('video/') ? (
                  <video 
                    src={inspirationPreview}
                    controls
                    className="max-h-[200px] w-auto mx-auto"
                  />
                ) : null}
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-3">
          <Label>Where to post?</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {platforms.map(platform => (
              <div key={platform.id} className="flex items-center space-x-2">
                <Checkbox 
                  id={`platform-${platform.id}`}
                  checked={selectedPlatforms.includes(platform.id)}
                  onCheckedChange={() => handlePlatformChange(platform.id)}
                />
                <label
                  htmlFor={`platform-${platform.id}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {platform.name}
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="assignee">Assign to</Label>
          <Select 
            value={assignedTo} 
            onValueChange={(value) => setAssignedTo(value)}
          >
            <SelectTrigger id="assignee">
              <SelectValue placeholder="Select a team member" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unassigned">Unassigned</SelectItem>
              {users.map(user => (
                <SelectItem key={user.id} value={user.id}>
                  {user.full_name || 'Unnamed User'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={addToBoard} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : (
            'Add to Board'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NewIdeaForm;
