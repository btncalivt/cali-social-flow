
import { useState } from 'react';
import { AppRole } from '@/types/supabase';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import { roleOptions, roleLabelMap } from './RoleConfig';

type ExistingUser = {
  id: string;
  email: string;
  name: string;
};

interface AddUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  existingUsers: ExistingUser[];
  onAddUser: (formData: AddUserFormData) => Promise<void>;
  isAddingUser: boolean;
}

export type AddUserFormData = {
  selectedExistingUserId: string;
  newUserEmail: string;
  newUserName: string;
  newUserPassword: string;
  newUserRoles: AppRole[];
};

const AddUserDialog = ({
  isOpen,
  onClose,
  existingUsers,
  onAddUser,
  isAddingUser
}: AddUserDialogProps) => {
  const [selectedExistingUserId, setSelectedExistingUserId] = useState<string>('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRoles, setNewUserRoles] = useState<AppRole[]>(['viewer']);

  const handleExistingUserSelection = (userId: string) => {
    setSelectedExistingUserId(userId);
    const user = existingUsers.find(u => u.id === userId);
    if (user) {
      setNewUserName(user.name || '');
      setNewUserEmail(user.email || '');
    }
  };

  const handleNewUserRoleSelection = (role: AppRole) => {
    setNewUserRoles(prev => {
      if (prev.includes(role)) {
        return prev.filter(r => r !== role);
      }
      return [...prev, role];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddUser({
      selectedExistingUserId,
      newUserEmail,
      newUserName,
      newUserPassword,
      newUserRoles
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
          <DialogDescription>
            Create a new team member account and assign them roles, or assign roles to an existing user
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
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
                  <SelectItem value="new">Create a new user</SelectItem>
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
              onClick={onClose}
              disabled={isAddingUser}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isAddingUser || newUserRoles.length === 0}>
              {isAddingUser ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {isAddingUser ? 'Adding...' : selectedExistingUserId ? 'Assign Roles' : 'Add User'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
