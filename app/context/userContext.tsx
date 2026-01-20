"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import { useQueryClient } from '@tanstack/react-query';

interface Utilisateur {
  id: number;
  nom: string;
  email: string;
  role?: string;
}

interface UserContextType {
  utilisateur: Utilisateur | null;
  isAdmin: boolean;
  isLoading: boolean;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { data: user, isLoading } = useCurrentUser();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Map the user data from useCurrentUser to our format
  const utilisateur: Utilisateur | null = user ? {
    id: user.userId,
    nom: user.name,
    email: user.email,
    role: user.role,
  } : null;

  const isAdmin = utilisateur?.role?.toLowerCase() === 'admin';

  const logout = async () => {
    try {
      // Call logout API
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      
      // Clear all queries
      queryClient.clear();
      
      // Remove token cookie
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      
      // Redirect to login
      router.push('/connexion');
    } catch (error) {
      console.error('Logout error:', error);
      // Still redirect even if logout fails
      router.push('/connexion');
    }
  };

  return (
    <UserContext.Provider value={{ utilisateur, isAdmin, isLoading, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
