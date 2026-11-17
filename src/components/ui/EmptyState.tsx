import React from 'react';
import { PackageOpen } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionText,
  onAction,
  secondaryActionText,
  onSecondaryAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 rounded-[16px] border border-dashed border-[#E5E7EB] bg-white ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-[#F0F1F5] flex items-center justify-center text-[#737887] mb-4">
        {icon || <PackageOpen className="w-6 h-6 stroke-[1.75]" />}
      </div>
      <h3 className="text-base font-semibold text-[#171923] tracking-tight">{title}</h3>
      {description && (
        <p className="text-xs text-[#737887] max-w-sm mt-1.5 leading-relaxed">{description}</p>
      )}
      {(actionText || secondaryActionText) && (
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          {actionText && onAction && (
            <Button variant="primary" size="sm" onClick={onAction}>
              {actionText}
            </Button>
          )}
          {secondaryActionText && onSecondaryAction && (
            <Button variant="outline" size="sm" onClick={onSecondaryAction}>
              {secondaryActionText}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

