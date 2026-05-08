import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { authService } from '@/services/authService';
import { Button } from '@/components/ui/button';
import { Mail, Lock, ShieldCheck, ArrowLeft } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [is2FARequired, setIs2FARequired] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await authService.login({ email, password });

      if (response.twoFactorRequired) {
        setIs2FARequired(true);
      } else if (response.id) {
        // Map response to User object
        const user = {
          id: response.id,
          name: response.name || '',
          surname: response.surname || '',
          email: response.email || email,
          phoneNumber: response.phoneNumber || '',
          emailConfirmed: response.emailConfirmed || false,
          phoneNumberConfirmed: response.phoneNumberConfirmed || false,
          roleName: response.roleName || null,
          twoFactorEnabled: response.twoFactorEnabled || false,
          createdDate: response.createdDate,
          lockoutEnd: response.lockoutEnd,
        };
        setAuth(user, response.accessToken || '', response.refreshToken || '');
        navigate(from, { replace: true });
      } else if (response.status === 400 && response.message) {
        setError(response.message);
      } else {
        setError('Login failed. Please check your credentials.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await authService.verify2FA({
        email,
        code: twoFactorCode,
      });

      if (response.id) {
        // The response extends User, so we can use it directly
        const { accessToken, refreshToken, ...user } = response;
        setAuth(user, accessToken || '', refreshToken || '');
        navigate(from, { replace: true });
      } else {
        setError('Verification code is invalid or expired.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-linear-to-br from-gray-300 to-white rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-accent-primary/20">
            <img src="/DentyProLogo.png" alt="DentyPro Logo" className="text-white h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">DentyPro Admin</h1>
          <p className="text-slate-500 mt-1">11Welcome to the management panel</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl flex items-center gap-3">
            <span className="w-1.5 h-1.5 bg-red-600 rounded-full shrink-0" />
            {error}
          </div>
        )}

        {!is2FARequired ? (
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary transition-all text-slate-900"
                  placeholder="admin@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary transition-all text-slate-900"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full py-6 rounded-xl bg-accent-primary hover:bg-accent-primary/90 text-white font-bold text-lg shadow-lg shadow-accent-primary/20 transition-all active:scale-[0.98] min-h-[60px]"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-75" />
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-150" />
                </div>
              ) : 'Login'}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerify2FA} className="space-y-5">
            <button
              type="button"
              onClick={() => setIs2FARequired(false)}
              className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors mb-4"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </button>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">2FA Verification Code</label>
              <div className="relative">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary transition-all text-slate-900"
                  placeholder="000000"
                  required
                />
              </div>
              <p className="text-xs text-slate-500 ml-1 mt-2">
                Enter the 6-digit code sent to your email address.
              </p>
            </div>

            <Button
              type="submit"
              className="w-full py-6 rounded-xl bg-accent-primary hover:bg-accent-primary/90 text-white font-bold text-lg shadow-lg shadow-accent-primary/20 transition-all active:scale-[0.98] min-h-[60px]"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-75" />
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-150" />
                </div>
              ) : 'Verify and Login'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

