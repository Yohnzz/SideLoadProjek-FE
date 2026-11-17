import React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  maxLength?: number;
  showCharCount?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      helperText,
      error,
      maxLength,
      showCharCount,
      className = '',
      id,
      value,
      defaultValue,
      onChange,
      ...props
    },
    ref
  ) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const [charCount, setCharCount] = React.useState<number>(() => {
      if (typeof value === 'string') return value.length;
      if (typeof defaultValue === 'string') return defaultValue.length;
      return 0;
    });

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      if (onChange) onChange(e);
    };

    return (
      <div className="w-full flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          {label && (
            <label htmlFor={textareaId} className="text-xs font-semibold text-[#171923]">
              {label}
              {props.required && <span className="text-[#DC2626] ml-1">*</span>}
            </label>
          )}
          {showCharCount && maxLength && (
            <span className="text-[11px] text-[#737887]">
              {charCount}/{maxLength} Karakter
            </span>
          )}
        </div>
        <textarea
          id={textareaId}
          ref={ref}
          value={value}
          defaultValue={defaultValue}
          maxLength={maxLength}
          onChange={handleChange}
          rows={props.rows || 4}
          className={`w-full rounded-[10px] bg-[#F0F1F5] text-[#171923] placeholder:text-[#737887] text-sm p-3.5 border transition-all duration-150 outline-none resize-y
            ${
              error
                ? 'border-[#DC2626] bg-[#FEE2E2]/20 focus:border-[#DC2626] focus:ring-2 focus:ring-[#DC2626]/20'
                : 'border-transparent hover:border-[#D1D5DB] focus:bg-white focus:border-[#2373FB] focus:ring-2 focus:ring-[#2373FB]/20'
            }
            ${className}
          `}
          {...props}
        />
        {error ? (
          <p className="text-xs text-[#DC2626] font-medium mt-0.5">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-[#737887] mt-0.5">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

