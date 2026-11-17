import React from 'react';

export type ProgressStatus = 'default' | 'success' | 'warning' | 'danger';
export type ProgressSize = 'sm' | 'md' | 'lg';

export interface ProgressBarProps {
  value?: number; // 0 to 100
  indeterminate?: boolean;
  status?: ProgressStatus;
  size?: ProgressSize;
  label?: string;
  helperText?: string;
  showPercentage?: boolean;
  className?: string;
}

const statusColors: Record<ProgressStatus, string> = {
  default: 'bg-[#2373FB]',
  success: 'bg-[#16A34A]',
  warning: 'bg-[#D97706]',
  danger: 'bg-[#DC2626]',
};

const sizeClasses: Record<ProgressSize, string> = {
  sm: 'h-1.5 rounded-full',
  md: 'h-2.5 rounded-full',
  lg: 'h-4 rounded-[8px]',
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value = 0,
  indeterminate = false,
  status = 'default',
  size = 'md',
  label,
  helperText,
  showPercentage = true,
  className = '',
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className={`w-full flex flex-col gap-1.5 select-none ${className}`}>
      {(label || showPercentage || helperText) && (
        <div className="flex items-center justify-between text-xs">
          {label && <span className="font-semibold text-[#171923]">{label}</span>}
          {showPercentage && !indeterminate && (
            <span className="font-medium text-[#737887] ml-auto">{Math.round(clampedValue)}%</span>
          )}
        </div>
      )}

      <div className={`w-full bg-[#E5E7EB] overflow-hidden ${sizeClasses[size]}`}>
        {indeterminate ? (
          <div
            className={`h-full ${statusColors[status]} w-1/3 animate-pulse rounded-full`}
            style={{
              animation: 'progress-indeterminate 1.5s infinite ease-in-out',
            }}
          />
        ) : (
          <div
            className={`h-full ${statusColors[status]} transition-all duration-300 ease-out`}
            style={{ width: `${clampedValue}%` }}
          />
        )}
      </div>

      {helperText && <p className="text-[11px] text-[#737887]">{helperText}</p>}
    </div>
  );
};

