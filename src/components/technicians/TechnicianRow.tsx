import React, { useState, useMemo } from 'react';
import type { TableItem, Company, Technician } from './types';
import { Star, ChevronRight, ChevronDown, Building, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TechnicianRowProps {
  item: TableItem;
  isSubItem?: boolean;
}

export const TechnicianRow: React.FC<TechnicianRowProps> = ({ 
  item, 
  isSubItem = false 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isCompany = item.type === 'Company';
  const company = item as Company;
  const tech = item as Technician;

  const [isActive, setIsActive] = useState<boolean>(!isCompany && tech.status === 'Active');

  const handleStatusToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLoading) return;

    setIsLoading(true);
    // Simulating API call
    setTimeout(() => {
      setIsActive(!isActive);
      setIsLoading(false);
    }, 1000);
  };

  const hasSubTechs = isCompany && company.technicians && company.technicians.length > 0;

  // Headquarter technician for company contact info
  const hqTech = useMemo(() => {
    if (!isCompany) return null;
    return company.technicians.find(t => t.type === 'Headquarter') || company.technicians[0];
  }, [isCompany, company]);

  // Aggregate stats for company
  const aggregateStats = useMemo(() => {
    if (!isCompany) return null;
    const totalJobs = company.technicians.reduce((sum, t) => sum + t.jobsCompleted, 0);
    const avgRating = company.technicians.reduce((sum, t) => sum + t.rating, 0) / company.technicians.length;
    const totalReviews = company.technicians.reduce((sum, t) => sum + t.reviewsCount, 0);
    const jobsThisMonth = company.technicians.reduce((sum, t) => sum + t.jobsThisMonth, 0);
    
    return {
      totalJobs,
      avgRating: avgRating.toFixed(1),
      totalReviews,
      jobsThisMonth
    };
  }, [isCompany, company]);

  return (
    <>
      <tr 
        className={cn(
          "border-b border-dark-border transition-all cursor-pointer relative",
          isSubItem ? "bg-dark-elevated/20 border-l-4 border-l-accent-primary/50" : "hover:bg-dark-elevated/50",
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
          <div className={cn("flex items-center gap-3", isSubItem && "pl-4")}>
            {isCompany ? (
              <div className="w-10 h-10 rounded-lg bg-accent-primary/20 flex items-center justify-center border border-accent-primary/30">
                <Building className="h-5 w-5 text-accent-primary" />
              </div>
            ) : (
              <img src={tech.avatar} alt={tech.name} className="w-10 h-10 rounded-full border border-dark-border" />
            )}
            <div>
              <p className="text-white font-medium">{isCompany ? company.companyName : tech.name}</p>
              <p className="text-xs text-gray-400">ID: {item.id}</p>
            </div>
          </div>
        </td>
        <td className="py-4 px-4">
          <span className={cn(
            "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
            isCompany && 'bg-accent-primary/20 text-accent-primary border border-accent-primary/20',
            !isCompany && tech.type === 'Headquarter' && 'bg-accent-secondary/20 text-accent-secondary border border-accent-secondary/20',
            !isCompany && tech.type === 'Member' && 'bg-dark-elevated text-gray-400 border border-dark-border',
            !isCompany && tech.type === 'Individual' && 'bg-accent-warning/20 text-accent-warning border border-accent-warning/20',
          )}>
            {item.type}
          </span>
        </td>
        <td className="py-4 px-4">
          <p className="text-white text-sm">
            {isCompany ? hqTech?.email : tech.email}
          </p>
          <p className="text-xs text-gray-400">
            {isCompany ? hqTech?.phone : tech.phone}
          </p>
        </td>
        <td className="py-4 px-4">
          <p className="text-white font-semibold text-lg">
            {isCompany ? aggregateStats?.totalJobs : tech.jobsCompleted}
          </p>
          <p className="text-xs text-gray-400">
            This month: {isCompany ? aggregateStats?.jobsThisMonth : tech.jobsThisMonth}
          </p>
        </td>
        <td className="py-4 px-4">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-accent-warning fill-accent-warning" />
            <span className="text-white font-medium">
              {isCompany ? aggregateStats?.avgRating : tech.rating}
            </span>
            <span className="text-xs text-gray-400">
              ({isCompany ? aggregateStats?.totalReviews : tech.reviewsCount})
            </span>
          </div>
        </td>
        <td className="py-4 px-4">
          {!isCompany && (
            <button 
              onClick={handleStatusToggle}
              disabled={isLoading}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2 transition-all w-fit min-w-[85px] justify-center",
                isLoading ? "bg-dark-elevated text-gray-400 cursor-not-allowed" : 
                isActive 
                  ? "bg-accent-success/20 text-accent-success hover:bg-accent-success/30 cursor-pointer" 
                  : "bg-accent-danger/20 text-accent-danger hover:bg-accent-danger/30 cursor-pointer"
              )}
            >
              {isLoading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <span className={cn(
                  "w-1.5 h-1.5 rounded-full shadow-sm",
                  isActive ? "bg-accent-success" : "bg-accent-danger"
                )}></span>
              )}
              {isLoading ? 'Updating...' : (isActive ? 'Active' : 'Inactive')}
            </button>
          )}
        </td>
      </tr>
      
      {/* Sub Technicians Rows */}
      {isExpanded && company.technicians?.map((subTech) => (
        <TechnicianRow key={subTech.id} item={subTech} isSubItem />
      ))}
    </>
  );
};
