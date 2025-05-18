import React, { useState, useEffect } from 'react';

// A simplified, testable version of the NotificationPreferences component
export const TestableNotificationPreferences: React.FC<{userId: string}> = ({ userId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [preferences, setPreferences] = useState({
    reactions: false,
    shares: false,
    comments: false,
    mentions: false,
    follows: false,
    reports: false,
    contentApproved: false,
    contentRejected: false,
    messages: false,
    groupMessages: false,
    groupInvites: false,
    groupUpdates: false,
    eventReminders: false,
    eventRSVP: false,
    accountSecurity: false,
    platformUpdates: false,
  });
  
  useEffect(() => {
    async function loadPreferences() {
      try {
        const response = await fetch(`/api/user_notification-preferences?userId=${encodeURIComponent(userId)}`);
        if (response.ok) {
          const data = await response.json();
          setPreferences(data);
        }
      } catch (e) {
        console.error('Error loading preferences:', e);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadPreferences();
  }, [userId]);
  
  const handleSave = async () => {
    try {
      await fetch(`/api/user_notification-preferences?userId=${encodeURIComponent(userId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences)
      });
    } catch (e) {
      console.error('Error saving:', e);
    }
  };
  
  const handleToggle = (key: string) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };
  
  return (
    <div className="notification-preferences">
      <h1>Notification Preferences</h1>
      
      {isLoading ? (
        <p>Loading preferences...</p>
      ) : (
        <>
          <div className="category-section">
            <h2>Social Interactions</h2>
            <div className="preference-checkbox">
              <input
                type="checkbox"
                id="reactions"
                checked={preferences.reactions}
                onChange={() => handleToggle('reactions')}
              />
              <label htmlFor="reactions">Reactions to your posts</label>
            </div>
          </div>
          
          <div className="category-section">
            <h2>Content Management</h2>
            <div className="preference-checkbox">
              <input
                type="checkbox"
                id="reports"
                checked={preferences.reports}
                onChange={() => handleToggle('reports')}
              />
              <label htmlFor="reports">Content reports</label>
            </div>
          </div>
          
          <div className="category-section">
            <h2>Messages</h2>
            <div className="preference-checkbox">
              <input
                type="checkbox"
                id="messages"
                checked={preferences.messages}
                onChange={() => handleToggle('messages')}
              />
              <label htmlFor="messages">Direct messages</label>
            </div>
          </div>
          
          <div className="category-section">
            <h2>Groups & Events</h2>
            <div className="preference-checkbox">
              <input
                type="checkbox"
                id="groupInvites"
                checked={preferences.groupInvites}
                onChange={() => handleToggle('groupInvites')}
              />
              <label htmlFor="groupInvites">Group invites</label>
            </div>
          </div>
          
          <div className="category-section">
            <h2>System & Security</h2>
            <div className="preference-checkbox">
              <input
                type="checkbox"
                id="accountSecurity"
                checked={preferences.accountSecurity}
                onChange={() => handleToggle('accountSecurity')}
              />
              <label htmlFor="accountSecurity">Account security</label>
            </div>
          </div>
          
          <button onClick={handleSave} className="save-preferences-btn">
            Save Preferences
          </button>
        </>
      )}
    </div>
  );
};
