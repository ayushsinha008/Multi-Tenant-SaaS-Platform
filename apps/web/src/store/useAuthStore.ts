import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../lib/axios';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  activeWorkspaceId: string | null;
  setUser: (user: User | null) => void;
  setActiveWorkspace: (id: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      activeWorkspaceId: null,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setActiveWorkspace: (id) => set({ activeWorkspaceId: id }),
      logout: () => {
        set({ user: null, isAuthenticated: false, activeWorkspaceId: null });
        api.post('/auth/logout').catch(console.error); // Best effort logout API call
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
