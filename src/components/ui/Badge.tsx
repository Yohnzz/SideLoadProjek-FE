import React from 'react';

export type BadgeVariant = 'primary' | 'violet' | 'success' | 'warning' | 'danger' | 'neutral' | 'outline';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, { container: string; dot: string }> = {
  primary: {
    container: 'bg-[#EFF6FF] text-[#1D4ED8] border-[#DBEAFE]',
    dot: 'bg-[#2373FB]',
  },
  violet: {
    container: 'bg-[#F3E8FF] text-[#6A3DFB] border-[#E9D5FF]',
    dot: 'bg-[#6A3DFB]',
  },
  success: {
    container: 'bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]',
    dot: 'bg-[#16A34A]',
  },
  warning: {
    container: 'bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]',
    dot: 'bg-[#D97706]',
  },
  danger: {
    container: 'bg-[#FEE2E2] text-[#B91C1C] border-[#FECACA]',
    dot: 'bg-[#DC2626]',
  },
  neutral: {
    container: 'bg-[#F0F1F5] text-[#737887] border-[#E5E7EB]',
    dot: 'bg-[#9CA3AF]',
  },
  outline: {
    container: 'bg-white text-[#171923] border-[#E5E7EB]',
    dot: 'bg-[#737887]',
  },
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'text-[11px] px-2 py-0.5 gap-1.5 rounded-[6px]',
  md: 'text-xs px-2.5 py-1 gap-1.5 rounded-[8px]',
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'sm',
  dot = false,
  className = '',
  children,
  ...props
}) => {
  const currentVariant = variantStyles[variant];

  return (
    <span
      className={`inline-flex items-center font-medium border leading-none shrink-0 ${currentVariant.container} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${currentVariant.dot}`} />}
      <span>{children}</span>
    </span>
  );
};

