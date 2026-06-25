'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toast: {
    success: (message: string) => void;
    error: (message: string) => void;
    info: (message: string) => void;
    warning: (message: string) => void;
  };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500); // 4.5 seconds auto-dismiss
  }, [removeToast]);

  const toastActions = useMemo(() => ({
    success: (message: string) => addToast(message, 'success'),
    error: (message: string) => addToast(message, 'error'),
    info: (message: string) => addToast(message, 'info'),
    warning: (message: string) => addToast(message, 'warning'),
  }), [addToast]);

  return (
    <ToastContext.Provider value={{ toast: toastActions }}>
      {children}
      {/* Toast container floating on screen */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context.toast;
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  const { type, message } = toast;

  let bgClass = "bg-white border-brand-sand text-brand-forest";
  let iconColor = "text-brand-sage";
  let iconSvg = (
    <svg className="w-5 h-5 animate-pulse" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 111.084-1.085l-.041.02H11.25zm.041.02L11.25 18h1.5l.041-.02m-.041.02l-.082.04" />
    </svg>
  );

  if (type === 'success') {
    bgClass = "bg-emerald-50/95 border-emerald-200/80 text-emerald-950 shadow-emerald-900/5";
    iconColor = "text-emerald-600";
    iconSvg = (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  } else if (type === 'error') {
    bgClass = "bg-red-50/95 border-red-200/80 text-red-950 shadow-red-900/5";
    iconColor = "text-red-600";
    iconSvg = (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    );
  } else if (type === 'warning') {
    bgClass = "bg-amber-50/95 border-amber-200/80 text-amber-950 shadow-amber-900/5";
    iconColor = "text-amber-600";
    iconSvg = (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376C1.83 19.126 2.914 21 4.645 21h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 17.626zM12 17.25h.007v.008H12v-.008z" />
      </svg>
    );
  }

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-2xl border shadow-xl backdrop-blur-md pointer-events-auto transition-all duration-300 transform translate-y-0 opacity-100 animate-slide-in-right ${bgClass}`}
      role="alert"
    >
      <div className={`flex-shrink-0 ${iconColor}`}>{iconSvg}</div>
      <div className="flex-1 text-xs font-semibold leading-relaxed pt-0.5">{message}</div>
      <button
        onClick={onClose}
        className="flex-shrink-0 text-gray-400 hover:text-gray-600 hover:bg-black/5 rounded-lg p-1 transition-colors cursor-pointer"
        aria-label="Cerrar"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
