
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight,
  AlertCircle
} from 'lucide-react';

interface CalendarPost {
  id: string;
  title: string;
  platform: string;
  date: string; // ISO format: YYYY-MM-DD
  time?: string;
}

const ContentCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  
  // Mock scheduled posts data
  const scheduledPosts: CalendarPost[] = [
    { 
      id: '1', 
      title: 'Album Teaser', 
      platform: 'instagram', 
      date: '2025-04-08', 
      time: '12:00' 
    },
    { 
      id: '2', 
      title: 'Fan Art Contest', 
      platform: 'facebook', 
      date: '2025-04-10', 
      time: '15:00' 
    },
    { 
      id: '3', 
      title: 'Tour Announcement', 
      platform: 'twitter', 
      date: '2025-04-12', 
      time: '10:00' 
    },
    { 
      id: '4', 
      title: 'Dance Tutorial', 
      platform: 'tiktok', 
      date: '2025-04-15', 
      time: '18:00' 
    },
    { 
      id: '5', 
      title: 'Interview Clip', 
      platform: 'youtube', 
      date: '2025-04-20', 
      time: '14:00' 
    },
    { 
      id: '6', 
      title: 'Album Release', 
      platform: 'instagram', 
      date: '2025-04-20', 
      time: '09:00' 
    },
    { 
      id: '7', 
      title: 'Tour Dates', 
      platform: 'twitter', 
      date: '2025-04-20', 
      time: '16:00' 
    }
  ];
  
  // Calendar navigation
  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDate(null);
  };
  
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDate(null);
  };
  
  // Get days in month
  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    const firstDay = new Date(year, month, 1).getDay();
    
    // Add empty cells for days before the 1st of the month
    for (let i = 0; i < firstDay; i++) {
      days.push({ day: '', date: '', isCurrentMonth: false });
    }
    
    // Add days of the current month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({ day: i, date, isCurrentMonth: true });
    }
    
    return days;
  };
  
  // Get posts for a specific date
  const getPostsForDate = (date: string) => {
    return scheduledPosts.filter(post => post.date === date);
  };
  
  // Platform badge
  const getPlatformBadge = (platform: string) => {
    const colors: Record<string, string> = {
      instagram: 'bg-platform-instagram',
      facebook: 'bg-platform-facebook',
      twitter: 'bg-platform-twitter',
      tiktok: 'bg-platform-tiktok',
      youtube: 'bg-platform-youtube',
    };
    
    return (
      <div className={`platform-badge ${colors[platform] || 'bg-gray-500'}`}>
        {platform.charAt(0).toUpperCase()}
      </div>
    );
  };
  
  // Month and year header
  const monthYearHeader = currentDate.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });
  
  // Days of week
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Content Calendar</h1>
      </div>
      
      {/* Calendar Navigation */}
      <div className="flex justify-between items-center mb-4">
        <Button variant="outline" size="icon" onClick={previousMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-medium">{monthYearHeader}</h2>
        <Button variant="outline" size="icon" onClick={nextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Calendar Grid */}
      <Card className="overflow-hidden">
        {/* Days of week header */}
        <div className="grid grid-cols-7 bg-muted/30">
          {daysOfWeek.map(day => (
            <div 
              key={day}
              className="p-2 text-center text-xs font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar days */}
        <div className="grid grid-cols-7 border-t">
          {getDaysInMonth().map((day, index) => {
            if (!day.isCurrentMonth) {
              return <div key={`empty-${index}`} className="border-r border-b min-h-[100px]"></div>;
            }
            
            const posts = getPostsForDate(day.date);
            const today = new Date().toISOString().split('T')[0] === day.date;
            const isSelected = selectedDate === day.date;
            
            return (
              <div
                key={day.date}
                className={`border-r border-b p-1 min-h-[100px] ${
                  today ? 'bg-muted/20' : ''
                } ${
                  isSelected ? 'ring-2 ring-primary ring-inset' : ''
                }`}
                onClick={() => setSelectedDate(day.date)}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className={`text-xs font-medium ${today ? 'text-primary' : ''}`}>
                    {day.day}
                  </span>
                  {posts.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {posts.length}
                    </Badge>
                  )}
                </div>
                
                {/* Only show up to 3 posts per day cell */}
                <div className="space-y-1">
                  {posts.slice(0, 3).map(post => (
                    <div key={post.id} className="flex items-center space-x-1 bg-white shadow-sm rounded p-1">
                      {getPlatformBadge(post.platform)}
                      <span className="text-xs truncate">{post.title}</span>
                    </div>
                  ))}
                  {posts.length > 3 && (
                    <div className="flex items-center justify-center text-xs text-muted-foreground">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      <span>+{posts.length - 3} more</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>
      
      {/* Selected Day Details */}
      {selectedDate && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">
            Posts for {new Date(selectedDate).toLocaleDateString('en-US', { 
              month: 'long', 
              day: 'numeric',
              year: 'numeric'
            })}
          </h3>
          
          <div className="space-y-3">
            {getPostsForDate(selectedDate).length > 0 ? (
              getPostsForDate(selectedDate).map(post => (
                <div key={post.id} className="task-card">
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium">{post.title}</h3>
                    {getPlatformBadge(post.platform)}
                  </div>
                  {post.time && (
                    <div className="text-sm text-muted-foreground mt-2">
                      Scheduled for: {post.time}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-muted-foreground">No posts scheduled for this day.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentCalendar;
