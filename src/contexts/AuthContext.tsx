
import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AppRole, Profile } from '@/types/supabase';

// Define user metadata type
type UserMetadata = {
  full_name?: string;
};

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  roles: AppRole[];
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, metadata?: UserMetadata) => Promise<any>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (event === 'SIGNED_OUT') {
          setProfile(null);
          setRoles([]);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        fetchProfile(currentSession.user.id);
        fetchRoles(currentSession.user.id);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        throw error;
      }

      console.log('Profile fetched:', data);
      setProfile(data as Profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchRoles = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      const userRoles = data.map(item => item.role as AppRole);
      setRoles(userRoles);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        throw error;
      }

      if (data.user) {
        await fetchProfile(data.user.id);
        await fetchRoles(data.user.id);
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
      }
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Failed to sign in. Please check your credentials.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, metadata?: UserMetadata) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Registration successful",
        description: "Your account has been created. You may need admin approval before you can sign in.",
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Failed to create account.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return;
    
    console.log('Updating profile with:', updates);
    try {
      // Fixed: Ensure id is always set and not optional
      const profileData = {
        id: user.id, // Always set the ID explicitly
        full_name: updates.full_name || profile?.full_name || null,
        avatar_url: updates.avatar_url || profile?.avatar_url || null,
        updated_at: new Date().toISOString()
      };
      
      // If we have created_at from existing profile, include it
      if (profile?.created_at) {
        profileData.created_at = profile.created_at;
      } else {
        profileData.created_at = new Date().toISOString();
      }
      
      console.log('Final profile data to upsert:', profileData);
      
      const { data, error } = await supabase
        .from('profiles')
        .upsert(profileData, {
          onConflict: 'id',
          returning: 'minimal'
        });

      if (error) {
        console.error('Upsert error:', error);
        throw error;
      }
      
      // Refetch profile to ensure we have the updated data
      await fetchProfile(user.id);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const isAdmin = roles.includes('admin');

  const value = {
    session,
    user,
    profile,
    roles,
    isAdmin,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export type { AppRole };
