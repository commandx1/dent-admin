import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SortButtonProps {
  label: string;
  onClick?: () => void;
  isActive?: boolean;
  direction?: 'asc' | 'desc';
  icon?: LucideIcon;
  className?: string;
}

export const SortButton: React.FC<SortButtonProps> = ({
  label,
  onClick,
  isActive = false,
  direction,
  icon: Icon,
  className
}) => {
  // Determine which icon to show
  const getIcon = () => {
    if (Icon) return <Icon className={cn("h-4 w-4", isActive ? "text-accent-primary" : "text-slate-500")} />;
    
    if (!isActive) return <ArrowUpDown className="h-4 w-4 text-slate-400" />;
    
    if (direction === 'asc') return <ArrowUp className="h-4 w-4 text-accent-primary" />;
    if (direction === 'desc') return <ArrowDown className="h-4 w-4 text-accent-primary" />;
    
    return <ArrowUpDown className="h-4 w-4 text-accent-primary" />;
  };

  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 text-sm font-semibold hover:text-slate-900 transition-all group",
        isActive ? "text-slate-900" : "text-slate-600",
        className
      )}
    >
      {label}
      <span className="transition-transform duration-200">
        {getIcon()}
      </span>
    </button>
  );
};

