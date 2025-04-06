
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Search, 
  Filter, 
  UserCircle2, 
  Calendar, 
  CheckCircle2, 
  CircleDashed,
  Loader2
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import CreateTaskDialog from './CreateTaskDialog';

interface Task {
  id: string;
  title: string;
  status: 'To Do' | 'In Progress' | 'In Review' | 'Done';
  due_date?: string;
  platform: string;
  assignee?: {
    id: string;
    full_name?: string;
    email?: string;
  };
  priority: 'Low' | 'Medium' | 'High';
  completed: boolean;
}

const TaskList = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  
  const fetchTasks = async () => {
    try {
      setLoading(true);
      
      const { data: tasksData, error } = await supabase
        .from('tasks')
        .select(`
          id,
          title,
          status,
          due_date,
          platform,
          assignee_id,
          priority,
          completed
        `);
      
      if (error) throw error;
      
      // Fetch user data for assignees
      const userIds = tasksData
        .map(task => task.assignee_id)
        .filter(id => id !== null);
      
      const uniqueUserIds = [...new Set(userIds)];
      
      let assignees: Record<string, { id: string; full_name?: string; email?: string }> = {};
      
      if (uniqueUserIds.length > 0) {
        // Get profiles for user names
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', uniqueUserIds);
        
        // Get auth users for emails
        const { data: authUsersData } = await supabase.auth.admin.listUsers();
        
        if (profiles && authUsersData) {
          const authUsers = (authUsersData as any).users || [];
          
          uniqueUserIds.forEach(id => {
            const profile = profiles.find((p: any) => p.id === id);
            const authUser = authUsers.find((u: any) => u.id === id);
            
            assignees[id] = {
              id,
              full_name: profile?.full_name,
              email: authUser?.email,
            };
          });
        }
      }
      
      // Map tasks with assignee information
      const tasksWithAssignees = tasksData.map(task => ({
        ...task,
        assignee: task.assignee_id ? assignees[task.assignee_id] : undefined
      }));
      
      setTasks(tasksWithAssignees);
    } catch (error: any) {
      console.error('Error fetching tasks:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load tasks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTasks();
  }, []);
  
  // Toggle task completion
  const toggleTaskCompletion = async (taskId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ completed: !currentStatus })
        .eq('id', taskId);
      
      if (error) throw error;
      
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ));
      
      toast({
        title: currentStatus ? "Task Incomplete" : "Task Completed",
        description: `Task has been marked as ${currentStatus ? "incomplete" : "completed"}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update task",
        variant: "destructive",
      });
    }
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
        task.assignee?.full_name?.toLowerCase().includes(search) ||
        task.assignee?.email?.toLowerCase().includes(search) ||
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
      pinterest: 'bg-gray-400',
      threads: 'bg-black',
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
        <CreateTaskDialog onTaskCreated={fetchTasks} />
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
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <span className="ml-2 text-muted-foreground">Loading tasks...</span>
          </div>
        ) : (
          <ul className="divide-y">
            {getFilteredTasks().map(task => (
              <li key={task.id} className="p-4 hover:bg-muted/20 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="pt-0.5">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => toggleTaskCompletion(task.id, task.completed)}
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
                          {task.assignee.full_name || task.assignee.email || 'Unknown User'}
                        </div>
                      )}
                      
                      {task.due_date && (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(task.due_date).toLocaleDateString('en-US', { 
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
        )}
      </Card>
    </div>
  );
};

export default TaskList;
