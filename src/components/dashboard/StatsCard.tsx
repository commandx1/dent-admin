import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  trend: string
  trendType: 'up' | 'down'
  icon: LucideIcon
  iconColorClass: string
  bottomLabel: string
  bottomValue: string | number
}

export function StatsCard({
  title,
  value,
  trend,
  trendType,
  icon: Icon,
  iconColorClass,
  bottomLabel,
  bottomValue
}: StatsCardProps) {
  return (
    <div className="bg-dark-elevated rounded-lg p-5 border border-dark-elevated">
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-400 text-sm">{title}</span>
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center bg-opacity-20", iconColorClass.replace('text-', 'bg-'))}>
          <Icon className={cn("h-5 w-5", iconColorClass)} />
        </div>
      </div>
      <p className="text-3xl font-bold text-white mb-2">{value}</p>
      <div className="flex items-center gap-2 text-sm">
        <span className={cn(
          "flex items-center gap-1",
          trendType === 'up' ? "text-accent-success" : "text-accent-danger"
        )}>
          {trend}
        </span>
        <span className="text-gray-500">vs last month</span>
      </div>
      <div className="mt-3 pt-3 border-t border-dark-elevated">
        <div className="flex justify-between text-xs">
          <span className="text-gray-500">{bottomLabel}</span>
          <span className="text-accent-success font-medium">{bottomValue}</span>
        </div>
      </div>
    </div>
  )
}

