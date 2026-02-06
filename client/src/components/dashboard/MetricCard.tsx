import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  trend?: number;
  trendLabel?: string;
  icon?: React.ElementType;
  className?: string;
  loading?: boolean;
}

export function MetricCard({ 
  title, 
  value, 
  trend, 
  trendLabel = "vs last month", 
  icon: Icon,
  className,
  loading = false
}: MetricCardProps) {
  if (loading) {
    return (
      <div className={cn("rounded-2xl bg-card p-6 shadow-sm border border-border animate-pulse h-[140px]", className)}>
        <div className="flex justify-between items-start">
          <div className="h-4 w-24 bg-muted rounded mb-4" />
          <div className="h-8 w-8 bg-muted rounded-full" />
        </div>
        <div className="h-8 w-32 bg-muted rounded mb-2" />
        <div className="h-4 w-16 bg-muted rounded" />
      </div>
    );
  }

  const isPositive = trend && trend > 0;
  const isNeutral = trend === 0;

  return (
    <div className={cn(
      "rounded-2xl bg-card p-6 shadow-lg shadow-black/5 border border-border hover:shadow-xl transition-all duration-300 group",
      className
    )}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {Icon && (
          <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      
      <div className="flex flex-col gap-1">
        <span className="text-2xl font-bold font-display tracking-tight text-foreground">
          {value}
        </span>
        
        {trend !== undefined && (
          <div className="flex items-center gap-2 text-sm">
            <span className={cn(
              "flex items-center gap-0.5 font-medium px-1.5 py-0.5 rounded-full text-xs",
              isPositive ? "text-green-600 bg-green-50 dark:bg-green-500/10 dark:text-green-400" : 
              isNeutral ? "text-gray-600 bg-gray-50 dark:bg-gray-500/10 dark:text-gray-400" :
              "text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-400"
            )}>
              {isPositive ? <ArrowUpRight className="w-3 h-3" /> : 
               isNeutral ? <Minus className="w-3 h-3" /> : 
               <ArrowDownRight className="w-3 h-3" />}
              {Math.abs(trend)}%
            </span>
            <span className="text-muted-foreground text-xs">{trendLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
}
