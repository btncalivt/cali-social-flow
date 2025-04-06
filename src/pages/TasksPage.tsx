
import TaskList from "@/components/tasks/TaskList";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const TasksPage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center h-[80vh]">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <TaskList />;
};

export default TasksPage;
