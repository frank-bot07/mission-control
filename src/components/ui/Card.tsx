import { clsx } from 'clsx';
import { ReactNode } from 'react';

interface CardProps {
  title?: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  headerAction?: ReactNode;
}

export function Card({ title, icon, children, className, headerAction }: CardProps) {
  return (
    <div className={clsx(
      'bg-[#111118] border border-[#27272a] rounded-lg overflow-hidden card-hover',
      className
    )}>
      {title && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#27272a]">
          <div className="flex items-center gap-2">
            {icon && <span className="text-[#71717a]">{icon}</span>}
            <h3 className="text-sm font-semibold text-[#a1a1aa] uppercase tracking-wide">{title}</h3>
          </div>
          {headerAction}
        </div>
      )}
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}

interface MetricProps {
  label: string;
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Metric({ label, value, trend, trendValue, size = 'md' }: MetricProps) {
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  const trendColors = {
    up: 'text-green-400',
    down: 'text-red-400',
    neutral: 'text-[#71717a]'
  };

  const trendArrows = {
    up: '↑',
    down: '↓',
    neutral: '→'
  };

  return (
    <div>
      <p className="text-xs text-[#71717a] uppercase tracking-wide mb-1">{label}</p>
      <div className="flex items-baseline gap-2">
        <span className={clsx('font-bold text-white', sizeClasses[size])}>{value}</span>
        {trend && (
          <span className={clsx('text-sm font-medium', trendColors[trend])}>
            {trendArrows[trend]} {trendValue}
          </span>
        )}
      </div>
    </div>
  );
}

interface StatusIndicatorProps {
  status: 'green' | 'yellow' | 'red' | 'blue';
  label: string;
  value?: string;
}

export function StatusIndicator({ status, label, value }: StatusIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      <span className={`status-dot status-${status}`} />
      <span className="text-sm text-[#a1a1aa]">{label}</span>
      {value && <span className="text-sm text-white ml-auto">{value}</span>}
    </div>
  );
}

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: 'green' | 'yellow' | 'red' | 'blue';
  showLabel?: boolean;
  label?: string;
}

export function ProgressBar({ value, max = 100, color = 'blue', showLabel = true, label }: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);
  
  const colorClasses = {
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    blue: 'bg-blue-500'
  };

  return (
    <div>
      {label && <p className="text-xs text-[#71717a] mb-1">{label}</p>}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-2 bg-[#27272a] rounded-full overflow-hidden">
          <div 
            className={clsx('h-full rounded-full transition-all duration-500', colorClasses[color])}
            style={{ width: `${percentage}%` }}
          />
        </div>
        {showLabel && <span className="text-xs text-[#71717a] w-10 text-right">{value}%</span>}
      </div>
    </div>
  );
}
