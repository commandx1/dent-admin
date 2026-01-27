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
  isImpersonating: boolean
  adminData: { user: User; token: string; refreshToken: string } | null
  setAuth: (user: User, token: string, refreshToken: string) => void
  setImpersonation: (user: User, token: string, refreshToken: string) => void
  stopImpersonation: () => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isImpersonating: false,
      adminData: null,
      setAuth: (user, token, refreshToken) => 
        set({ user, token, refreshToken, isAuthenticated: true, isImpersonating: false, adminData: null }),
      setImpersonation: (user, token, refreshToken) => 
        set((state) => ({
          adminData: state.isImpersonating ? state.adminData : (state.user ? { user: state.user, token: state.token!, refreshToken: state.refreshToken! } : null),
          user,
          token,
          refreshToken,
          isImpersonating: true,
        })),
      stopImpersonation: () => 
        set((state) => ({
          user: state.adminData?.user || null,
          token: state.adminData?.token || null,
          refreshToken: state.adminData?.refreshToken || null,
          isImpersonating: false,
          adminData: null,
        })),
      logout: () => 
        set({ user: null, token: null, refreshToken: null, isAuthenticated: false, isImpersonating: false, adminData: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
)
