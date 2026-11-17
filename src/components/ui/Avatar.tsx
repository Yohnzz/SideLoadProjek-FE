import React from 'react';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps {
  src?: string | null;
  name?: string;
  size?: AvatarSize;
  status?: 'online' | 'offline' | 'busy';
  className?: string;
}

const sizeStyles: Record<AvatarSize, { container: string; text: string; dot: string }> = {
  xs: { container: 'w-6 h-6', text: 'text-[10px]', dot: 'w-1.5 h-1.5' },
  sm: { container: 'w-8 h-8', text: 'text-xs', dot: 'w-2 h-2' },
  md: { container: 'w-10 h-10', text: 'text-sm', dot: 'w-2.5 h-2.5' },
  lg: { container: 'w-12 h-12', text: 'text-base', dot: 'w-3 h-3' },
  xl: { container: 'w-16 h-16', text: 'text-lg', dot: 'w-3.5 h-3.5' },
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  status,
  className = '',
}) => {
  const [imageError, setImageError] = React.useState<boolean>(false);

  const getInitials = (fullName?: string) => {
    if (!fullName) return '?';
    const parts = fullName.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const statusColors = {
    online: 'bg-[#16A34A]',
    offline: 'bg-[#9CA3AF]',
    busy: 'bg-[#DC2626]',
  };

  const currentSize = sizeStyles[size];

  return (
    <div className={`relative inline-block shrink-0 select-none ${className}`}>
      <div
        className={`${currentSize.container} rounded-full overflow-hidden bg-[#F0F1F5] border border-[#E5E7EB] flex items-center justify-center font-bold text-[#171923] shadow-xs`}
      >
        {src && !imageError ? (
          <img
            src={src}
            alt={name || 'Avatar'}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className={currentSize.text}>{getInitials(name)}</span>
        )}
      </div>

      {status && (
        <span
          className={`absolute bottom-0 right-0 rounded-full ring-2 ring-white ${currentSize.dot} ${statusColors[status]}`}
        />
      )}
    </div>
  );
};

