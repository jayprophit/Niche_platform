import React from 'react';
import { NotificationSettings } from '../../../components/ui/NotificationSettings';
import { NotificationUserTesting } from '../../../components/ui/NotificationUserTesting';
import { NotificationAnalytics } from '../../../components/ui/NotificationAnalytics';
import { NotificationPreferences } from '../../../components/social/NotificationPreferences';

export default function NotificationSettingsPage() {
  return (
    <div className="notification-settings-page" style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <h1>Notification Settings</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        <section>
          <h2>Notification Preferences</h2>
          <p>Choose which notifications you want to receive.</p>
          <NotificationPreferences />
        </section>
        
        <section>
          <h2>Sound & Display Settings</h2>
          <p>Customize how notifications appear and sound.</p>
          <NotificationSettings />
        </section>
        
        <section>
          <h2>Notification Analytics</h2>
          <p>View statistics about your notification usage and engagement.</p>
          <NotificationAnalytics />
        </section>
        
        <section>
          <h2>Help Us Improve</h2>
          <p>Participate in user testing to help us improve the notification experience.</p>
          <NotificationUserTesting 
            onComplete={(feedback) => {
              // In a real implementation, this would send feedback to the server
              console.log('User feedback:', feedback);
              alert('Thank you for your feedback! Your input helps us improve our notification system.');
            }} 
          />
        </section>
      </div>
    </div>
  );
}
