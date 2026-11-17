import React from 'react';

export interface SwitchProps {
  id?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  id,
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  label,
  description,
  className = '',
}) => {
  const [internalChecked, setInternalChecked] = React.useState<boolean>(
    Boolean(checked ?? defaultChecked ?? false)
  );

  React.useEffect(() => {
    if (checked !== undefined) {
      setInternalChecked(checked);
    }
  }, [checked]);

  const isChecked = checked !== undefined ? checked : internalChecked;

  const handleToggle = () => {
    if (disabled) return;
    const nextState = !isChecked;
    if (checked === undefined) {
      setInternalChecked(nextState);
    }
    if (onChange) {
      onChange(nextState);
    }
  };

  const switchId = id || (typeof label === 'string' ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`flex items-start justify-between gap-4 select-none ${className}`}>
      {(label || description) && (
        <label htmlFor={switchId} className="flex flex-col cursor-pointer">
          {label && <span className="text-sm font-medium text-[#171923]">{label}</span>}
          {description && <span className="text-xs text-[#737887] mt-0.5">{description}</span>}
        </label>
      )}
      <button
        id={switchId}
        type="button"
        role="switch"
        aria-checked={isChecked}
        disabled={disabled}
        onClick={handleToggle}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2373FB]/40 disabled:cursor-not-allowed disabled:opacity-50 ${
          isChecked ? 'bg-[#2373FB]' : 'bg-[#D1D5DB]'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
            isChecked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
};

