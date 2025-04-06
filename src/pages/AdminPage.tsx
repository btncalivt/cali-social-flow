
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { AppRole } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertCircle, Plus, Users } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  
  // New user form state
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState<AppRole>('viewer');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [addingUser, setAddingUser] = useState(false);
  
  // Edit role state
  const [isEditRoleOpen, setIsEditRoleOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<AppRole>('viewer');
  const [updatingRole, setUpdatingRole] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*');
        
      if (profilesError) throw profilesError;
      
      // Fetch all users from auth schema (admin only endpoint)
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) throw authError;
      
      // Fetch all roles
      const { data: roleData, error: rolesError } = await supabase
        .from('user_roles')
        .select('*');
        
      if (rolesError) throw rolesError;
      
      // Type assertions to help TypeScript understand the data types
      const typedProfiles = profiles as Profile[];
      const typedRoleData = roleData as { user_id: string; role: AppRole }[];
      
      // Combine data
      const userMap = new Map<string, UserWithRoles>();
      
      if (authUsers && authUsers.users && typedProfiles) {
        typedProfiles.forEach(profile => {
          const user = authUsers.users.find(u => u.id === profile.id);
          if (user) {
            userMap.set(user.id, {
              ...profile,
              email: user.email || '',
              roles: []
            });
          }
        });
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

  const addUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newUserEmail || !newUserPassword) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setAddingUser(true);
      
      // Create user
      const { data: userData, error: userError } = await supabase.auth.admin.createUser({
        email: newUserEmail,
        password: newUserPassword,
        email_confirm: true,
        user_metadata: { full_name: newUserName }
      });
      
      if (userError) throw userError;
      
      const userId = userData.user.id;
      
      // Add user role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role: newUserRole
        });
        
      if (roleError) throw roleError;
      
      // Success!
      toast({
        title: "User added",
        description: `Successfully added user ${newUserEmail}`,
      });
      
      setIsAddUserOpen(false);
      setNewUserEmail('');
      setNewUserName('');
      setNewUserPassword('');
      setNewUserRole('viewer');
      
      // Reload users
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
  
  const openEditRoleDialog = (userId: string, currentRoles: AppRole[]) => {
    setEditingUserId(userId);
    setSelectedRole(currentRoles[0] || 'viewer');
    setIsEditRoleOpen(true);
  };
  
  const updateUserRole = async () => {
    if (!editingUserId || !selectedRole) return;
    
    try {
      setUpdatingRole(true);
      
      // First delete existing roles
      const { error: deleteError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', editingUserId);
        
      if (deleteError) throw deleteError;
      
      // Add new role
      const { error: insertError } = await supabase
        .from('user_roles')
        .insert({
          user_id: editingUserId,
          role: selectedRole
        });
        
      if (insertError) throw insertError;
      
      toast({
        title: "Role updated",
        description: "User role has been updated successfully",
      });
      
      setIsEditRoleOpen(false);
      fetchUsers();
    } catch (err: any) {
      console.error('Error updating role:', err);
      toast({
        title: "Error updating role",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setUpdatingRole(false);
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
            <div className="py-8 text-center">Loading users...</div>
          ) : users.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">No users found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
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
                            No Role
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openEditRoleDialog(user.id, user.roles)}
                      >
                        Edit Role
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add User Dialog */}
      <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new team member account and assign them a role
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={addUser}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="user@example.com"
                  required
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
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select 
                  value={newUserRole} 
                  onValueChange={(value) => setNewUserRole(value as AppRole)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map(role => (
                      <SelectItem key={role} value={role}>
                        {roleLabelMap[role]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
              <Button type="submit" disabled={addingUser}>
                {addingUser ? 'Adding...' : 'Add User'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog open={isEditRoleOpen} onOpenChange={setIsEditRoleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              Update the role and permissions for this user
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select 
                value={selectedRole} 
                onValueChange={(value) => setSelectedRole(value as AppRole)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {roleOptions.map(role => (
                    <SelectItem key={role} value={role}>
                      {roleLabelMap[role]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsEditRoleOpen(false)}
              disabled={updatingRole}
            >
              Cancel
            </Button>
            <Button 
              onClick={updateUserRole}
              disabled={updatingRole}
            >
              {updatingRole ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPage;
