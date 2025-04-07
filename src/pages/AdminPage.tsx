
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { AppRole } from '@/types/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Plus, Users } from 'lucide-react';

// Import refactored components
import UserList from '@/components/admin/UserList';
import AddUserDialog, { AddUserFormData } from '@/components/admin/AddUserDialog';
import EditRolesDialog from '@/components/admin/EditRolesDialog';
import { roleColors, roleLabelMap } from '@/components/admin/RoleConfig';
import { useAdminUsers } from '@/hooks/useAdminUsers';

const AdminPage = () => {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const { users, loading, error, existingUsers, fetchUsers } = useAdminUsers(isAdmin);
  
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditRolesOpen, setIsEditRolesOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<AppRole[]>([]);
  const [addingUser, setAddingUser] = useState(false);
  const [updatingRoles, setUpdatingRoles] = useState(false);

  const handleRoleSelection = (role: AppRole) => {
    setSelectedRoles(prev => {
      if (prev.includes(role)) {
        return prev.filter(r => r !== role);
      }
      return [...prev, role];
    });
  };

  const addUser = async (formData: AddUserFormData) => {
    const { selectedExistingUserId, newUserEmail, newUserName, newUserPassword, newUserRoles } = formData;
    
    if (selectedExistingUserId) {
      await assignRolesToExistingUser(selectedExistingUserId, newUserRoles);
    } else {
      await createNewUser(newUserEmail, newUserPassword, newUserName, newUserRoles);
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
      
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);
      
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
  
  const createNewUser = async (email: string, password: string, name: string, roles: AppRole[]) => {
    if (!email || !password || roles.length === 0) {
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
        email: email,
        password: password,
        email_confirm: true,
        user_metadata: { full_name: name }
      });
      
      if (userError) throw userError;
      
      if (!userData || !userData.user) {
        throw new Error('Failed to create user');
      }
      
      const userId = userData.user.id;
      
      for (const role of roles) {
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
        description: `Successfully added user ${email}`,
      });
      
      setIsAddUserOpen(false);
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
          <UserList 
            users={users}
            loading={loading}
            roleColors={roleColors}
            roleLabelMap={roleLabelMap}
            onEditRoles={openEditRolesDialog}
          />
        </CardContent>
      </Card>

      <AddUserDialog
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        existingUsers={existingUsers}
        onAddUser={addUser}
        isAddingUser={addingUser}
      />

      <EditRolesDialog
        isOpen={isEditRolesOpen}
        onClose={() => setIsEditRolesOpen(false)}
        selectedRoles={selectedRoles}
        onRoleSelection={handleRoleSelection}
        onUpdateRoles={updateUserRoles}
        isUpdating={updatingRoles}
      />
    </div>
  );
};

export default AdminPage;
