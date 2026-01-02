import api from '@/lib/api';
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

    // Extract token from header if not in body
    const authHeader = response.headers['Authorization'];
    if (authHeader && !response.data.accessToken) {
      response.data.accessToken = authHeader.replace('Bearer ', '');
    }

    return response.data;
  },

  verify2FA: async (data: Verify2FARequest) => {
    const response = await api.post<Verify2FAResponse>('/api/auth/login/verify-2fa', {
      ...data,
      device: data.device || 'web'
    });

    // Extract token from header if not in body
    const authHeader = response.headers['Authorization'];
    if (authHeader && !response.data.accessToken) {
      response.data.accessToken = authHeader.replace('Bearer ', '');
    }

    return response.data;
  },

  logout: async (refreshToken: string) => {
    await api.post('/api/auth/logout', { refreshToken });
  }
};

