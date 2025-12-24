import { cn } from '@/lib/utils'
import { ArrowUp, ArrowDown } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  iconColor: string
  trend?: {
    value: string
    isUp: boolean
  }
  footerLabel?: string
  footerValue?: string | number
}

export const StatCard = ({
  title,
  value,
  icon: Icon,
  iconColor,
  trend,
  footerLabel,
  footerValue
}: StatCardProps) => {
  return (
    <div className="bg-dark-elevated rounded-lg p-5 border border-dark-elevated">
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-400 text-sm">{title}</span>
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center bg-opacity-20", iconColor)}>
          <Icon className={cn("h-5 w-5", iconColor.replace('bg-', 'text-').replace('/20', ''))} />
        </div>
      </div>
      <p className="text-3xl font-bold text-white mb-2">{value}</p>
      
      {trend && (
        <div className="flex items-center gap-2 text-sm">
          <span className={cn(
            "flex items-center gap-1",
            trend.isUp ? "text-accent-success" : "text-accent-danger"
          )}>
            {trend.isUp ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
            {trend.value}
          </span>
          <span className="text-gray-500">vs last month</span>
        </div>
      )}

      {footerLabel && (
        <div className="mt-3 pt-3 border-t border-dark-elevated">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">{footerLabel}</span>
            <span className="text-accent-success font-medium">{footerValue}</span>
          </div>
        </div>
      )}
    </div>
  )
}
