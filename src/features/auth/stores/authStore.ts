/**
 * 인증 상태 관리 Zustand Store
 * localStorage에 persist하여 새로고침 시에도 로그인 상태 유지
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types/auth.types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  login: (token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,

      // Actions
      login: (token: string) => {
        set({ token, isAuthenticated: true });
      },

      setUser: (user: User) => {
        set({ user });
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage', // localStorage 키 이름
    }
  )
);
