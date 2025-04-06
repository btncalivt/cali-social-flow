
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Instagram, 
  Facebook,
  Twitter,
  Youtube,
  Share2,
  PlusCircle,
  ChevronRight,
  BarChart3,
  Clock
} from 'lucide-react';

// Mock platform data
interface Platform {
  id: string;
  name: string;
  icon: JSX.Element;
  color: string;
  connected: boolean;
  stats: {
    followers: number;
    posts: string;
    engagement: string;
  };
  scheduled: number;
  published: number;
}

const AccountsView = () => {
  const [platforms] = useState<Platform[]>([
    {
      id: 'instagram',
      name: 'Instagram',
      icon: <Instagram />,
      color: 'bg-platform-instagram',
      connected: true,
      stats: {
        followers: 25600,
        posts: '124',
        engagement: '4.2%'
      },
      scheduled: 3,
      published: 56
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: <Facebook />,
      color: 'bg-platform-facebook',
      connected: true,
      stats: {
        followers: 18200,
        posts: '87',
        engagement: '1.8%'
      },
      scheduled: 2,
      published: 42
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: <Twitter />,
      color: 'bg-platform-twitter',
      connected: true,
      stats: {
        followers: 12400,
        posts: '210',
        engagement: '2.5%'
      },
      scheduled: 1,
      published: 95
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: <Youtube />,
      color: 'bg-platform-youtube',
      connected: false,
      stats: {
        followers: 8500,
        posts: '32',
        engagement: '6.7%'
      },
      scheduled: 0,
      published: 24
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      icon: <Share2 />, // Using a placeholder for TikTok
      color: 'bg-platform-tiktok',
      connected: false,
      stats: {
        followers: 15800,
        posts: '48',
        engagement: '8.3%'
      },
      scheduled: 0,
      published: 36
    }
  ]);
  
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };
  
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Social Accounts</h1>
        <Button size="sm">
          <PlusCircle className="h-4 w-4 mr-2" />
          Connect Account
        </Button>
      </div>
      
      {/* Platform Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {platforms.map((platform) => (
          <Card key={platform.id} className="overflow-hidden">
            <div className={`h-1 ${platform.color}`}></div>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full ${platform.color} flex items-center justify-center text-white mr-3`}>
                    {platform.icon}
                  </div>
                  <div>
                    <CardTitle>{platform.name}</CardTitle>
                    <div className="text-xs text-muted-foreground">
                      {platform.connected ? 'Connected' : 'Not Connected'}
                    </div>
                  </div>
                </div>
                <Badge variant={platform.connected ? "default" : "outline"}>
                  {platform.connected ? 'Active' : 'Connect'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm font-medium">{formatNumber(platform.stats.followers)}</p>
                  <p className="text-xs text-muted-foreground">Followers</p>
                </div>
                <div>
                  <p className="text-sm font-medium">{platform.stats.posts}</p>
                  <p className="text-xs text-muted-foreground">Posts</p>
                </div>
                <div>
                  <p className="text-sm font-medium">{platform.stats.engagement}</p>
                  <p className="text-xs text-muted-foreground">Engagement</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-4 border-t">
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {platform.scheduled} scheduled
                </span>
              </div>
              <Button variant="ghost" size="sm">
                View Details
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {/* Content Tabs */}
      <Tabs defaultValue="scheduled">
        <TabsList className="mb-4">
          <TabsTrigger value="scheduled">
            <Clock className="h-4 w-4 mr-2" />
            Scheduled
          </TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="scheduled">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Content</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                You have {platforms.reduce((acc, p) => acc + p.scheduled, 0)} posts scheduled across your platforms.
              </p>
              
              <div className="mt-4 space-y-4">
                {platforms.map(platform => (
                  platform.scheduled > 0 && (
                    <div key={platform.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full ${platform.color} flex items-center justify-center text-white mr-3`}>
                          {platform.icon}
                        </div>
                        <div>
                          <p className="font-medium">{platform.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {platform.scheduled} post{platform.scheduled !== 1 ? 's' : ''} scheduled
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                  )
                ))}
                
                {platforms.filter(p => p.scheduled > 0).length === 0 && (
                  <div className="p-8 text-center">
                    <p className="text-muted-foreground">No scheduled content yet.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="published">
          <Card>
            <CardHeader>
              <CardTitle>Published Content</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                You have published {platforms.reduce((acc, p) => acc + p.published, 0)} posts across your platforms.
              </p>
              {/* Published content would go here */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {platforms.slice(0, 2).map(platform => (
                  <div key={platform.id} className="border rounded-lg overflow-hidden">
                    <div className={`h-1 ${platform.color}`}></div>
                    <div className="p-3">
                      <div className="flex items-center mb-2">
                        <div className={`w-6 h-6 rounded-full ${platform.color} flex items-center justify-center text-white mr-2`}>
                          {platform.icon}
                        </div>
                        <p className="font-medium">{platform.name}</p>
                      </div>
                      <div className="aspect-video bg-muted rounded-md mb-2"></div>
                      <p className="text-sm">Recent post caption or title would appear here...</p>
                      <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                        <span>2 days ago</span>
                        <div className="flex items-center">
                          <span>123 likes</span>
                          <span className="mx-2">•</span>
                          <span>45 comments</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                View performance metrics across your social media platforms.
              </p>
              
              <div className="mt-4 h-[300px] flex items-center justify-center border rounded-lg">
                <p className="text-muted-foreground">Analytics charts will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccountsView;
