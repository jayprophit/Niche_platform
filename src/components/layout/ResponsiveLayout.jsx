/**
 * Responsive layout component for cross-platform compatibility
 * Renders different layouts based on device type
 */

import React, { useEffect, useState } from 'react';
import { detectDeviceType, getPlatformConfig, DEVICE_TYPES } from './deviceDetection';

/**
 * ResponsiveLayout component that adapts to different device types
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @param {Object} props.layouts - Device-specific layout components
 * @returns {React.ReactNode} Responsive layout
 */
export function ResponsiveLayout({ children, layouts = {} }) {
  const [deviceType, setDeviceType] = useState(DEVICE_TYPES.WEB);
  const [config, setConfig] = useState(getPlatformConfig());
  
  useEffect(() => {
    // Detect device type on client side
    const detectedType = detectDeviceType();
    setDeviceType(detectedType);
    setConfig(getPlatformConfig(detectedType));
    
    // Listen for resize events to update device type
    const handleResize = () => {
      const newType = detectDeviceType();
      if (newType !== deviceType) {
        setDeviceType(newType);
        setConfig(getPlatformConfig(newType));
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [deviceType]);
  
  // Select the appropriate layout component based on device type
  const LayoutComponent = layouts[deviceType] || layouts.default;
  
  // If a specific layout component is provided, use it
  if (LayoutComponent) {
    return <LayoutComponent config={config}>{children}</LayoutComponent>;
  }
  
  // Default responsive layout with CSS variables for platform-specific styling
  return (
    <div 
      className={`responsive-container device-${deviceType}`}
      style={{
        '--font-scale': config.fontScale,
        '--spacing-unit': `${config.spacing}px`,
        '--max-content-width': typeof config.maxContentWidth === 'number' ? `${config.maxContentWidth}px` : config.maxContentWidth,
        '--layout-columns': config.layoutColumns || 1,
      }}
    >
      {children}
    </div>
  );
}

/**
 * Desktop layout component
 */
export function DesktopLayout({ children, config }) {
  return (
    <div className="desktop-layout">
      <div className="sidebar">
        <nav className="main-navigation">
          {/* Desktop navigation content */}
        </nav>
      </div>
      <div className="main-content">
        <header className="top-header">
          {/* Header content */}
        </header>
        <main style={{ maxWidth: config.maxContentWidth }}>
          {children}
        </main>
        <footer>
          {/* Footer content */}
        </footer>
      </div>
    </div>
  );
}

/**
 * Mobile layout component
 */
export function MobileLayout({ children, config }) {
  return (
    <div className="mobile-layout">
      <header className="mobile-header">
        {/* Mobile header content */}
      </header>
      <main>
        {children}
      </main>
      <footer className="mobile-navigation">
        {/* Bottom navigation */}
      </footer>
    </div>
  );
}

/**
 * Tablet layout component
 */
export function TabletLayout({ children, config }) {
  return (
    <div className="tablet-layout">
      <header className="tablet-header">
        <nav className="top-navigation">
          {/* Tablet navigation content */}
        </nav>
      </header>
      <main style={{ maxWidth: config.maxContentWidth, margin: '0 auto' }}>
        {children}
      </main>
      <footer>
        {/* Footer content */}
      </footer>
    </div>
  );
}

/**
 * Responsive component that conditionally renders based on device type
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @param {Array<string>} props.showOn - Array of device types to show on
 * @returns {React.ReactNode} Component or null
 */
export function DeviceSpecific({ children, showOn = [] }) {
  const [deviceType, setDeviceType] = useState(null);
  
  useEffect(() => {
    setDeviceType(detectDeviceType());
    
    const handleResize = () => {
      setDeviceType(detectDeviceType());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  if (!deviceType || !showOn.includes(deviceType)) {
    return null;
  }
  
  return <>{children}</>;
}

/**
 * Hook to get current device type and configuration
 * @returns {Object} Device type and configuration
 */
export function useDeviceInfo() {
  const [deviceInfo, setDeviceInfo] = useState({
    type: typeof window !== 'undefined' ? detectDeviceType() : DEVICE_TYPES.WEB,
    config: getPlatformConfig(),
  });
  
  useEffect(() => {
    const handleResize = () => {
      const type = detectDeviceType();
      setDeviceInfo({
        type,
        config: getPlatformConfig(type),
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return deviceInfo;
}

// Default layouts for export
export const defaultLayouts = {
  [DEVICE_TYPES.DESKTOP]: DesktopLayout,
  [DEVICE_TYPES.MOBILE]: MobileLayout,
  [DEVICE_TYPES.TABLET]: TabletLayout,
  default: DesktopLayout,
};
