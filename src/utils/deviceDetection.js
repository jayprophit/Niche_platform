/**
 * Device detection utility for cross-platform compatibility
 * Detects device type and provides platform-specific configurations
 */

export const DEVICE_TYPES = {
  DESKTOP: 'desktop',
  MOBILE: 'mobile',
  TABLET: 'tablet',
  WEB: 'web',
  WEARABLE: 'wearable',
  IOT: 'iot',
};

/**
 * Detect device type based on user agent and screen size
 * @returns {string} Device type
 */
export function detectDeviceType() {
  if (typeof window === 'undefined') {
    return DEVICE_TYPES.WEB; // Default for server-side rendering
  }

  const userAgent = window.navigator.userAgent.toLowerCase();
  const width = window.innerWidth;
  
  // Check for mobile devices
  if (/android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent)) {
    return width < 768 ? DEVICE_TYPES.MOBILE : DEVICE_TYPES.TABLET;
  }
  
  // Check for tablets
  if (/ipad|tablet|playbook|silk/i.test(userAgent) || (width >= 768 && width <= 1024)) {
    return DEVICE_TYPES.TABLET;
  }
  
  // Check for wearables
  if (/watch|glass/i.test(userAgent)) {
    return DEVICE_TYPES.WEARABLE;
  }
  
  // Check for IoT devices
  if (/alexa|echo|homepod|nest|smarttv/i.test(userAgent)) {
    return DEVICE_TYPES.IOT;
  }
  
  // Default to desktop
  return DEVICE_TYPES.DESKTOP;
}

/**
 * Get platform-specific configuration based on device type
 * @param {string} deviceType - Type of device
 * @returns {Object} Platform-specific configuration
 */
export function getPlatformConfig(deviceType = null) {
  const currentDevice = deviceType || detectDeviceType();
  
  const baseConfig = {
    fontScale: 1,
    spacing: 8,
    maxContentWidth: 1200,
    navigationStyle: 'standard',
    imageQuality: 'high',
    enableAnimations: true,
    enablePushNotifications: true,
    enableLocationServices: true,
    enableOfflineMode: true,
  };
  
  const platformConfigs = {
    [DEVICE_TYPES.DESKTOP]: {
      ...baseConfig,
      navigationStyle: 'sidebar',
      layoutColumns: 3,
      enableHoverEffects: true,
      enableKeyboardShortcuts: true,
    },
    [DEVICE_TYPES.MOBILE]: {
      ...baseConfig,
      fontScale: 0.9,
      spacing: 4,
      maxContentWidth: '100%',
      navigationStyle: 'bottom',
      layoutColumns: 1,
      imageQuality: 'medium',
      enableAnimations: false,
      enableHoverEffects: false,
      enableKeyboardShortcuts: false,
    },
    [DEVICE_TYPES.TABLET]: {
      ...baseConfig,
      maxContentWidth: 768,
      navigationStyle: 'top',
      layoutColumns: 2,
      enableHoverEffects: false,
    },
    [DEVICE_TYPES.WEB]: {
      ...baseConfig,
      enableOfflineMode: false,
    },
    [DEVICE_TYPES.WEARABLE]: {
      ...baseConfig,
      fontScale: 0.8,
      spacing: 2,
      maxContentWidth: 300,
      navigationStyle: 'minimal',
      layoutColumns: 1,
      imageQuality: 'low',
      enableAnimations: false,
      enableHoverEffects: false,
      enableKeyboardShortcuts: false,
    },
    [DEVICE_TYPES.IOT]: {
      ...baseConfig,
      fontScale: 1.2,
      spacing: 12,
      maxContentWidth: '100%',
      navigationStyle: 'voice',
      layoutColumns: 1,
      imageQuality: 'medium',
      enableAnimations: false,
      enableHoverEffects: false,
      enableKeyboardShortcuts: false,
    },
  };
  
  return platformConfigs[currentDevice] || baseConfig;
}

/**
 * Check if the current platform supports a specific feature
 * @param {string} featureName - Name of the feature to check
 * @returns {boolean} Whether the feature is supported
 */
export function isFeatureSupported(featureName) {
  const deviceType = detectDeviceType();
  
  const featureSupport = {
    fileUpload: [DEVICE_TYPES.DESKTOP, DEVICE_TYPES.WEB, DEVICE_TYPES.MOBILE, DEVICE_TYPES.TABLET],
    videoCall: [DEVICE_TYPES.DESKTOP, DEVICE_TYPES.WEB, DEVICE_TYPES.MOBILE, DEVICE_TYPES.TABLET],
    audioCall: [DEVICE_TYPES.DESKTOP, DEVICE_TYPES.WEB, DEVICE_TYPES.MOBILE, DEVICE_TYPES.TABLET, DEVICE_TYPES.WEARABLE],
    notifications: [DEVICE_TYPES.DESKTOP, DEVICE_TYPES.WEB, DEVICE_TYPES.MOBILE, DEVICE_TYPES.TABLET, DEVICE_TYPES.WEARABLE, DEVICE_TYPES.IOT],
    camera: [DEVICE_TYPES.DESKTOP, DEVICE_TYPES.MOBILE, DEVICE_TYPES.TABLET, DEVICE_TYPES.WEARABLE],
    microphone: [DEVICE_TYPES.DESKTOP, DEVICE_TYPES.MOBILE, DEVICE_TYPES.TABLET, DEVICE_TYPES.WEARABLE, DEVICE_TYPES.IOT],
    location: [DEVICE_TYPES.DESKTOP, DEVICE_TYPES.MOBILE, DEVICE_TYPES.TABLET, DEVICE_TYPES.WEARABLE],
    touchInput: [DEVICE_TYPES.MOBILE, DEVICE_TYPES.TABLET, DEVICE_TYPES.WEARABLE],
    keyboardInput: [DEVICE_TYPES.DESKTOP, DEVICE_TYPES.WEB, DEVICE_TYPES.MOBILE, DEVICE_TYPES.TABLET],
    voiceInput: [DEVICE_TYPES.DESKTOP, DEVICE_TYPES.MOBILE, DEVICE_TYPES.TABLET, DEVICE_TYPES.WEARABLE, DEVICE_TYPES.IOT],
    fileDownload: [DEVICE_TYPES.DESKTOP, DEVICE_TYPES.WEB, DEVICE_TYPES.MOBILE, DEVICE_TYPES.TABLET],
    complexAnimations: [DEVICE_TYPES.DESKTOP, DEVICE_TYPES.WEB, DEVICE_TYPES.TABLET],
    3dRendering: [DEVICE_TYPES.DESKTOP, DEVICE_TYPES.WEB],
    backgroundProcessing: [DEVICE_TYPES.DESKTOP, DEVICE_TYPES.MOBILE, DEVICE_TYPES.TABLET],
    offlineAccess: [DEVICE_TYPES.DESKTOP, DEVICE_TYPES.MOBILE, DEVICE_TYPES.TABLET],
  };
  
  return featureSupport[featureName]?.includes(deviceType) || false;
}
