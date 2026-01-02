import React from 'react';
import { Button } from '@/components/ui/button';
import type { Dentist } from './types';
import { ChevronDown, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DentistRowProps {
  dentist: Dentist;
  onOpenLocations: (dentist: Dentist) => void;
}

export const DentistRow: React.FC<DentistRowProps> = ({
  dentist,
  onOpenLocations,
}) => {
  const navigate = useNavigate();

  const formattedLastLogin = dentist.lastLogin 
    ? new Date(dentist.lastLogin).toLocaleString()
    : 'Never';

  const avatarSrc = dentist.profilePhotoData 
    ? `data:image/png;base64,${dentist.profilePhotoData}`
    : `https://ui-avatars.com/api/?name=${dentist.firstName}+${dentist.lastName}&background=random`;

  return (
    <tr
      className="border-b border-dark-border hover:bg-dark-elevated/50 transition-all"
    >
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <img src={avatarSrc} alt={dentist.firstName} className="w-10 h-10 rounded-full object-cover" />
          <span className="text-slate-800 font-medium">{dentist.firstName}</span>
        </div>
      </td>
      <td className="py-4 px-4 text-slate-700">{dentist.lastName}</td>
      <td className="py-4 px-4">
        <div>
          <p className="text-slate-800 font-medium">{dentist.companyName}</p>
          <p className="text-xs text-slate-500">{dentist.accountStatus || 'Active'}</p>
        </div>
      </td>
      <td className="py-4 px-4">
        <a
          href={`mailto:${dentist.email}`}
          className="text-accent-primary hover:underline text-sm"
          onClick={(e) => e.stopPropagation()}
        >
          {dentist.email}
        </a>
      </td>
      <td className="py-4 px-4">
        <span className="text-slate-700 text-sm">{dentist.phone}</span>
      </td>
      <td className="py-4 px-4">
        <button
          onClick={(e) => { e.stopPropagation(); onOpenLocations(dentist); }}
          className="flex items-center gap-2 text-accent-primary hover:text-accent-primary/80"
        >
          <span className="font-semibold">{dentist.locationCount}</span>
          <ChevronDown className="h-4 w-4" />
        </button>
      </td>
      <td className="py-4 px-4">
        <div>
          <p className="text-slate-800 text-sm">{formattedLastLogin}</p>
        </div>
      </td>
      <td className="py-4 px-4">
        <Button
          onClick={() => navigate(`/dentists/${dentist.userId}`)}
          variant="outline"
          size="sm"
          className="bg-dark-elevated border-none hover:bg-dark-border text-slate-800 text-xs"
        >
          <ExternalLink className="h-3 w-3 mr-1" /> View Details
        </Button>
      </td>
    </tr>
  );
};

