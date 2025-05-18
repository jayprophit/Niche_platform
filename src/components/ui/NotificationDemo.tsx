import React from 'react';
import { useToast } from './ToastProvider';
import { useNotifications } from './NotificationContextProvider';

/**
 * Demo component showcasing the toast and notification system usage
 */
export const NotificationDemo = () => {
  const { showToast } = useToast();
  const { addNotification } = useNotifications();

  const handleShowSuccessToast = () => {
    showToast('Operation completed successfully!', 'success');
  };

  const handleShowErrorToast = () => {
    showToast('An error occurred while processing your request.', 'error');
  };

  const handleShowInfoToast = () => {
    showToast('Here is some useful information.', 'info');
  };

  const handleAddNotification = (type: 'info' | 'success' | 'warning' | 'error') => {
    const messages = {
      info: 'You have a new message from the platform.',
      success: 'Your content was approved by moderators.',
      warning: 'Your account is approaching storage limits.',
      error: 'There was an issue processing your last upload.'
    };
    
    addNotification(messages[type], type);
  };

  return (
    <div className="notification-demo" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Notification System Demo</h2>
      
      <section style={{ marginBottom: '20px' }}>
        <h3>Toast Notifications</h3>
        <p>Toasts appear temporarily and are useful for immediate feedback.</p>
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button 
            onClick={handleShowSuccessToast}
            style={{ padding: '8px 16px', background: '#4caf50', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Show Success Toast
          </button>
          
          <button 
            onClick={handleShowErrorToast}
            style={{ padding: '8px 16px', background: '#f44336', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Show Error Toast
          </button>
          
          <button 
            onClick={handleShowInfoToast}
            style={{ padding: '8px 16px', background: '#2196f3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Show Info Toast
          </button>
        </div>
      </section>
      
      <section>
        <h3>Notification Center</h3>
        <p>Notifications are persistent and can be viewed anytime from the notification center.</p>
        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button 
            onClick={() => handleAddNotification('info')}
            style={{ padding: '8px 16px', background: '#2196f3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Add Info Notification
          </button>
          
          <button 
            onClick={() => handleAddNotification('success')}
            style={{ padding: '8px 16px', background: '#4caf50', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Add Success Notification
          </button>
          
          <button 
            onClick={() => handleAddNotification('warning')}
            style={{ padding: '8px 16px', background: '#ff9800', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Add Warning Notification
          </button>
          
          <button 
            onClick={() => handleAddNotification('error')}
            style={{ padding: '8px 16px', background: '#f44336', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Add Error Notification
          </button>
        </div>
      </section>
      
      <section style={{ marginTop: '40px' }}>
        <h3>Using in Your Components</h3>
        <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '4px', overflow: 'auto' }}>
          {`// Import the hooks
import { useToast } from '../ui/ToastProvider';
import { useNotifications } from '../ui/NotificationContextProvider';

// Use them in your component
const YourComponent = () => {
  const { showToast } = useToast();
  const { addNotification } = useNotifications();
  
  const handleSaveSettings = async () => {
    try {
      // Save settings logic
      showToast('Settings saved successfully!', 'success');
      addNotification('Your account settings have been updated.', 'success');
    } catch (error) {
      showToast('Failed to save settings.', 'error');
      addNotification('There was a problem updating your account settings.', 'error');
    }
  };
}`}
        </pre>
      </section>
    </div>
  );
};
