
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { AppRole } from '@/types/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertCircle, Plus, Users, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';

type Profile = {
  id: string;
  avatar_url: string | null;
  created_at: string;
  full_name: string | null;
  updated_at: string;
};

type UserWithRoles = Profile & { 
  roles: AppRole[];
  email: string;
};

type AuthUser = {
  id: string;
  email?: string;
  [key: string]: any;
};

type AuthUsersResponse = {
  users: AuthUser[];
  [key: string]: any;
};

const roleColors: Record<AppRole, string> = {
  'admin': 'bg-red-100 text-red-800',
  'managing_editor': 'bg-blue-100 text-blue-800',
  'editor': 'bg-green-100 text-green-800',
  'designer': 'bg-purple-100 text-purple-800',
  'video_editor': 'bg-yellow-100 text-yellow-800',
  'caption_creator': 'bg-pink-100 text-pink-800',
  'seo_analyst': 'bg-indigo-100 text-indigo-800',
  'contributor': 'bg-orange-100 text-orange-800',
  'viewer': 'bg-gray-100 text-gray-800'
};

const roleLabelMap: Record<AppRole, string> = {
  'admin': 'Admin',
  'managing_editor': 'Managing Editor',
  'editor': 'Editor',
  'designer': 'Designer',
  'video_editor': 'Video Editor',
  'caption_creator': 'Caption Creator',
  'seo_analyst': 'SEO Analyst',
  'contributor': 'Contributor',
  'viewer': 'Viewer'
};

const roleOptions: AppRole[] = [
  'admin',
  'managing_editor',
  'editor',
  'designer',
  'video_editor',
  'caption_creator',
  'seo_analyst',
  'contributor',
  'viewer'
];

