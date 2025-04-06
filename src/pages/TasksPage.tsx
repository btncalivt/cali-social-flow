
import TaskList from "@/components/tasks/TaskList";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const TasksPage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-[80vh]">
      <Loader2 className="h-8 w-8 animate-spin mr-2" /> Loading...
    </div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <TaskList />;
};

export default TasksPage;
