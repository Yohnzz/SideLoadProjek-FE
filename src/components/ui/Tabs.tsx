import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  count?: number | string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  activeId: string;
  onChange: (id: string) => void;
  variant?: 'pill' | 'underline';
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  items,
  activeId,
  onChange,
  variant = 'pill',
  className = '',
}) => {
  if (variant === 'underline') {
    return (
      <div className={`flex items-center gap-6 border-b border-[#E5E7EB] ${className}`}>
        {items.map((tab) => {
          const isActive = tab.id === activeId;
          return (
            <button
              key={tab.id}
              type="button"
              disabled={tab.disabled}
              onClick={() => onChange(tab.id)}
              className={`pb-3 text-sm font-semibold relative flex items-center gap-2 transition-colors select-none ${
                tab.disabled
                  ? 'opacity-40 cursor-not-allowed'
                  : isActive
                  ? 'text-[#2373FB]'
                  : 'text-[#737887] hover:text-[#171923]'
              }`}
            >
              {tab.icon && <span>{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    isActive ? 'bg-[#EFF6FF] text-[#2373FB]' : 'bg-[#F0F1F5] text-[#737887]'
                  }`}
                >
                  {tab.count}
                </span>
              )}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2373FB] rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Default 'pill' style (matches Developer Dashboard tabs in user screenshots)
  return (
    <div className={`inline-flex items-center gap-1.5 p-1 bg-[#F0F1F5] rounded-[12px] ${className}`}>
      {items.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            disabled={tab.disabled}
            onClick={() => onChange(tab.id)}
            className={`px-4 py-2 text-xs font-semibold rounded-[9px] flex items-center gap-2 transition-all duration-150 select-none ${
              tab.disabled
                ? 'opacity-40 cursor-not-allowed'
                : isActive
                ? 'bg-white text-[#171923] shadow-xs'
                : 'text-[#737887] hover:text-[#171923] hover:bg-white/50'
            }`}
          >
            {tab.icon && <span>{tab.icon}</span>}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full font-medium ${
                  isActive ? 'bg-[#EFF6FF] text-[#2373FB]' : 'bg-[#E4E6EB] text-[#737887]'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

