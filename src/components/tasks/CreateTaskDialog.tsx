
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, Plus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface FormValues {
  title: string;
  platform: string;
  status: string;
  priority: string;
  assigneeId: string;
  dueDate?: Date;
  completed: boolean;
}

interface User {
  id: string;
  email: string;
  full_name?: string;
}

const CreateTaskDialog = ({ onTaskCreated }: { onTaskCreated: () => void }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const form = useForm<FormValues>({
    defaultValues: {
      title: "",
      platform: "instagram",
      status: "To Do",
      priority: "Medium",
      assigneeId: "",
      completed: false,
    },
  });

  const loadUsers = async () => {
    try {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name');
        
      if (profilesError) throw profilesError;
      
      const { data: authUsersData, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) throw authError;
      
      const authUsers = authUsersData as any;
      
      if (authUsers && authUsers.users && profiles) {
        const usersList = authUsers.users.map((authUser: any) => {
          const profile = profiles.find((p: any) => p.id === authUser.id);
          return {
            id: authUser.id,
            email: authUser.email,
            full_name: profile?.full_name,
          };
        });
        setUsers(usersList);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      loadUsers();
    }
    setOpen(isOpen);
  };

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    
    try {
      const taskData = {
        title: values.title,
        platform: values.platform,
        status: values.status,
        priority: values.priority,
        assignee_id: values.assigneeId || null,
        due_date: values.dueDate ? values.dueDate.toISOString() : null,
        completed: values.completed,
        created_by: user?.id
      };
      
      const { error } = await supabase
        .from('tasks')
        .insert(taskData);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Task created successfully",
      });
      
      setOpen(false);
      form.reset();
      onTaskCreated();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create task",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const platforms = [
    { value: "instagram", label: "Instagram" },
    { value: "facebook", label: "Facebook" },
    { value: "twitter", label: "Twitter" },
    { value: "youtube", label: "YouTube" },
    { value: "tiktok", label: "TikTok" },
    { value: "pinterest", label: "Pinterest" },
    { value: "threads", label: "Threads" },
  ];

  const statuses = [
    { value: "To Do", label: "To Do" },
    { value: "In Progress", label: "In Progress" },
    { value: "In Review", label: "In Review" },
    { value: "Done", label: "Done" },
  ];

  const priorities = [
    { value: "Low", label: "Low" },
    { value: "Medium", label: "Medium" },
    { value: "High", label: "High" },
  ];

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Add a new task to the system. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter task title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="platform"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Platform</FormLabel>
                  <Select 
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a platform" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {platforms.map((platform) => (
                        <SelectItem key={platform.value} value={platform.value}>
                          {platform.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select 
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority</FormLabel>
                  <Select 
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a priority" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {priorities.map((priority) => (
                        <SelectItem key={priority.value} value={priority.value}>
                          {priority.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="assigneeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assignee</FormLabel>
                  <Select 
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Assign to someone" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">Unassigned</SelectItem>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.full_name || user.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Due Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="completed"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Completed
                    </FormLabel>
                  </div>
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Task"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskDialog;
