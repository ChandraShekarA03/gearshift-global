"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  dbUser: any | null; // User from our database
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  isVendor: boolean;
  isCustomer: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [dbUser, setDbUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper functions to check user roles
  const isVendor = dbUser?.role === 'Vendor';
  const isCustomer = dbUser?.role === 'Customer';
  const isAdmin = dbUser?.role === 'Admin';

  // Sync user with database via API
  const syncUserWithDatabase = async (userData: {
    id: string;
    email: string;
    name?: string;
    avatar?: string;
    metadata?: any;
  }) => {
    try {
      const response = await fetch('/api/auth/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userData.id,
          email: userData.email,
          metadata: userData.metadata
        }),
      });
      
      const result = await response.json();
      if (result.user) {
        setDbUser(result.user);
      }
      return result;
    } catch (error) {
      console.error('Error syncing user with database:', error);
      throw error;
    }
  };

  const fetchDbUser = async (authUser: User) => {
    try {
      const response = await fetch(`/api/auth/sync?email=${encodeURIComponent(authUser.email!)}`);
      const result = await response.json();
      if (result.user) {
        setDbUser(result.user);
        return result.user;
      }
    } catch (error) {
      console.error('Error fetching database user:', error);
    }
    return null;
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // Sync user with database if authenticated
      if (session?.user) {
        syncUserWithDatabase({
          id: session.user.id,
          email: session.user.email!,
          name: session.user.user_metadata?.name,
          avatar: session.user.user_metadata?.avatar_url,
          metadata: session.user.user_metadata
        }).then(() => {
          fetchDbUser(session.user);
        }).catch(error => {
          console.error('Error syncing user on session load:', error);
        });
      }
      
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        try {
          await syncUserWithDatabase({
            id: session.user.id,
            email: session.user.email!,
            name: session.user.user_metadata?.name,
            avatar: session.user.user_metadata?.avatar_url,
            metadata: session.user.user_metadata
          });
          await fetchDbUser(session.user);
        } catch (error) {
          console.error('Error syncing user on auth change:', error);
        }
      } else {
        setDbUser(null);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error: error?.message };
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata || {}
      }
    });
    return { error: error?.message };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setDbUser(null);
  };

  const value = {
    user,
    session,
    dbUser,
    loading,
    signIn,
    signUp,
    signOut,
    isVendor,
    isCustomer,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}