const AdminPage = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserRoles, setNewUserRoles] = useState<AppRole[]>(['viewer']);
  const [newUserPassword, setNewUserPassword] = useState('');
  const [addingUser, setAddingUser] = useState(false);
  
  const [isEditRolesOpen, setIsEditRolesOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<AppRole[]>([]);
  const [updatingRoles, setUpdatingRoles] = useState(false);

  const [existingUsers, setExistingUsers] = useState<{id: string, email: string, name: string}[]>([]);
  const [selectedExistingUserId, setSelectedExistingUserId] = useState<string>('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');
        
      if (profilesError) throw profilesError;
      
      const { data: authUsersData, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) throw authError;
      
      const { data: roleData, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');
        
      if (rolesError) throw rolesError;
      
      const typedProfiles = profiles as Profile[];
      const typedAuthUsers = authUsersData as AuthUsersResponse;
      const typedRoleData = roleData as { user_id: string; role: AppRole }[];
      
      const userMap = new Map<string, UserWithRoles>();
      
      if (typedAuthUsers && typedAuthUsers.users && typedProfiles) {
        typedProfiles.forEach(profile => {
          const user = typedAuthUsers.users.find(u => u.id === profile.id);
          if (user) {
            userMap.set(user.id, {
              ...profile,
              email: user.email || '',
              roles: []
            });
          }
        });
        
        // Also build a list of existing users for the dropdown
        setExistingUsers(typedAuthUsers.users.map(user => ({
          id: user.id,
          email: user.email || '',
          name: user.user_metadata?.full_name || ''
        })));
      }
      
      if (typedRoleData && userMap.size > 0) {
        typedRoleData.forEach(role => {
          const user = userMap.get(role.user_id);
          if (user) {
            user.roles.push(role.role as AppRole);
          }
        });
      }
      
      setUsers(Array.from(userMap.values()));
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.message || 'Failed to fetch users');
      toast({
        title: "Error",
        description: err.message || 'Failed to fetch users',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const handleRoleSelection = (role: AppRole) => {
    setSelectedRoles(prev => {
      if (prev.includes(role)) {
        return prev.filter(r => r !== role);
      }
      return [...prev, role];
    });
  };

  const handleNewUserRoleSelection = (role: AppRole) => {
    setNewUserRoles(prev => {
      if (prev.includes(role)) {
        return prev.filter(r => r !== role);
      }
      return [...prev, role];
    });
  };

  const handleExistingUserSelection = (userId: string) => {
    setSelectedExistingUserId(userId);
    const user = existingUsers.find(u => u.id === userId);
    if (user) {
      setNewUserName(user.name || '');
      setNewUserEmail(user.email || '');
    }
  };

  const addUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedExistingUserId) {
      // Assign roles to an existing user
      await assignRolesToExistingUser(selectedExistingUserId, newUserRoles);
    } else {
      // Create a new user
      await createNewUser();
    }
  };
  
  const assignRolesToExistingUser = async (userId: string, userRoles: AppRole[]) => {
    if (!userId || userRoles.length === 0) {
      toast({
        title: "Missing information",
        description: "Please select a user and at least one role",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setAddingUser(true);
      
      // Delete any existing roles first
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);
      
      // Insert new roles
      for (const role of userRoles) {
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: userId,
            role: role
          });
          
        if (roleError) throw roleError;
      }
      
      toast({
        title: "Roles assigned",
        description: "Successfully assigned roles to the user",
      });
      
      setIsAddUserOpen(false);
      setSelectedExistingUserId('');
      setNewUserName('');
      setNewUserEmail('');
      setNewUserRoles(['viewer']);
      
      fetchUsers();
    } catch (err: any) {
      console.error('Error assigning roles:', err);
      toast({
        title: "Error",
        description: err.message || "An error occurred while assigning roles",
        variant: "destructive",
      });
    } finally {
      setAddingUser(false);
    }
  };
  
  const createNewUser = async () => {
    if (!newUserEmail || !newUserPassword || newUserRoles.length === 0) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields and select at least one role",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setAddingUser(true);
      
      const { data: userData, error: userError } = await supabase.auth.admin.createUser({
        email: newUserEmail,
        password: newUserPassword,
        email_confirm: true,
        user_metadata: { full_name: newUserName }
      });
      
      if (userError) throw userError;
      
      if (!userData || !userData.user) {
        throw new Error('Failed to create user');
      }
      
      const userId = userData.user.id;
      
      for (const role of newUserRoles) {
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: userId,
            role: role
          });
          
        if (roleError) throw roleError;
      }
      
      toast({
        title: "User added",
        description: `Successfully added user ${newUserEmail}`,
      });
      
      setIsAddUserOpen(false);
      setNewUserEmail('');
      setNewUserName('');
      setNewUserPassword('');
      setNewUserRoles(['viewer']);
      
      fetchUsers();
    } catch (err: any) {
      console.error('Error adding user:', err);
      toast({
        title: "Error adding user",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setAddingUser(false);
    }
  };
  
  const openEditRolesDialog = (userId: string, currentRoles: AppRole[]) => {
    setEditingUserId(userId);
    setSelectedRoles([...currentRoles]);
    setIsEditRolesOpen(true);
  };
  
  const updateUserRoles = async () => {
    if (!editingUserId || selectedRoles.length === 0) {
      toast({
        title: "Error",
        description: "You must select at least one role",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setUpdatingRoles(true);
      
      const { error: deleteError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', editingUserId);
        
      if (deleteError) throw deleteError;
      
      for (const role of selectedRoles) {
        const { error: insertError } = await supabase
          .from('user_roles')
          .insert({
            user_id: editingUserId,
            role: role
          });
          
        if (insertError) throw insertError;
      }
      
      toast({
        title: "Roles updated",
        description: "User roles have been updated successfully",
      });
      
      setIsEditRolesOpen(false);
      fetchUsers();
    } catch (err: any) {
      console.error('Error updating roles:', err);
      toast({
        title: "Error updating roles",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setUpdatingRoles(false);
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(part => part[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage users and roles</p>
        </div>
        <Button onClick={() => setIsAddUserOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add User
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" /> Users
          </CardTitle>
          <CardDescription>Manage team members and their roles</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-8 flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : users.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">No users found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Roles</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatar_url || undefined} alt={user.full_name || ''} />
                          <AvatarFallback>{getInitials(user.full_name)}</AvatarFallback>
                        </Avatar>
                        <span>{user.full_name || 'Unnamed User'}</span>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.roles.map(role => (
                          <span 
                            key={role}
                            className={`text-xs px-2 py-1 rounded ${roleColors[role]}`}
                          >
                            {roleLabelMap[role]}
                          </span>
                        ))}
                        {user.roles.length === 0 && (
                          <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-800">
                            No Roles
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openEditRolesDialog(user.id, user.roles)}
                      >
                        Edit Roles
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new team member account and assign them roles, or assign roles to an existing user
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={addUser}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="existing-user">Existing User</Label>
                <Select 
                  onValueChange={handleExistingUserSelection}
                  value={selectedExistingUserId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an existing user" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Create a new user</SelectItem>
                    {existingUsers.map(user => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.email} {user.name ? `(${user.name})` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Select an existing user or create a new one
                </p>
              </div>
              
              {!selectedExistingUserId && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      placeholder="user@example.com"
                      required={!selectedExistingUserId}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={newUserPassword}
                      onChange={(e) => setNewUserPassword(e.target.value)}
                      placeholder="Create a password"
                      required={!selectedExistingUserId}
                    />
                  </div>
                </>
              )}
              <div className="space-y-2">
                <Label>Roles</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {roleOptions.map((role) => (
                    <div key={role} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`role-${role}`}
                        checked={newUserRoles.includes(role)}
                        onCheckedChange={() => handleNewUserRoleSelection(role)}
                      />
                      <label
                        htmlFor={`role-${role}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {roleLabelMap[role]}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsAddUserOpen(false)}
                disabled={addingUser}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={addingUser || newUserRoles.length === 0}>
                {addingUser ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {addingUser ? 'Adding...' : selectedExistingUserId ? 'Assign Roles' : 'Add User'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditRolesOpen} onOpenChange={setIsEditRolesOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update User Roles</DialogTitle>
            <DialogDescription>
              Select one or more roles for this user
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              <Label>Roles</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {roleOptions.map((role) => (
                  <div key={role} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`edit-role-${role}`}
                      checked={selectedRoles.includes(role)}
                      onCheckedChange={() => handleRoleSelection(role)}
                    />
                    <label
                      htmlFor={`edit-role-${role}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {roleLabelMap[role]}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditRolesOpen(false)}
              disabled={updatingRoles}
            >
              Cancel
            </Button>
            <Button 
              onClick={updateUserRoles}
              disabled={updatingRoles || selectedRoles.length === 0}
            >
              {updatingRoles ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {updatingRoles ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPage;
