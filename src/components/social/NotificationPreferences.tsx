import React, { useState, useEffect } from 'react';
import { UserNotificationPreferences } from './types';
import { icons } from './NotificationIcons';
import { useToast } from '../ui/ToastProvider';
import { useNotifications } from '../ui/NotificationContextProvider';

interface NotificationPreferencesProps {
  userId: string;
  onSave?: (preferences: UserNotificationPreferences) => Promise<void>;
}

interface CategoryProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  expanded?: boolean;
}

interface PreferenceCheckboxProps {
  label: string;
  tooltip: string;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  id?: string;
}

export const NotificationPreferences: React.FC<NotificationPreferencesProps> = ({ 
  userId, 
  onSave 
}) => {
  const { showToast } = useToast();
  const { addNotification } = useNotifications();
  const [preferences, setPreferences] = useState<UserNotificationPreferences>({
    // Social Interactions
    reactions: true,
    shares: true,
    comments: true,
    mentions: true,
    follows: true,
    
    // Content Management
    reports: true,
    contentApproved: true,
    contentRejected: true,
    
    // Messages
    messages: true,
    groupMessages: true,
    
    // Groups & Events
    groupInvites: true,
    groupUpdates: true,
    eventReminders: true,
    eventRSVP: true,
    
    // System & Security
    accountSecurity: true,
    platformUpdates: true
  });
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'social': true,
    'content': true,
    'messages': true,
    'groups': true,
    'system': true
  });

  // Fetch current user preferences
  useEffect(() => {
    const fetchPreferences = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`/api/user_notification-preferences?userId=${encodeURIComponent(userId)}`);
        if (!response.ok) throw new Error('Failed to load preferences');
        const data = await response.json();
        setPreferences(data);
      } catch (err) {
        console.error('Error loading preferences:', err);
        setError('Could not load your notification preferences.');
      } finally {
        setLoading(false);
      }
    };

    fetchPreferences();
  }, [userId]);

  const handleToggle = (key: keyof UserNotificationPreferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    setSuccess('');
    
    try {
      const response = await fetch(`/api/user_notification-preferences?userId=${encodeURIComponent(userId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences)
      });
      if (!response.ok) throw new Error('Failed to save preferences');
      
      // Show success feedback via toast and notifications
      showToast('Preferences saved successfully!', 'success');
      addNotification('Your notification preferences have been updated.', 'success');
      setSuccess('Your notification preferences have been saved!');
      
      // Call the optional onSave callback if provided
      if (onSave) {
        await onSave(preferences);
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      // Show error feedback via toast and notifications
      showToast('Failed to save preferences', 'error');
      addNotification('There was an error saving your notification preferences.', 'error');
      setError('Failed to save preferences. Please try again.');
      console.error('Error saving preferences:', err);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Simple toast implementation
  const showToast = (message: string) => {
    const toast = document.createElement('div');
    toast.className = 'notification-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
  };

  if (loading) {
    return (
      <div className="notification-preferences">
        <h2>Notification Preferences</h2>
        <div className="skeleton-loader" style={{height: 120, margin: '16px 0'}}></div>
      </div>
    );
  }

  // Custom checkbox with tooltip and accessibility
  const PreferenceCheckbox: React.FC<PreferenceCheckboxProps & { icon?: React.ReactNode }> = ({ label, tooltip, checked, onChange, disabled, id, icon }) => (
  <div className="preference-checkbox" style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
    <input
      type="checkbox"
      id={id || label.replace(/\s+/g, '-')}
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      aria-checked={checked}
      aria-describedby={id ? `${id}-desc` : undefined}
      style={{ marginRight: 8 }}
    />
    <label htmlFor={id || label.replace(/\s+/g, '-')}
      style={{ marginLeft: 0, display: 'flex', alignItems: 'center', cursor: disabled ? 'not-allowed' : 'pointer' }}>
      {icon && <span style={{ marginRight: 6 }}>{icon}</span>}
      {label}
      <span
        tabIndex={0}
        aria-label={tooltip}
        role="tooltip"
        style={{ marginLeft: 6, color: '#888', cursor: 'help' }}
      >
        ⓘ
      </span>
    </label>
  </div>
);


  // Category rendering helper
  const CategorySection: React.FC<{title: string; children: React.ReactNode}> = ({ title, children }) => (
    <fieldset className="category-section" style={{ border: '1px solid #eee', borderRadius: 6, margin: '16px 0', padding: '12px 16px' }}>
      <legend style={{ fontWeight: 600, fontSize: 16 }}>{title}</legend>
      {children}
    </fieldset>
  );

  return (
    <div className="notification-preferences" aria-live="polite">
      <h2>Notification Preferences</h2>
      {error && <div className="error-message" style={{color: 'red', marginBottom: 8}}>{error}</div>}
      {success && <div className="success-message animate-pop" style={{color: 'green', marginBottom: 8}}>{success}</div>}
      <form onSubmit={e => { e.preventDefault(); handleSave(); }}>
        <CategorySection title="Social Interactions">
          <PreferenceCheckbox label="Reactions to your posts" tooltip="Get notified when someone reacts to your post." checked={preferences.reactions} onChange={() => handleToggle('reactions')} disabled={isSaving} icon={icons.reactions} />
          <PreferenceCheckbox label="Shares of your posts" tooltip="Get notified when your post is shared." checked={preferences.shares} onChange={() => handleToggle('shares')} disabled={isSaving} icon={icons.shares} />
          <PreferenceCheckbox label="Comments on your posts" tooltip="Get notified when someone comments on your post." checked={preferences.comments} onChange={() => handleToggle('comments')} disabled={isSaving} icon={icons.comments} />
          <PreferenceCheckbox label="Mentions" tooltip="Be alerted when you are mentioned in a post or comment." checked={preferences.mentions} onChange={() => handleToggle('mentions')} disabled={isSaving} icon={icons.mentions} />
          <PreferenceCheckbox label="New followers" tooltip="Get notified when someone follows you." checked={preferences.follows} onChange={() => handleToggle('follows')} disabled={isSaving} icon={icons.follows} />
        </CategorySection>
        <CategorySection title="Content Management">
          <PreferenceCheckbox label="Content reports" tooltip="Be alerted if your content is reported." checked={preferences.reports} onChange={() => handleToggle('reports')} disabled={isSaving} icon={icons.reports} />
          <PreferenceCheckbox label="Content approved" tooltip="Get notified when your content is approved by moderators." checked={preferences.contentApproved} onChange={() => handleToggle('contentApproved')} disabled={isSaving} icon={icons.contentApproved} />
          <PreferenceCheckbox label="Content rejected" tooltip="Get notified when your content is rejected by moderators." checked={preferences.contentRejected} onChange={() => handleToggle('contentRejected')} disabled={isSaving} icon={icons.contentRejected} />
        </CategorySection>
        <CategorySection title="Messages">
          <PreferenceCheckbox label="Direct messages" tooltip="Receive notifications for new direct messages." checked={preferences.messages} onChange={() => handleToggle('messages')} disabled={isSaving} icon={icons.messages} />
          <PreferenceCheckbox label="Group messages" tooltip="Receive notifications for new group messages." checked={preferences.groupMessages} onChange={() => handleToggle('groupMessages')} disabled={isSaving} icon={icons.groupMessages} />
        </CategorySection>
        <CategorySection title="Groups & Events">
          <PreferenceCheckbox label="Group invites" tooltip="Get notified when you are invited to a group." checked={preferences.groupInvites} onChange={() => handleToggle('groupInvites')} disabled={isSaving} icon={icons.groupInvites} />
          <PreferenceCheckbox label="Group updates" tooltip="Get notified about updates in your groups." checked={preferences.groupUpdates} onChange={() => handleToggle('groupUpdates')} disabled={isSaving} icon={icons.groupUpdates} />
          <PreferenceCheckbox label="Event reminders" tooltip="Receive reminders for upcoming events." checked={preferences.eventReminders} onChange={() => handleToggle('eventReminders')} disabled={isSaving} icon={icons.eventReminders} />
          <PreferenceCheckbox label="Event RSVP" tooltip="Get notified about RSVP status for events." checked={preferences.eventRSVP} onChange={() => handleToggle('eventRSVP')} disabled={isSaving} icon={icons.eventRSVP} />
        </CategorySection>
        <CategorySection title="System & Security">
          <PreferenceCheckbox label="Account security" tooltip="Be alerted about account security issues or changes." checked={preferences.accountSecurity} onChange={() => handleToggle('accountSecurity')} disabled={isSaving} icon={icons.accountSecurity} />
          <PreferenceCheckbox label="Platform updates" tooltip="Receive notifications about platform updates and announcements." checked={preferences.platformUpdates} onChange={() => handleToggle('platformUpdates')} disabled={isSaving} icon={icons.platformUpdates} />
        </CategorySection>
        <button type="submit" disabled={isSaving} className="save-preferences-btn" style={{marginTop: 16, padding: '8px 20px', fontWeight: 600}}>
          {isSaving ? 'Saving...' : 'Save Preferences'}
        </button>
      </form>
    </div>
  );
};

