
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AppRole } from '@/types/supabase';

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
  user_metadata?: {
    full_name?: string;
  };
  [key: string]: any;
};

type AuthUsersResponse = {
  users: AuthUser[];
  [key: string]: any;
};

export const useAdminUsers = (isAdmin: boolean) => {
  const { toast } = useToast();
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [existingUsers, setExistingUsers] = useState<{id: string, email: string, name: string}[]>([]);

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

  return {
    users,
    loading,
    error,
    existingUsers,
    fetchUsers
  };
};
