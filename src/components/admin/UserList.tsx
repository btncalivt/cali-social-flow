
import { useState } from 'react';
import { AppRole } from '@/types/supabase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Users } from 'lucide-react';

type UserWithRoles = {
  id: string;
  avatar_url: string | null;
  created_at: string;
  full_name: string | null;
  updated_at: string;
  roles: AppRole[];
  email: string;
};

interface UserListProps {
  users: UserWithRoles[];
  loading: boolean;
  roleColors: Record<AppRole, string>;
  roleLabelMap: Record<AppRole, string>;
  onEditRoles: (userId: string, currentRoles: AppRole[]) => void;
}

const UserList = ({ users, loading, roleColors, roleLabelMap, onEditRoles }: UserListProps) => {
  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    return name.split(' ').map(part => part[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <>
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
                    onClick={() => onEditRoles(user.id, user.roles)}
                  >
                    Edit Roles
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </>
  );
};

export default UserList;
