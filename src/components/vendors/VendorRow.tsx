import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { VendorAPIItem } from './types';
import { Store } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

interface VendorRowProps {
  vendor: VendorAPIItem;
}

export const VendorRow: React.FC<VendorRowProps> = ({ vendor }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/vendors/${vendor.id}`);
  };

  const handleStatusToggle = () => {
    // Status toggle logic if needed, API not explicitly provided for this yet
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
        <StatusBadge 
          status={vendor.lockoutEnabled ? 'Locked' : 'Active'}
          type={vendor.lockoutEnabled ? 'danger' : 'success'}
          onToggle={handleStatusToggle}
        />
      </td>
      <td className="py-4 px-6">
        <button 
          onClick={(e) => { e.stopPropagation(); handleViewDetails(); }}
          className="text-accent-primary hover:text-accent-primary/80 font-medium text-sm transition-colors"
        >
          View Details
        </button>
      </td>
    </tr>
  );
};

