import React from 'react';
import { Check } from 'lucide-react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, error, className = '', id, checked, defaultChecked, onChange, disabled, ...props }, ref) => {
    const [isChecked, setIsChecked] = React.useState<boolean>(Boolean(checked ?? defaultChecked ?? false));
    const checkboxId = id || (typeof label === 'string' ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    React.useEffect(() => {
      if (checked !== undefined) {
        setIsChecked(Boolean(checked));
      }
    }, [checked]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;
      if (checked === undefined) {
        setIsChecked(e.target.checked);
      }
      if (onChange) onChange(e);
    };

    return (
      <div className="flex flex-col gap-1">
        <label
          htmlFor={checkboxId}
          className={`group flex items-start gap-3 select-none cursor-pointer ${
            disabled ? 'opacity-50 !cursor-not-allowed' : ''
          }`}
        >
          <div className="relative flex items-center justify-center shrink-0 mt-0.5">
            <input
              id={checkboxId}
              ref={ref}
              type="checkbox"
              checked={checked !== undefined ? checked : isChecked}
              onChange={handleChange}
              disabled={disabled}
              className="sr-only"
              {...props}
            />
            <div
              className={`w-5 h-5 rounded-[6px] border flex items-center justify-center transition-all duration-150 ${
                (checked !== undefined ? checked : isChecked)
                  ? 'bg-[#2373FB] border-[#2373FB] text-white shadow-xs'
                  : 'bg-white border-[#D1D5DB] group-hover:border-[#2373FB]'
              } ${error ? 'border-[#DC2626]' : ''}`}
            >
              {(checked !== undefined ? checked : isChecked) && (
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              )}
            </div>
          </div>
          {(label || description) && (
            <div className="flex flex-col">
              {label && <span className="text-sm font-medium text-[#171923]">{label}</span>}
              {description && <span className="text-xs text-[#737887] mt-0.5">{description}</span>}
            </div>
          )}
        </label>
        {error && <p className="text-xs text-[#DC2626] font-medium ml-8">{error}</p>}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

