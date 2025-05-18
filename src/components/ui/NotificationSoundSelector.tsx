import React, { useState, useEffect } from 'react';
import { playNotificationSound, NotificationSoundType } from './NotificationSounds';

interface NotificationSoundSelectorProps {
  onChange: (sound: NotificationSoundType | 'none') => void;
}

export const NotificationSoundSelector: React.FC<NotificationSoundSelectorProps> = ({ onChange }) => {
  const [selectedSound, setSelectedSound] = useState<NotificationSoundType | 'none'>('default');
  
  // Load saved sound preference
  useEffect(() => {
    try {
      const savedSound = localStorage.getItem('preferredNotificationSound') as NotificationSoundType | 'none';
      if (savedSound) {
        setSelectedSound(savedSound);
      }
    } catch (e) {
      console.error('Failed to load sound preference:', e);
    }
  }, []);
  
  // Change handler
  const handleSoundChange = (sound: NotificationSoundType | 'none') => {
    setSelectedSound(sound);
    
    try {
      localStorage.setItem('preferredNotificationSound', sound);
    } catch (e) {
      console.error('Failed to save sound preference:', e);
    }
    
    // Play a sample of the selected sound
    if (sound !== 'none') {
      playNotificationSound(sound);
    }
    
    // Notify parent component
    onChange(sound);
  };
  
  return (
    <div className="sound-selector">
      <h4>Notification Sound</h4>
      <div className="sound-options">
        <label className="sound-option">
          <input
            type="radio"
            name="notification-sound"
            value="none"
            checked={selectedSound === 'none'}
            onChange={() => handleSoundChange('none')}
          />
          <span>None</span>
        </label>
        
        <label className="sound-option">
          <input
            type="radio"
            name="notification-sound"
            value="default"
            checked={selectedSound === 'default'}
            onChange={() => handleSoundChange('default')}
          />
          <span>Default</span>
          <button 
            className="play-sample" 
            onClick={(e) => {
              e.preventDefault(); 
              playNotificationSound('default');
            }}
            aria-label="Play default sound sample"
          >
            ▶️
          </button>
        </label>
        
        <label className="sound-option">
          <input
            type="radio"
            name="notification-sound"
            value="success"
            checked={selectedSound === 'success'}
            onChange={() => handleSoundChange('success')}
          />
          <span>Success</span>
          <button 
            className="play-sample" 
            onClick={(e) => {
              e.preventDefault(); 
              playNotificationSound('success');
            }}
            aria-label="Play success sound sample"
          >
            ▶️
          </button>
        </label>
        
        <label className="sound-option">
          <input
            type="radio"
            name="notification-sound"
            value="warning"
            checked={selectedSound === 'warning'}
            onChange={() => handleSoundChange('warning')}
          />
          <span>Warning</span>
          <button 
            className="play-sample" 
            onClick={(e) => {
              e.preventDefault(); 
              playNotificationSound('warning');
            }}
            aria-label="Play warning sound sample"
          >
            ▶️
          </button>
        </label>
      </div>
    </div>
  );
};
