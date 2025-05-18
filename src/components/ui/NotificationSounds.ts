// Notification sound settings interface
export interface NotificationSoundSettings {
  enabled: boolean;
  volume: number; // 0-1
  preferredSound: NotificationSoundType;
}

// Get notification sound settings
export const getSoundSettings = (): NotificationSoundSettings => {
  try {
    const settings = localStorage.getItem('notificationSoundSettings');
    if (settings) {
      return JSON.parse(settings);
    }
  } catch (e) {
    console.error('Error reading sound settings:', e);
  }
  
  // Default settings
  return {
    enabled: true,
    volume: 0.5,
    preferredSound: 'default' as NotificationSoundType
  };
};

// Check if sounds are enabled
const soundsEnabled = (): boolean => {
  return getSoundSettings().enabled;
};

// Sound types
export type NotificationSoundType = 
  | 'default' 
  | 'success' 
  | 'error' 
  | 'warning' 
  | 'message' 
  | 'reminder' 
  | 'mention' 
  | 'like';

// Sound file details interface
export interface SoundDetails {
  path: string;
  name: string;
  description: string;
}

// Get all available notification sounds
export const getAllSounds = (): Record<NotificationSoundType, SoundDetails> => {
  return {
    default: {
      path: '/sounds/notification.mp3',
      name: 'Default',
      description: 'Standard notification sound'
    },
    success: {
      path: '/sounds/success.mp3',
      name: 'Success',
      description: 'Positive confirmation sound'
    },
    error: {
      path: '/sounds/error.mp3',
      name: 'Error',
      description: 'Alert sound for errors'
    },
    warning: {
      path: '/sounds/warning.mp3',
      name: 'Warning',
      description: 'Attention-grabbing warning sound'
    },
    message: {
      path: '/sounds/message.mp3',
      name: 'Message',
      description: 'New message received sound'
    },
    reminder: {
      path: '/sounds/reminder.mp3',
      name: 'Reminder',
      description: 'Gentle reminder sound'
    },
    mention: {
      path: '/sounds/mention.mp3',
      name: 'Mention',
      description: 'Sound for when you are mentioned'
    },
    like: {
      path: '/sounds/like.mp3',
      name: 'Like',
      description: 'Sound for likes and reactions'
    }
  };
};

// Get sound file path based on type
const getSoundPath = (type: NotificationSoundType = 'default'): string => {
  return getAllSounds()[type]?.path || '/sounds/notification.mp3';
};

// Play a notification sound if enabled
export const playNotificationSound = (type: NotificationSoundType = 'default'): void => {
  if (!soundsEnabled() || typeof window === 'undefined') return;
  
  try {
    // Get settings
    const settings = getSoundSettings();
    
    // Create and play audio
    const audio = new Audio(getSoundPath(type));
    audio.volume = settings.volume;
    
    // Play the sound
    const playPromise = audio.play();
    
    // Handle play promise rejection
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.error('Error playing notification sound:', error);
      });
    }
  } catch (e) {
    console.error('Failed to play notification sound:', e);
  }
};

// Preview a notification sound regardless of settings
export const previewSound = (type: NotificationSoundType, volume: number = 0.5): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const audio = new Audio(getSoundPath(type));
    audio.volume = volume;
    audio.play().catch(error => {
      console.error('Error playing sound preview:', error);
    });
  } catch (e) {
    console.error('Failed to preview sound:', e);
  }
};

// Save sound settings
export const saveSoundSettings = (settings: NotificationSoundSettings): boolean => {
  try {
    localStorage.setItem('notificationSoundSettings', JSON.stringify(settings));
    return true;
  } catch (e) {
    console.error('Failed to save notification sound settings:', e);
    return false;
  }
};

// Toggle sound enabled/disabled
export const toggleNotificationSounds = (): boolean => {
  try {
    const settings = getSoundSettings();
    settings.enabled = !settings.enabled;
    saveSoundSettings(settings);
    return settings.enabled;
  } catch (e) {
    console.error('Failed to toggle notification sounds:', e);
    return false;
  }
};

// Set sound volume
export const setSoundVolume = (volume: number): boolean => {
  try {
    const settings = getSoundSettings();
    settings.volume = Math.max(0, Math.min(1, volume)); // Ensure volume is between 0 and 1
    saveSoundSettings(settings);
    return true;
  } catch (e) {
    console.error('Failed to set notification sound volume:', e);
    return false;
  }
};

// Set preferred sound
export const setPreferredSound = (sound: NotificationSoundType): boolean => {
  try {
    const settings = getSoundSettings();
    settings.preferredSound = sound;
    saveSoundSettings(settings);
    return true;
  } catch (e) {
    console.error('Failed to set preferred notification sound:', e);
    return false;
  }
};
