
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock } from 'lucide-react';

const UpcomingPosts = () => {
  // Mock scheduled post data
  const upcomingPosts = [
    {
      id: 1,
      title: 'New Album Announcement',
      platform: 'instagram',
      scheduledDate: '2025-04-07',
      scheduledTime: '12:00',
      type: 'Image'
    },
    {
      id: 2,
      title: 'Fan Meet & Greet Reminder',
      platform: 'facebook',
      scheduledDate: '2025-04-08',
      scheduledTime: '14:30',
      type: 'Image + Text'
    },
    {
      id: 3,
      title: 'Behind the Scenes Video',
      platform: 'youtube',
      scheduledDate: '2025-04-09',
      scheduledTime: '16:00',
      type: 'Video'
    }
  ];

  const getPlatformBadge = (platform: string) => {
    const platformColors: { [key: string]: string } = {
      instagram: 'bg-platform-instagram',
      facebook: 'bg-platform-facebook',
      twitter: 'bg-platform-twitter',
      youtube: 'bg-platform-youtube',
      tiktok: 'bg-platform-tiktok',
    };

    return (
      <div className={`platform-badge ${platformColors[platform] || 'bg-gray-500'}`}>
        {platform.charAt(0).toUpperCase()}
      </div>
    );
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Upcoming Posts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingPosts.map((post) => (
            <div key={post.id} className="task-card animate-slide-in">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-sm">{post.title}</h3>
                {getPlatformBadge(post.platform)}
              </div>
              
              <div className="flex justify-between items-center mt-3">
                <div className="flex items-center text-xs text-muted-foreground">
                  <Badge variant="outline" className="mr-2">
                    {post.type}
                  </Badge>
                </div>
                
                <div className="flex items-center text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>{formatDate(post.scheduledDate)}</span>
                  <Clock className="h-3 w-3 mx-1" />
                  <span>{post.scheduledTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingPosts;
