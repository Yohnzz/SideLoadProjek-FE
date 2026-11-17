import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'rectangular' | 'circular' | 'rounded';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rounded',
  className = '',
  ...props
}) => {
  const variantStyles = {
    rectangular: 'rounded-none',
    circular: 'rounded-full',
    rounded: 'rounded-[10px]',
  };

  return (
    <div
      className={`animate-pulse bg-[#E4E6EB] ${variantStyles[variant]} ${className}`}
      {...props}
    />
  );
};

