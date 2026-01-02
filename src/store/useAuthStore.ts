import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  name: string
  surname: string
  email: string
  phoneNumber: string
  emailConfirmed: boolean
  phoneNumberConfirmed: boolean
  roleName: string | null
  twoFactorEnabled: boolean
  createdDate?: string
  lockoutEnd?: string | null
}

interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  setAuth: (user: User, token: string, refreshToken: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      setAuth: (user, token, refreshToken) => set({ user, token, refreshToken, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, refreshToken: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
)
