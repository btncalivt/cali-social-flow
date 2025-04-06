
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const TaskSummary = () => {
  // Mock task data
  const tasks = [
    { 
      id: 1, 
      title: 'Create TikTok dance video', 
      status: 'In Progress', 
      dueDate: '2025-04-07',
      platform: 'tiktok',
      assignee: 'Video Editor'
    },
    { 
      id: 2, 
      title: 'Design Instagram carousel post', 
      status: 'To Do', 
      dueDate: '2025-04-08',
      platform: 'instagram',
      assignee: 'Designer' 
    },
    { 
      id: 3, 
      title: 'Write tweet thread about fan event', 
      status: 'To Do', 
      dueDate: '2025-04-10',
      platform: 'twitter',
      assignee: 'Caption Creator'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'To Do': return 'bg-gray-100 text-gray-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Review': return 'bg-yellow-100 text-yellow-800';
      case 'Done': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'instagram': return 'bg-platform-instagram';
      case 'facebook': return 'bg-platform-facebook';
      case 'twitter': return 'bg-platform-twitter';
      case 'tiktok': return 'bg-platform-tiktok';
      case 'youtube': return 'bg-platform-youtube';
      default: return 'bg-gray-500';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Your Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="task-card animate-slide-in">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-sm">{task.title}</h3>
                <Badge className={`${getStatusColor(task.status)}`} variant="secondary">
                  {task.status}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center mt-3">
                <div className="flex items-center space-x-1">
                  <div className={`platform-badge ${getPlatformColor(task.platform)}`}>
                    {task.platform.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-xs text-muted-foreground">{task.assignee}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  Due {formatDate(task.dueDate)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskSummary;
