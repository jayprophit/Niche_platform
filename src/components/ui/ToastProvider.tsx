import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Toast {
  id: number;
  message: string;
  type?: 'success' | 'error' | 'info';
}

interface ToastContextType {
  showToast: (message: string, type?: Toast['type']) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const showToast = (message: string, type?: Toast['type']) => {
    const id = Date.now();
    setToasts(ts => [...ts, { id, message, type }]);
    setTimeout(() => setToasts(ts => ts.filter(t => t.id !== id)), 3000);
  };
  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container" style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999 }}>
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type || 'info'}`} style={{ background: t.type === 'error' ? '#f44336' : t.type === 'success' ? '#4caf50' : '#333', color: '#fff', padding: '10px 18px', borderRadius: 6, marginBottom: 8, minWidth: 180, boxShadow: '0 2px 8px rgba(0,0,0,0.13)' }}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
