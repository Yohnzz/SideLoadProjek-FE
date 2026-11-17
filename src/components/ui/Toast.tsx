import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const toastConfig: Record<
  ToastType,
  { icon: React.ReactNode; container: string; iconColor: string }
> = {
  success: {
    icon: <CheckCircle2 className="w-5 h-5 shrink-0" />,
    container: 'bg-white border-[#BBF7D0] shadow-md',
    iconColor: 'text-[#16A34A]',
  },
  error: {
    icon: <AlertCircle className="w-5 h-5 shrink-0" />,
    container: 'bg-white border-[#FECACA] shadow-md',
    iconColor: 'text-[#DC2626]',
  },
  warning: {
    icon: <AlertTriangle className="w-5 h-5 shrink-0" />,
    container: 'bg-white border-[#FDE68A] shadow-md',
    iconColor: 'text-[#D97706]',
  },
  info: {
    icon: <Info className="w-5 h-5 shrink-0" />,
    container: 'bg-white border-[#DBEAFE] shadow-md',
    iconColor: 'text-[#2373FB]',
  },
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);

  const addToast = React.useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    const duration = toast.duration ?? 4000;
    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((toast) => {
          const config = toastConfig[toast.type];
          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-[12px] border ${config.container} transition-all duration-200 animate-in slide-in-from-bottom-2`}
            >
              <div className={config.iconColor}>{config.icon}</div>
              <div className="flex-1 flex flex-col gap-0.5">
                <span className="text-xs font-semibold text-[#171923]">{toast.title}</span>
                {toast.message && (
                  <p className="text-xs text-[#737887] leading-relaxed">{toast.message}</p>
                )}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-[#737887] hover:text-[#171923] p-0.5 rounded transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

