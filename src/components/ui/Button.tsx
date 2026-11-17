import React from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[#2373FB] text-white hover:bg-[#1D5FD0] active:bg-[#3438D5] shadow-xs border border-[#2373FB] focus-visible:ring-2 focus-visible:ring-[#2373FB]/30',
  secondary:
    'bg-[#F0F1F5] text-[#171923] hover:bg-[#E4E6EB] active:bg-[#D1D5DB] border border-transparent focus-visible:ring-2 focus-visible:ring-[#2373FB]/20',
  outline:
    'bg-white text-[#171923] hover:bg-[#F7F8FA] active:bg-[#F0F1F5] border border-[#E5E7EB] hover:border-[#D1D5DB] shadow-xs focus-visible:ring-2 focus-visible:ring-[#2373FB]/20',
  ghost:
    'bg-transparent text-[#737887] hover:text-[#171923] hover:bg-[#F0F1F5] border border-transparent focus-visible:ring-2 focus-visible:ring-[#2373FB]/20',
  danger:
    'bg-[#DC2626] text-white hover:bg-[#B91C1C] active:bg-[#991B1B] shadow-xs border border-[#DC2626] focus-visible:ring-2 focus-visible:ring-[#DC2626]/30',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5 rounded-[8px]',
  md: 'h-10 px-4 text-sm gap-2 rounded-[10px]',
  lg: 'h-12 px-6 text-base gap-2.5 rounded-[12px]',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      className = '',
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyle =
      'inline-flex items-center justify-center font-medium transition-all duration-150 select-none outline-none disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]';

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

