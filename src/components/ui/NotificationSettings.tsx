import React, { useState, useEffect } from 'react';
import { toggleNotificationSounds, NotificationSoundType } from './NotificationSounds';
import { NotificationSoundSelector } from './NotificationSoundSelector';

interface NotificationSettingsProps {
  onClose: () => void;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({ onClose }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [soundsEnabled, setSoundsEnabled] = useState(false);
  const [groupingEnabled, setGroupingEnabled] = useState(true);
  
  // Load settings when component mounts
  useEffect(() => {
    try {
      // Load theme setting
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
      if (savedTheme) setTheme(savedTheme);
      
      // Load sound setting
      const savedSoundSetting = localStorage.getItem('notificationSoundsEnabled');
      setSoundsEnabled(savedSoundSetting === 'true');
      
      // Load grouping setting
      const savedGroupingSetting = localStorage.getItem('notificationGroupingEnabled');
      if (savedGroupingSetting !== null) {
        setGroupingEnabled(savedGroupingSetting === 'true');
      }
    } catch (e) {
      console.error('Failed to load notification settings:', e);
    }
  }, []);
  
  // Save theme setting
  const handleThemeChange = (newTheme: 'light' | 'dark') => {
    setTheme(newTheme);
    try {
      localStorage.setItem('theme', newTheme);
      // Apply theme to the document
      document.documentElement.setAttribute('data-theme', newTheme);
    } catch (e) {
      console.error('Failed to save theme setting:', e);
    }
  };
  
  // Toggle sound setting
  const handleSoundToggle = () => {
    const newState = toggleNotificationSounds();
    setSoundsEnabled(newState);
  };
  
  // Handle sound selection
  const handleSoundSelection = (sound: NotificationSoundType | 'none') => {
    // If sound is set to none, disable sounds
    if (sound === 'none') {
      setSoundsEnabled(false);
      try {
        localStorage.setItem('notificationSoundsEnabled', 'false');
      } catch (e) {
        console.error('Failed to save sound setting:', e);
      }
    } else if (!soundsEnabled) {
      // If sounds were disabled but user selects a sound, enable sounds
      setSoundsEnabled(true);
      try {
        localStorage.setItem('notificationSoundsEnabled', 'true');
      } catch (e) {
        console.error('Failed to save sound setting:', e);
      }
    }
  };
  
  // Toggle grouping setting
  const handleGroupingToggle = () => {
    const newState = !groupingEnabled;
    setGroupingEnabled(newState);
    try {
      localStorage.setItem('notificationGroupingEnabled', String(newState));
    } catch (e) {
      console.error('Failed to save grouping setting:', e);
    }
  };
  
  return (
    <div className="notification-settings">
      <div className="settings-header">
        <h3>Notification Settings</h3>
        <button className="close-btn" onClick={onClose} aria-label="Close settings">×</button>
      </div>
      
      <div className="settings-section">
        <h4>Appearance</h4>
        <div className="theme-selector">
          <span>Theme:</span>
          <div className="theme-buttons">
            <button 
              className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
              onClick={() => handleThemeChange('light')}
              aria-pressed={theme === 'light'}
            >
              Light
            </button>
            <button 
              className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => handleThemeChange('dark')}
              aria-pressed={theme === 'dark'}
            >
              Dark
            </button>
          </div>
        </div>
      </div>
      
      <div className="settings-section">
        <h4>Notification Options</h4>
        <label className="setting-toggle">
          <input 
            type="checkbox" 
            checked={soundsEnabled} 
            onChange={handleSoundToggle}
          />
          <span className="toggle-label">Play sounds</span>
        </label>
        
        {/* Sound selector only shows when sounds are enabled */}
        {soundsEnabled && (
          <div className="sound-selector-container">
            <NotificationSoundSelector onChange={handleSoundSelection} />
          </div>
        )}
        
        <label className="setting-toggle">
          <input 
            type="checkbox" 
            checked={groupingEnabled} 
            onChange={handleGroupingToggle}
          />
          <span className="toggle-label">Group similar notifications</span>
        </label>
      </div>
    </div>
  );
};
