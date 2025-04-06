
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Task type definition
interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'Idea' | 'In Progress' | 'Scheduled' | 'Published';
  platform: string;
  assignee?: string;
  dueDate?: string;
}

const KanbanBoard = () => {
  // Mock data - in a real app this would come from an API/state
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Fan Poll About Favorite Songs',
      description: 'Create a poll asking fans about their favorite songs',
      status: 'Idea',
      platform: 'instagram',
      assignee: 'Social Media Manager'
    },
    {
      id: '2',
      title: 'Dance Tutorial Video',
      description: 'Record a tutorial of the latest choreography',
      status: 'Idea',
      platform: 'tiktok',
      assignee: 'Video Editor'
    },
    {
      id: '3',
      title: 'New Album Teaser',
      description: 'Create teaser graphics for upcoming album',
      status: 'In Progress',
      platform: 'instagram',
      assignee: 'Designer',
      dueDate: '2025-04-10'
    },
    {
      id: '4',
      title: 'Interview Highlights',
      description: 'Edit clips from recent interview',
      status: 'In Progress',
      platform: 'youtube',
      assignee: 'Video Editor',
      dueDate: '2025-04-12'
    },
    {
      id: '5',
      title: 'Tour Date Announcement',
      description: 'Create graphics for tour announcement',
      status: 'Scheduled',
      platform: 'twitter',
      dueDate: '2025-04-08'
    },
    {
      id: '6',
      title: 'Behind-the-Scenes Photos',
      description: 'Post BTS photos from music video shoot',
      status: 'Scheduled',
      platform: 'instagram',
      dueDate: '2025-04-09'
    },
    {
      id: '7',
      title: 'Fan Art Highlight Reel',
      description: 'Compilation of best fan art from last month',
      status: 'Published',
      platform: 'facebook'
    },
    {
      id: '8',
      title: 'Dance Challenge Launch',
      description: 'Launch of new dance challenge with hashtag',
      status: 'Published',
      platform: 'tiktok'
    }
  ]);

  const columns = [
    { id: 'Idea', title: 'Ideas', color: 'bg-amber-100 text-amber-800' },
    { id: 'In Progress', title: 'In Progress', color: 'bg-blue-100 text-blue-800' },
    { id: 'Scheduled', title: 'Scheduled', color: 'bg-purple-100 text-purple-800' },
    { id: 'Published', title: 'Published', color: 'bg-green-100 text-green-800' }
  ];

  // In a real app, this would handle drag and drop functionality
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    const taskId = e.dataTransfer.getData('taskId');
    
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: columnId as Task['status'] }
        : task
    ));
  };

  const allowDrop = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const getPlatformColor = (platform: string) => {
    const colors: Record<string, string> = {
      instagram: 'bg-platform-instagram',
      facebook: 'bg-platform-facebook',
      twitter: 'bg-platform-twitter',
      tiktok: 'bg-platform-tiktok',
      youtube: 'bg-platform-youtube',
    };
    
    return colors[platform] || 'bg-gray-500';
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Content Board</h1>
        <Button size="sm">
          <PlusCircle className="h-4 w-4 mr-2" />
          New Idea
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {columns.map(column => (
          <div key={column.id} className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-sm font-medium">
                <Badge className={column.color} variant="secondary">
                  {column.title}
                </Badge>
              </h2>
              <span className="text-xs text-muted-foreground">
                {tasks.filter(t => t.status === column.id).length}
              </span>
            </div>
            
            <div 
              className="bg-muted/30 p-2 rounded-lg flex-1 min-h-[70vh] overflow-y-auto"
              onDrop={(e) => handleDrop(e, column.id)}
              onDragOver={allowDrop}
            >
              <div className="space-y-3">
                {tasks
                  .filter(task => task.status === column.id)
                  .map(task => (
                    <div 
                      key={task.id}
                      className="task-card cursor-move"
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                    >
                      <div className="flex items-start justify-between">
                        <h3 className="font-medium text-sm">{task.title}</h3>
                        <div className={`platform-badge ${getPlatformColor(task.platform)}`}>
                          {task.platform.charAt(0).toUpperCase()}
                        </div>
                      </div>
                      
                      {task.description && (
                        <p className="text-xs text-muted-foreground mt-2 mb-2">
                          {task.description}
                        </p>
                      )}
                      
                      <div className="flex justify-between items-center mt-3">
                        {task.assignee && (
                          <span className="text-xs text-muted-foreground">
                            {task.assignee}
                          </span>
                        )}
                        {task.dueDate && (
                          <span className="text-xs text-muted-foreground">
                            Due {new Date(task.dueDate).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  
                {tasks.filter(t => t.status === column.id).length === 0 && (
                  <div className="h-16 flex items-center justify-center border border-dashed rounded-lg">
                    <p className="text-sm text-muted-foreground">No tasks</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
