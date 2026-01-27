import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { LogOut, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { authService } from '@/services/authService';

export const ImpersonationBanner = () => {
  const { isImpersonating, user, stopImpersonation, adminData } = useAuthStore();

  if (!isImpersonating || !user) return null;

  const handleStopImpersonation = () => {
    const backupRefreshToken = adminData?.refreshToken;
    stopImpersonation();
    
    if (backupRefreshToken) {
      authService.setRefreshTokenCookie(backupRefreshToken);
    }

    toast.success('Returned to admin session');
    // Refresh to clear any vendor-specific states if necessary
    window.location.href = '/vendors';
  };

  return (
    <div className="bg-amber-500 text-white px-6 py-2 flex items-center justify-between shadow-md z-50">
      <div className="flex items-center gap-3">
        <div className="bg-white/20 p-1.5 rounded-full">
          <AlertTriangle className="h-4 w-4 text-white" />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
          <span className="font-semibold text-sm">
            You are currently acting as <span className="underline decoration-2 underline-offset-4 font-bold">{user.name} {user.surname}</span> ({user.email}).
          </span>
          <span className="text-xs bg-black/20 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
            Impersonation Active
          </span>
        </div>
      </div>
      <Button 
        onClick={handleStopImpersonation}
        variant="secondary" 
        size="sm"
        className="bg-white text-amber-600 hover:bg-amber-50 font-bold border-none h-8"
      >
        <LogOut className="h-3.5 w-3.5 mr-2" />
        Return to Admin Panel
      </Button>
    </div>
  );
};
