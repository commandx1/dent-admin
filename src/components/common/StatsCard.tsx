import React from 'react';
import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isUp: boolean;
    color?: 'success' | 'warning' | 'danger' | 'primary';
  };
  footer?: string;
  accentColor?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  footer,
  accentColor = 'primary',
  className
}) => {
  const accentColors = {
    primary: 'bg-accent-primary/20 text-accent-primary hover:border-accent-primary',
    secondary: 'bg-accent-secondary/20 text-accent-secondary hover:border-accent-secondary',
    success: 'bg-accent-success/20 text-accent-success hover:border-accent-success',
    warning: 'bg-accent-warning/20 text-accent-warning hover:border-accent-warning',
    danger: 'bg-accent-danger/20 text-accent-danger hover:border-accent-danger',
  };

  const trendColors = {
    success: 'text-accent-success',
    warning: 'text-accent-warning',
    danger: 'text-accent-danger',
    primary: 'text-accent-primary',
  };

  return (
    <div className={cn(
      "bg-dark-surface border border-dark-border rounded-xl p-6 transition-all",
      accentColors[accentColor].split(' ').pop(), // Use hover color from accentColors
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        <div className={cn(
          "w-12 h-12 rounded-lg flex items-center justify-center",
          accentColors[accentColor].split(' ').slice(0, 2).join(' ')
        )}>
          <Icon className="h-6 w-6" />
        </div>
        {trend && (
          <span className={cn(
            "text-sm font-medium flex items-center gap-1",
            trend.color ? trendColors[trend.color] : trend.isUp ? 'text-accent-success' : 'text-accent-danger'
          )}>
            {trend.value}
          </span>
        )}
      </div>
      <h3 className="text-gray-400 text-sm mb-1">{title}</h3>
      <p className="text-3xl font-bold text-white">{value}</p>
      {description && <p className="text-sm text-gray-500 mt-2">{description}</p>}
      {footer && (
        <div className="mt-3 pt-3 border-t border-dark-border">
          <p className="text-xs text-gray-400">{footer}</p>
        </div>
      )}
    </div>
  );
};

