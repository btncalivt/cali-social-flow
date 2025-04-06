
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CalendarCheck, CheckSquare, ClipboardList, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import TaskSummary from './TaskSummary';
import UpcomingPosts from './UpcomingPosts';
import NewIdeaForm from '../ideas/NewIdeaForm';

const DashboardOverview = () => {
  const { profile } = useAuth();
  const displayName = profile?.full_name || 'DreamKeeper';

  // Mock data - in a real app, this would come from an API or state
  const stats = [
    { title: 'Tasks Due Today', value: 5, icon: <Clock className="h-5 w-5 text-cali-blue" /> },
    { title: 'Tasks Completed', value: 12, icon: <CheckSquare className="h-5 w-5 text-green-500" /> },
    { title: 'Scheduled Posts', value: 8, icon: <CalendarCheck className="h-5 w-5 text-purple-500" /> },
    { title: 'Total Tasks', value: 24, icon: <ClipboardList className="h-5 w-5 text-gray-500" /> }
  ];

  const completedTasks = 12;
  const totalTasks = 24;
  const completionPercentage = Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome, {displayName}</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="shadow-sm">
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent className="p-4 pt-1">
              <p className="text-2xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progress Overview */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle>Task Progress</CardTitle>
          <CardDescription>
            {completedTasks} of {totalTasks} tasks completed
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Progress value={completionPercentage} className="h-2" />
          <div className="text-sm text-right text-muted-foreground">
            {completionPercentage}% complete
          </div>
        </CardContent>
      </Card>

      {/* New Idea Form */}
      <NewIdeaForm />

      {/* Tasks and Upcoming Posts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TaskSummary />
        <UpcomingPosts />
      </div>
    </div>
  );
};

export default DashboardOverview;
