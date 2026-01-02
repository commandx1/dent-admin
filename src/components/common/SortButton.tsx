import React from 'react';
import { ArrowUpDown, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SortButtonProps {
  label: string;
  onClick?: () => void;
  isActive?: boolean;
  icon?: LucideIcon;
  className?: string;
}

export const SortButton: React.FC<SortButtonProps> = ({
  label,
  onClick,
  isActive = false,
  icon: Icon = ArrowUpDown,
  className
}) => {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 text-sm font-semibold hover:text-slate-900 transition-all",
        isActive ? "text-slate-900" : "text-slate-700",
        className
      )}
    >
      {label}
      <Icon className={cn(
        "h-4 w-4",
        isActive ? "text-accent-primary" : "text-slate-500"
      )} />
    </button>
  );
};

