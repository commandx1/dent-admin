import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Vendor } from './types';
import { Store } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';

interface VendorRowProps {
  vendor: Vendor;
}

export const VendorRow: React.FC<VendorRowProps> = ({ vendor }) => {
  const navigate = useNavigate();
  const [status, setStatus] = useState(vendor.status);

  const handleViewDetails = () => {
    navigate(`/vendors/${vendor.id}`);
  };

  const handleStatusToggle = () => {
    const nextStatus = status === 'Approved' ? 'Pending' : 'Approved';
    setStatus(nextStatus);
  };

  return (
    <tr 
      className="hover:bg-dark-elevated transition-all cursor-pointer border-b border-dark-border"
      onClick={handleViewDetails}
    >
      <td className="py-4 px-6 text-gray-300">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-accent-primary/20 rounded-lg flex items-center justify-center">
            <Store className="text-accent-primary h-5 w-5" />
          </div>
          <div>
            <p className="text-white font-medium">{vendor.name}</p>
            <p className="text-xs text-gray-400">Vendor ID: {vendor.vendorId}</p>
          </div>
        </div>
      </td>
      <td className="py-4 px-6 text-gray-300">{vendor.contactPerson}</td>
      <td className="py-4 px-6 text-gray-300">{vendor.email}</td>
      <td className="py-4 px-6 text-gray-300">{vendor.phone}</td>
      <td className="py-4 px-6">
        <span className="text-white font-semibold">{vendor.totalProducts}</span>
      </td>
      <td className="py-4 px-6">
        <span className="text-accent-success font-semibold">{vendor.activeProducts}</span>
      </td>
      <td className="py-4 px-6">
        <span className="text-white font-semibold">{vendor.soldCount.toLocaleString()}</span>
      </td>
      <td className="py-4 px-6 text-gray-400 text-sm">{vendor.memberSince}</td>
      <td className="py-4 px-6">
        <StatusBadge 
          status={status}
          type={status === 'Approved' ? 'success' : status === 'Pending' ? 'warning' : 'danger'}
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

