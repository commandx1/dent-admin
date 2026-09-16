import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import type { User } from '@/store/useAuthStore';

interface LoginRequest {
  email: string;
  password: string;
  device?: string;
}

interface LoginResponse {
  timestamp?: string;
  message?: string;
  status?: number;
  twoFactorRequired?: boolean;
  // Successful login fields (from response-2)
  id?: string;
  name?: string;
  surname?: string;
  email?: string;
  phoneNumber?: string;
  emailConfirmed?: boolean;
  phoneNumberConfirmed?: boolean;
  roleName?: string | null;
  twoFactorEnabled?: boolean;
  createdDate?: string;
  lockoutEnd?: string | null;
  // Tokens (standard expected)
  accessToken?: string;
  refreshToken?: string;
  impersonateLink?: string;
}

interface Verify2FARequest {
  email: string;
  code: string;
  device?: string;
}

interface Verify2FAResponse extends User {
  accessToken?: string;
  refreshToken?: string;
}

export const authService = {
  login: async (credentials: LoginRequest) => {
    const response = await api.post<LoginResponse>('/api/auth/login', {
      ...credentials,
      device: credentials.device || 'web'
    });

    const headers = response.headers;
    const authHeader = headers['authorization'] || headers['Authorization'];

    if (authHeader) {
      const token = authHeader.replace('Bearer ', '').trim();
      response.data.accessToken = token;
    }

    return response.data;
  },

  verify2FA: async (data: Verify2FARequest) => {
    const response = await api.post<Verify2FAResponse>('/api/auth/login/verify-2fa', {
      ...data,
      device: data.device || 'web'
    });

    const headers = response.headers;
    const authHeader = headers['authorization'] || headers['Authorization'];

    if (authHeader) {
      const token = authHeader.replace('Bearer ', '').trim();
      response.data.accessToken = token;
    }

    return response.data;
  },

  logout: async (refreshToken: string) => {
    document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    await api.post('/api/auth/logout', { refreshToken });
  },

  impersonate: async (email: string) => {
    // Safety net: dt-admin-api's dentb2b pool is capped at 2 connections, so only one
    // impersonation request may be in flight at a time across the whole admin UI.
    if (useAuthStore.getState().impersonatingEmail !== null) {
      throw new Error('Another impersonation is already in progress');
    }

    useAuthStore.getState().setImpersonatingEmail(email);
    try {
      const response = await api.post<LoginResponse>('/api/v1/vendors/impersonate?email=' + email);

      const headers = response.headers;
      const authHeader = headers['authorization'] || headers['Authorization'];

      if (authHeader) {
        const token = authHeader.replace('Bearer ', '').trim();
        response.data.accessToken = token;
      }

      return response.data;
    } finally {
      useAuthStore.getState().setImpersonatingEmail(null);
    }
  },

  refreshToken: async (token?: string) => {
    if (token) {
      authService.setRefreshTokenCookie(token);
    }
    const response = await api.post<LoginResponse>('/api/auth/refresh-token');

    const headers = response.headers;
    const authHeader = headers['authorization'] || headers['Authorization'];

    if (authHeader) {
      const token = authHeader.replace('Bearer ', '').trim();
      response.data.accessToken = token;
    }

    return response.data;
  },

  setRefreshTokenCookie: (token: string) => {
    document.cookie = `refreshToken=${token}; Path=/; SameSite=Lax`;
  }
};
