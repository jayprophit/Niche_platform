/**
 * Cross-platform navigation component
 * Adapts navigation style based on device type
 */

import React, { useState, useEffect } from 'react';
import { detectDeviceType, DEVICE_TYPES } from './deviceDetection';
import { useDeviceInfo } from './ResponsiveLayout';

/**
 * Adaptive navigation component that changes based on device type
 * @param {Object} props - Component props
 * @param {Array} props.items - Navigation items
 * @param {Object} props.styles - Custom styles
 * @returns {React.ReactNode} Navigation component
 */
export function AdaptiveNavigation({ items = [], styles = {} }) {
  const { type: deviceType } = useDeviceInfo();
  
  // Determine navigation type based on device
  const getNavigationType = () => {
    switch (deviceType) {
      case DEVICE_TYPES.DESKTOP:
        return 'sidebar';
      case DEVICE_TYPES.TABLET:
        return 'top';
      case DEVICE_TYPES.MOBILE:
        return 'bottom';
      case DEVICE_TYPES.WEARABLE:
        return 'minimal';
      case DEVICE_TYPES.IOT:
        return 'voice';
      default:
        return 'top';
    }
  };
  
  const navigationType = getNavigationType();
  
  // Render appropriate navigation based on type
  switch (navigationType) {
    case 'sidebar':
      return <SidebarNavigation items={items} styles={styles} />;
    case 'top':
      return <TopNavigation items={items} styles={styles} />;
    case 'bottom':
      return <BottomNavigation items={items} styles={styles} />;
    case 'minimal':
      return <MinimalNavigation items={items} styles={styles} />;
    case 'voice':
      return <VoiceNavigation items={items} styles={styles} />;
    default:
      return <TopNavigation items={items} styles={styles} />;
  }
}

/**
 * Desktop sidebar navigation
 */
function SidebarNavigation({ items, styles }) {
  return (
    <div className="sidebar-navigation" style={styles.container}>
      <div className="sidebar-logo" style={styles.logo}>
        <img src="/logo.png" alt="Logo" />
      </div>
      <nav className="sidebar-menu" style={styles.menu}>
        <ul style={styles.list}>
          {items.map((item, index) => (
            <li key={index} style={styles.item}>
              <a href={item.url} style={styles.link}>
                {item.icon && <span className="icon">{item.icon}</span>}
                <span className="label">{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

/**
 * Tablet/Desktop top navigation
 */
function TopNavigation({ items, styles }) {
  return (
    <header className="top-navigation" style={styles.container}>
      <div className="top-logo" style={styles.logo}>
        <img src="/logo.png" alt="Logo" />
      </div>
      <nav className="top-menu" style={styles.menu}>
        <ul style={{ ...styles.list, display: 'flex' }}>
          {items.map((item, index) => (
            <li key={index} style={{ ...styles.item, margin: '0 10px' }}>
              <a href={item.url} style={styles.link}>
                {item.icon && <span className="icon">{item.icon}</span>}
                <span className="label">{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <div className="top-actions" style={styles.actions}>
        {/* User profile, notifications, etc. */}
      </div>
    </header>
  );
}

/**
 * Mobile bottom navigation
 */
function BottomNavigation({ items, styles }) {
  // Limit items for mobile navigation
  const mobileItems = items.slice(0, 5);
  
  return (
    <nav className="bottom-navigation" style={{ 
      ...styles.container, 
      position: 'fixed', 
      bottom: 0, 
      left: 0, 
      right: 0,
      display: 'flex',
      justifyContent: 'space-around',
      background: 'white',
      boxShadow: '0 -2px 5px rgba(0,0,0,0.1)',
      zIndex: 1000
    }}>
      {mobileItems.map((item, index) => (
        <a 
          key={index} 
          href={item.url} 
          style={{ 
            ...styles.item, 
            flex: 1, 
            textAlign: 'center',
            padding: '10px 0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          {item.icon && <span className="icon" style={{ fontSize: '24px' }}>{item.icon}</span>}
          <span className="label" style={{ fontSize: '12px' }}>{item.label}</span>
        </a>
      ))}
    </nav>
  );
}

/**
 * Minimal navigation for wearables
 */
function MinimalNavigation({ items, styles }) {
  // Very limited items for wearable devices
  const wearableItems = items.slice(0, 3);
  
  return (
    <nav className="minimal-navigation" style={{ 
      ...styles.container, 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {wearableItems.map((item, index) => (
        <a 
          key={index} 
          href={item.url} 
          style={{ 
            ...styles.item, 
            margin: '5px 0',
            padding: '8px',
            borderRadius: '50%',
            background: '#f0f0f0',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '40px',
            height: '40px'
          }}
        >
          {item.icon && <span className="icon">{item.icon}</span>}
        </a>
      ))}
    </nav>
  );
}

/**
 * Voice-based navigation for IoT devices
 */
function VoiceNavigation({ items, styles }) {
  return (
    <div className="voice-navigation" style={styles.container}>
      <div className="voice-prompt" style={styles.prompt}>
        <p>Say "Menu" followed by an option:</p>
        <ul style={styles.list}>
          {items.map((item, index) => (
            <li key={index} style={styles.item}>
              "{item.label}"
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AdaptiveNavigation;
