import React from 'react';

export interface DropdownItem {
  id?: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  danger?: boolean;
  badge?: React.ReactNode;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  items?: (DropdownItem | 'divider')[];
  align?: 'left' | 'right';
  className?: string;
  children?: React.ReactNode;
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  align = 'right',
  className = '',
  children,
}) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className={`relative inline-block text-left ${className}`}>
      <div onClick={() => setIsOpen((prev) => !prev)} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={`absolute z-50 mt-2 min-w-[200px] rounded-[12px] bg-white border border-[#E5E7EB] shadow-lg py-1.5 focus:outline-none animate-in fade-in zoom-in-95 duration-150 ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {items
            ? items.map((item, index) => {
                if (item === 'divider') {
                  return <div key={`divider-${index}`} className="my-1.5 border-t border-[#E5E7EB]" />;
                }

                return (
                  <button
                    key={item.id || item.label}
                    type="button"
                    disabled={item.disabled}
                    onClick={() => {
                      if (item.disabled) return;
                      item.onClick?.();
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-2 text-xs font-medium text-left transition-colors ${
                      item.disabled
                        ? 'opacity-40 cursor-not-allowed'
                        : item.danger
                        ? 'text-[#DC2626] hover:bg-[#FEE2E2]/30 active:bg-[#FEE2E2]/60'
                        : 'text-[#171923] hover:bg-[#F0F1F5] active:bg-[#E4E6EB]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {item.icon && <span className="text-[#737887]">{item.icon}</span>}
                      <span>{item.label}</span>
                    </div>
                    {item.badge && <span className="ml-2">{item.badge}</span>}
                  </button>
                );
              })
            : children}
        </div>
      )}
    </div>
  );
};

