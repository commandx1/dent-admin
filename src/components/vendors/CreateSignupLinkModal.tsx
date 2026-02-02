import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Mail, Link as LinkIcon, CheckCircle2, AlertCircle, Copy } from 'lucide-react';
import { vendorService } from '@/services/vendorService';

interface CreateSignupLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateSignupLinkModal: React.FC<CreateSignupLinkModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    signupLink: string;
    message: string;
    userAlreadyExists: boolean;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const data = await vendorService.createSignupLink(email);
      setResult(data);
    } catch (err: unknown) {
      const errorData = err as { response?: { data?: { message?: string } } };
      setError(errorData.response?.data?.message || 'Failed to create signup link');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (result?.signupLink) {
      navigator.clipboard.writeText(result.signupLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const resetAndClose = () => {
    setEmail('');
    setResult(null);
    setError(null);
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-900">Create Vendor Signup Link</h2>
          <button onClick={resetAndClose} className="p-2 hover:bg-slate-200 rounded-xl transition-colors text-slate-400">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {!result ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wider ml-1">Vendor Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    required
                    type="email"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-accent-primary/20 focus:border-accent-primary outline-none transition-all font-medium"
                    placeholder="vendor@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-2xl bg-red-50 text-red-700 border border-red-200 flex items-center gap-3">
                  <AlertCircle size={20} />
                  <p className="text-sm font-bold">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-accent-primary hover:opacity-90 text-white font-black rounded-2xl transition-all uppercase tracking-widest text-sm shadow-lg shadow-accent-primary/25 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-75" />
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-150" />
                  </div>
                ) : <LinkIcon size={20} />}
                {isLoading ? 'Creating...' : 'Create Link'}
              </button>
            </form>
          ) : (
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 size={32} />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900">{result.message}</h3>
                {result.userAlreadyExists && (
                  <p className="text-sm text-amber-600 font-medium">Note: A user with this email already exists.</p>
                )}
              </div>

              <div className="space-y-2 text-left">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Signup Link</label>
                <div className="flex gap-2">
                  <div className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-600 truncate">
                    {result.signupLink}
                  </div>
                  <button
                    onClick={handleCopy}
                    className="p-3 bg-accent-primary text-white rounded-xl hover:opacity-90 transition-all flex items-center justify-center"
                    title="Copy to clipboard"
                  >
                    {copied ? <CheckCircle2 size={20} /> : <Copy size={20} />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    let token = '';
                    try {
                      const url = new URL(result.signupLink);
                      token = url.searchParams.get('token') || url.searchParams.get('refreshToken') || '';
                    } catch {
                      // Fallback if it's just a relative path or token
                      const match = result.signupLink.match(/[?&](?:token|refreshToken)=([^&]+)/);
                      token = match ? match[1] : result.signupLink;
                    }
                    
                    const b2bUrl = import.meta.env.VITE_B2B_URL;
                    window.open(`${b2bUrl}/auth/setup-vendor?refreshToken=${token}`, '_blank');
                  }}
                  className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-2xl transition-all uppercase tracking-widest text-sm shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2"
                >
                  <LinkIcon size={20} />
                  Setup Account Now
                </button>
              </div>

              <button
                onClick={resetAndClose}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl transition-all"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
