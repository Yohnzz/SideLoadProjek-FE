import React from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnOverlayClick?: boolean;
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  closeOnOverlayClick = true,
}) => {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#171923]/40 backdrop-blur-xs transition-opacity duration-200"
        onClick={closeOnOverlayClick ? onClose : undefined}
      />

      {/* Dialog Window */}
      <div
        className={`relative w-full ${sizeClasses[size]} bg-white rounded-[16px] border border-[#E5E7EB] shadow-xl z-10 flex flex-col max-h-[90vh] overflow-hidden transform transition-all duration-200 animate-in fade-in zoom-in-95`}
      >
        {/* Header */}
        {(title || description) && (
          <div className="flex items-start justify-between p-5 border-b border-[#E5E7EB]">
            <div className="flex flex-col gap-1 pr-6">
              {title && <h2 className="text-lg font-bold text-[#171923] tracking-tight">{title}</h2>}
              {description && <p className="text-xs text-[#737887] leading-relaxed">{description}</p>}
            </div>
            <button
              onClick={onClose}
              aria-label="Tutup modal"
              className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[#737887] hover:text-[#171923] hover:bg-[#F0F1F5] transition-colors shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 overflow-y-auto">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="p-4 px-6 border-t border-[#E5E7EB] bg-[#F7F8FA]/60 flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

