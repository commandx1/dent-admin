import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { Technician } from './types';
import { Eye, Edit, MoreVertical, Star, ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TechnicianRowProps {
  technician: Technician;
  isSubTechnician?: boolean;
}

export const TechnicianRow: React.FC<TechnicianRowProps> = ({ 
  technician, 
  isSubTechnician = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasSubTechs = technician.type === 'Company' && technician.subTechnicians && technician.subTechnicians.length > 0;

  return (
    <>
      <tr 
        className={cn(
          "border-b border-dark-border transition-all cursor-pointer relative",
          isSubTechnician ? "bg-dark-elevated/20 border-l-4 border-l-accent-primary/50" : "hover:bg-dark-elevated/50",
          isExpanded && "bg-dark-elevated/30 border-l-4 border-l-accent-primary"
        )}
        onClick={() => hasSubTechs && setIsExpanded(!isExpanded)}
      >
        <td className="py-4 px-4">
          {hasSubTechs && (
            <button className="text-gray-400 hover:text-white transition-colors">
              {isExpanded ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5" />
              )}
            </button>
          )}
        </td>
        <td className="py-4 px-4">
          <div className={cn("flex items-center gap-3", isSubTechnician && "pl-4")}>
            <img src={technician.avatar} alt={technician.name} className="w-10 h-10 rounded-full border border-dark-border" />
            <div>
              <p className="text-white font-medium">{technician.name}</p>
              <p className="text-xs text-gray-400">ID: {technician.id}</p>
            </div>
          </div>
        </td>
        <td className="py-4 px-4">
          <span className={`px-2 py-1 rounded-full text-xs ${
            technician.type === 'Company' 
              ? 'bg-accent-primary/20 text-accent-primary' 
              : 'bg-accent-warning/20 text-accent-warning'
          }`}>
            {technician.type}
          </span>
        </td>
        <td className="py-4 px-4">
          <p className="text-white text-sm">{technician.companyName || (isSubTechnician ? '—' : 'Independent')}</p>
        </td>
        <td className="py-4 px-4">
          <p className="text-white text-sm">{technician.email}</p>
          <p className="text-xs text-gray-400">{technician.phone}</p>
        </td>
        <td className="py-4 px-4">
          <p className="text-white font-semibold text-lg">{technician.jobsCompleted}</p>
          <p className="text-xs text-gray-400">This month: {technician.jobsThisMonth}</p>
        </td>
        <td className="py-4 px-4">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-accent-warning fill-accent-warning" />
            <span className="text-white font-medium">{technician.rating}</span>
            <span className="text-xs text-gray-400">({technician.reviewsCount})</span>
          </div>
        </td>
        <td className="py-4 px-4">
          <span className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 w-fit ${
            technician.status === 'Active'
              ? 'bg-accent-success/20 text-accent-success'
              : 'bg-gray-500/20 text-gray-400'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              technician.status === 'Active' ? 'bg-accent-success' : 'bg-gray-400'
            }`}></span>
            {technician.status}
          </span>
        </td>
        <td className="py-4 px-4">
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" title="View Details" className="h-8 w-8 text-gray-400 hover:text-accent-primary hover:bg-accent-primary/10">
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" title="Edit" className="h-8 w-8 text-gray-400 hover:text-accent-warning hover:bg-accent-warning/10">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" title="More" className="h-8 w-8 text-gray-400 hover:text-accent-secondary hover:bg-accent-secondary/10">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </td>
      </tr>
      
      {/* Sub Technicians Rows */}
      {isExpanded && technician.subTechnicians?.map((subTech) => (
        <TechnicianRow key={subTech.id} technician={subTech} isSubTechnician />
      ))}
    </>
  );
};
