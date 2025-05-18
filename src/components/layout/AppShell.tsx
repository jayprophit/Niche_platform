import React from 'react';
import { ToastProvider } from '../ui/ToastProvider';
import { NotificationProvider } from '../ui/NotificationContextProvider';
import { NotificationCenter } from '../ui/NotificationCenter';
import { useNotifications } from '../ui/NotificationContextProvider';

interface AppShellProps {
  children: React.ReactNode;
}

// Wrapper component to use hooks after providers are available
const NotificationWrapper = () => {
  const { notifications, markNotificationAsRead, clearAllNotifications } = useNotifications();
  
  return (
    <div style={{ position: 'relative' }}>
      <div style={{ position: 'absolute', top: 10, right: 20 }}>
        <NotificationCenter 
          notifications={notifications} 
          onMarkRead={markNotificationAsRead} 
          onClearAll={clearAllNotifications} 
        />
      </div>
    </div>
  );
};

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <ToastProvider>
      <NotificationProvider>
        <div className="app-shell">
          <header className="app-header">
            <div className="header-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' }}>
              <h1>Niche Platform</h1>
              <NotificationWrapper />
            </div>
          </header>
          <main>{children}</main>
        </div>
      </NotificationProvider>
    </ToastProvider>
  );
};
