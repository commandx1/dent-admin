import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { VendorAPIItem } from './types';
import { Store, UserCircle } from 'lucide-react';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/useAuthStore';
import type { User } from '@/store/useAuthStore';
import { toast } from 'sonner';

interface VendorRowProps {
  vendor: VendorAPIItem;
}

export const VendorRow: React.FC<VendorRowProps> = ({ vendor }) => {
  const navigate = useNavigate();
  const { setImpersonation } = useAuthStore();
  const [isImpersonating, setIsImpersonating] = useState(false);

  const handleViewDetails = () => {
    navigate(`/vendors/${vendor.id}`);
  };

  const handleImpersonate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isImpersonating) return;

    try {
      setIsImpersonating(true);
      let response = await authService.impersonate(vendor.email);
      
      // If accessToken is missing but refreshToken is present, try to refresh the token
      if (!response.accessToken && response.refreshToken) {
        const refreshResponse = await authService.refreshToken(response.refreshToken);
        response = { ...response, ...refreshResponse };
      }

      if (response.accessToken && response.refreshToken) {
        // Construct User object from response or vendor data
        const userObj: User = {
          id: response.id || (response as any).userId || vendor.id,
          name: response.name || vendor.name,
          surname: response.surname || vendor.surname,
          email: response.email || vendor.email,
          phoneNumber: response.phoneNumber || vendor.phoneNumber,
          emailConfirmed: response.emailConfirmed ?? vendor.emailConfirmed,
          phoneNumberConfirmed: response.phoneNumberConfirmed ?? vendor.phoneNumberConfirmed,
          roleName: response.roleName || 'Vendor',
          twoFactorEnabled: response.twoFactorEnabled ?? vendor.twoFactorEnabled,
          createdDate: response.createdDate || vendor.createdDate,
          lockoutEnd: response.lockoutEnd || vendor.lockoutEnd,
        };

        setImpersonation(userObj, response.accessToken, response.refreshToken);
        toast.success(`Logged in as ${vendor.fullName}`);
        
        // Wait a bit for the toast and state update
        setTimeout(() => {
          window.location.href = '/';
        }, 500);
      } else {
        toast.error('Could not retrieve login credentials (accessToken)');
      }
    } catch (error) {
      console.error('Impersonation failed:', error);
      toast.error('Impersonation process failed');
    } finally {
      setIsImpersonating(false);
    }
  };

  const formattedDate = new Date(vendor.createdDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <tr 
      className="hover:bg-dark-elevated transition-all cursor-pointer border-b border-dark-border"
      onClick={handleViewDetails}
    >
      <td className="py-4 px-6 text-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent-primary/20 rounded-lg flex items-center justify-center">
            <Store className="text-accent-primary h-5 w-5" />
          </div>
          <div>
            <p className="text-slate-800 font-medium">{vendor.fullName || `${vendor.name} ${vendor.surname}`}</p>
            <p className="text-xs text-slate-500">ID: {vendor.id.slice(0, 8)}...</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-6 text-slate-700">{vendor.fullName || `${vendor.name} ${vendor.surname}`}</td>
      <td className="py-4 px-6 text-slate-700">{vendor.email}</td>
      <td className="py-4 px-6 text-slate-700">{vendor.phoneNumber}</td>
      <td className="py-4 px-6 text-center">
        <span className="text-slate-800 font-semibold">{vendor.totalProducts}</span>
      </td>
      <td className="py-4 px-6 text-center">
        <span className="text-accent-success font-semibold">{vendor.activeProducts}</span>
      </td>
      <td className="py-4 px-6 text-center">
        <span className="text-slate-800 font-semibold">0</span>
      </td>
      <td className="py-4 px-6 text-slate-500 text-sm">{formattedDate}</td>
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          <button 
            onClick={(e) => { e.stopPropagation(); handleViewDetails(); }}
            className="text-accent-primary hover:text-accent-primary/80 font-medium text-sm transition-colors"
          >
            Details
          </button>
          <button 
            onClick={handleImpersonate}
            disabled={isImpersonating}
            className="flex items-center gap-1 text-slate-500 hover:text-amber-600 font-medium text-sm transition-colors disabled:opacity-50"
            title="Impersonate as Vendor"
          >
            <UserCircle className="h-4 w-4" />
            {isImpersonating ? '...' : 'Impersonate'}
          </button>
        </div>
      </td>
    </tr>
  );
};

