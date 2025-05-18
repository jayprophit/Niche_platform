/**
 * Platform-specific styling utility
 * Provides consistent styling across different platforms
 */

import { DEVICE_TYPES, detectDeviceType } from './deviceDetection';

// Base theme variables
const baseTheme = {
  colors: {
    primary: '#3f51b5',
    secondary: '#f50057',
    success: '#4caf50',
    warning: '#ff9800',
    error: '#f44336',
    info: '#2196f3',
    background: '#ffffff',
    surface: '#f5f5f5',
    text: {
      primary: 'rgba(0, 0, 0, 0.87)',
      secondary: 'rgba(0, 0, 0, 0.6)',
      disabled: 'rgba(0, 0, 0, 0.38)',
    },
  },
  typography: {
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    fontSize: 16,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
  },
  spacing: 8,
  borderRadius: 4,
  shadows: [
    'none',
    '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
    '0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)',
    '0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)',
  ],
  transitions: {
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    },
    duration: {
      shortest: 150,
      shorter: 200,
      short: 250,
      standard: 300,
      complex: 375,
      enteringScreen: 225,
      leavingScreen: 195,
    },
  },
};

// Platform-specific theme overrides
const platformThemes = {
  [DEVICE_TYPES.DESKTOP]: {
    ...baseTheme,
    spacing: 8,
    typography: {
      ...baseTheme.typography,
      fontSize: 16,
    },
  },
  [DEVICE_TYPES.MOBILE]: {
    ...baseTheme,
    spacing: 4,
    typography: {
      ...baseTheme.typography,
      fontSize: 14,
    },
    borderRadius: 8, // More rounded corners on mobile
  },
  [DEVICE_TYPES.TABLET]: {
    ...baseTheme,
    spacing: 6,
    typography: {
      ...baseTheme.typography,
      fontSize: 15,
    },
  },
  [DEVICE_TYPES.WEB]: {
    ...baseTheme,
  },
  [DEVICE_TYPES.WEARABLE]: {
    ...baseTheme,
    spacing: 2,
    typography: {
      ...baseTheme.typography,
      fontSize: 12,
    },
    borderRadius: 12, // Even more rounded for wearables
  },
  [DEVICE_TYPES.IOT]: {
    ...baseTheme,
    spacing: 12,
    typography: {
      ...baseTheme.typography,
      fontSize: 20, // Larger text for IoT devices (often viewed from distance)
    },
  },
};

/**
 * Get theme for current platform
 * @param {string} deviceType - Optional device type override
 * @returns {Object} Platform-specific theme
 */
export function getPlatformTheme(deviceType = null) {
  const currentDevice = deviceType || (typeof window !== 'undefined' ? detectDeviceType() : DEVICE_TYPES.WEB);
  return platformThemes[currentDevice] || baseTheme;
}

/**
 * Generate CSS variables for the theme
 * @param {Object} theme - Theme object
 * @returns {string} CSS variables
 */
export function generateThemeVariables(theme = baseTheme) {
  return `
    :root {
      /* Colors */
      --color-primary: ${theme.colors.primary};
      --color-secondary: ${theme.colors.secondary};
      --color-success: ${theme.colors.success};
      --color-warning: ${theme.colors.warning};
      --color-error: ${theme.colors.error};
      --color-info: ${theme.colors.info};
      --color-background: ${theme.colors.background};
      --color-surface: ${theme.colors.surface};
      --color-text-primary: ${theme.colors.text.primary};
      --color-text-secondary: ${theme.colors.text.secondary};
      --color-text-disabled: ${theme.colors.text.disabled};
      
      /* Typography */
      --font-family: ${theme.typography.fontFamily};
      --font-size-base: ${theme.typography.fontSize}px;
      --font-weight-light: ${theme.typography.fontWeightLight};
      --font-weight-regular: ${theme.typography.fontWeightRegular};
      --font-weight-medium: ${theme.typography.fontWeightMedium};
      --font-weight-bold: ${theme.typography.fontWeightBold};
      
      /* Spacing */
      --spacing-unit: ${theme.spacing}px;
      --spacing-xs: calc(var(--spacing-unit) * 0.5);
      --spacing-sm: var(--spacing-unit);
      --spacing-md: calc(var(--spacing-unit) * 2);
      --spacing-lg: calc(var(--spacing-unit) * 3);
      --spacing-xl: calc(var(--spacing-unit) * 4);
      
      /* Borders */
      --border-radius: ${theme.borderRadius}px;
      --border-radius-sm: calc(var(--border-radius) * 0.5);
      --border-radius-lg: calc(var(--border-radius) * 2);
      --border-radius-xl: calc(var(--border-radius) * 3);
      --border-radius-circle: 50%;
      
      /* Shadows */
      --shadow-none: ${theme.shadows[0]};
      --shadow-sm: ${theme.shadows[1]};
      --shadow-md: ${theme.shadows[2]};
      --shadow-lg: ${theme.shadows[3]};
      
      /* Transitions */
      --transition-easing-standard: ${theme.transitions.easing.easeInOut};
      --transition-easing-accelerate: ${theme.transitions.easing.easeIn};
      --transition-easing-decelerate: ${theme.transitions.easing.easeOut};
      --transition-duration-short: ${theme.transitions.duration.short}ms;
      --transition-duration-standard: ${theme.transitions.duration.standard}ms;
      --transition-duration-complex: ${theme.transitions.duration.complex}ms;
    }
  `;
}

/**
 * Create platform-specific styles
 * @param {Object} baseStyles - Base styles object
 * @param {Object} platformOverrides - Platform-specific style overrides
 * @returns {Object} Combined styles
 */
export function createPlatformStyles(baseStyles, platformOverrides = {}) {
  const deviceType = typeof window !== 'undefined' ? detectDeviceType() : DEVICE_TYPES.WEB;
  
  // Get platform-specific overrides or empty object if not defined
  const overrides = platformOverrides[deviceType] || {};
  
  // Merge base styles with platform overrides
  return {
    ...baseStyles,
    ...overrides,
  };
}

export default {
  baseTheme,
  platformThemes,
  getPlatformTheme,
  generateThemeVariables,
  createPlatformStyles,
};
