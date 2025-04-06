
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Search, 
  Filter, 
  Plus, 
  UserCircle2, 
  Calendar, 
  CheckCircle2, 
  CircleDashed
} from 'lucide-react';
import { Input } from '@/components/ui/input';

interface Task {
  id: string;
  title: string;
  status: 'To Do' | 'In Progress' | 'In Review' | 'Done';
  dueDate?: string;
  platform: string;
  assignee?: string;
  priority: 'Low' | 'Medium' | 'High';
  completed: boolean;
}

const TaskList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<string>('all');
  
  // Mock tasks data
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Create fan poll about favorite songs',
      status: 'To Do',
      dueDate: '2025-04-15',
      platform: 'instagram',
      assignee: 'John D.',
      priority: 'Medium',
      completed: false
    },
    {
      id: '2',
      title: 'Design album announcement graphics',
      status: 'In Progress',
      dueDate: '2025-04-10',
      platform: 'facebook',
      assignee: 'Sarah M.',
      priority: 'High',
      completed: false
    },
    {
      id: '3',
      title: 'Edit behind-the-scenes footage',
      status: 'In Progress',
      dueDate: '2025-04-12',
      platform: 'youtube',
      assignee: 'Michael K.',
      priority: 'Medium',
      completed: false
    },
    {
      id: '4',
      title: 'Schedule tweet about upcoming tour',
      status: 'In Review',
      dueDate: '2025-04-08',
      platform: 'twitter',
      assignee: 'Lisa T.',
      priority: 'High',
      completed: false
    },
    {
      id: '5',
      title: 'Prepare TikTok dance challenge',
      status: 'To Do',
      dueDate: '2025-04-18',
      platform: 'tiktok',
      assignee: 'Chris P.',
      priority: 'Medium',
      completed: false
    },
    {
      id: '6',
      title: 'Write captions for gallery post',
      status: 'Done',
      dueDate: '2025-04-05',
      platform: 'instagram',
      assignee: 'Alex W.',
      priority: 'Low',
      completed: true
    }
  ]);
  
  // Toggle task completion
  const toggleTaskCompletion = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };
  
  // Filter tasks
  const getFilteredTasks = () => {
    let filtered = [...tasks];
    
    if (filter !== 'all') {
      filtered = filtered.filter(task => task.status === filter);
    }
    
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(search) || 
        task.assignee?.toLowerCase().includes(search) ||
        task.platform.toLowerCase().includes(search)
      );
    }
    
    return filtered;
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
  
  // Status badge
  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      'To Do': 'bg-gray-100 text-gray-800',
      'In Progress': 'bg-blue-100 text-blue-800',
      'In Review': 'bg-yellow-100 text-yellow-800',
      'Done': 'bg-green-100 text-green-800'
    };
    
    return (
      <Badge variant="secondary" className={colors[status] || 'bg-gray-100'}>
        {status}
      </Badge>
    );
  };
  
  // Priority badge
  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      'Low': 'bg-green-100 text-green-800',
      'Medium': 'bg-amber-100 text-amber-800',
      'High': 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge variant="secondary" className={`${colors[priority] || 'bg-gray-100'} text-xs`}>
        {priority}
      </Badge>
    );
  };
  
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>
      
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button 
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
            className="whitespace-nowrap"
          >
            <CircleDashed className="h-4 w-4 mr-2" />
            All Tasks
          </Button>
          <Button 
            variant={filter === 'To Do' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('To Do')}
          >
            To Do
          </Button>
          <Button 
            variant={filter === 'In Progress' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('In Progress')}
          >
            In Progress
          </Button>
          <Button 
            variant={filter === 'Done' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('Done')}
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Done
          </Button>
        </div>
      </div>
      
      {/* Tasks List */}
      <Card className="bg-muted/30">
        <ul className="divide-y">
          {getFilteredTasks().map(task => (
            <li key={task.id} className="p-4 hover:bg-muted/20 transition-colors">
              <div className="flex items-start gap-3">
                <div className="pt-0.5">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleTaskCompletion(task.id)}
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {task.title}
                    </h3>
                    {getPlatformBadge(task.platform)}
                  </div>
                  
                  <div className="flex flex-wrap gap-3 mt-3 text-sm text-muted-foreground">
                    {task.assignee && (
                      <div className="flex items-center">
                        <UserCircle2 className="h-4 w-4 mr-1" />
                        {task.assignee}
                      </div>
                    )}
                    
                    {task.dueDate && (
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(task.dueDate).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                    )}
                    
                    {getStatusBadge(task.status)}
                    {getPriorityBadge(task.priority)}
                  </div>
                </div>
              </div>
            </li>
          ))}
          
          {getFilteredTasks().length === 0 && (
            <li className="p-8 text-center">
              <p className="text-muted-foreground">No tasks match your search criteria.</p>
            </li>
          )}
        </ul>
      </Card>
    </div>
  );
};

export default TaskList;
