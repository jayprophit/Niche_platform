/**
 * BuddyBoss-style layout implementation
 * Provides the main layout structure for the social networking platform
 */

import React from 'react';
import { AdaptiveNavigation } from '../../lib/responsive/AdaptiveNavigation';
import { useDeviceInfo } from '../../lib/responsive/ResponsiveLayout';

/**
 * Main BuddyBoss layout component
 */
export function BuddyBossLayout({ children }) {
  const { type: deviceType } = useDeviceInfo();
  
  // Navigation items for the platform
  const navigationItems = [
    { label: 'Home', url: '/', icon: '🏠' },
    { label: 'Activity', url: '/activity', icon: '📝' },
    { label: 'Members', url: '/members', icon: '👥' },
    { label: 'Groups', url: '/groups', icon: '👪' },
    { label: 'Forums', url: '/forums', icon: '💬' },
    { label: 'Courses', url: '/courses', icon: '📚' },
    { label: 'Shop', url: '/shop', icon: '🛒' },
    { label: 'Events', url: '/events', icon: '📅' },
    { label: 'Jobs', url: '/jobs', icon: '💼' },
    { label: 'Blog', url: '/blog', icon: '📰' },
  ];
  
  return (
    <div className="bb-layout">
      <header className="bb-header">
        <div className="bb-header-container">
          <div className="bb-logo">
            <a href="/">
              <img src="/logo.png" alt="Unified Platform" />
            </a>
          </div>
          
          <div className="bb-header-navigation">
            <AdaptiveNavigation items={navigationItems} />
          </div>
          
          <div className="bb-header-actions">
            <div className="bb-search-icon">
              <span className="bb-icon-search"></span>
            </div>
            
            <div className="bb-notifications">
              <span className="bb-icon-bell"></span>
              <span className="bb-notification-count">3</span>
            </div>
            
            <div className="bb-messages">
              <span className="bb-icon-message"></span>
              <span className="bb-message-count">5</span>
            </div>
            
            <div className="bb-user-menu">
              <img src="/default-avatar.jpg" alt="User" />
            </div>
          </div>
        </div>
      </header>
      
      <main className="bb-main">
        {children}
      </main>
      
      <footer className="bb-footer">
        <div className="bb-footer-container">
          <div className="bb-footer-widgets">
            <div className="bb-footer-widget">
              <h3>About Us</h3>
              <p>Our unified platform combines social networking, e-commerce, e-learning, and more in one seamless experience.</p>
            </div>
            
            <div className="bb-footer-widget">
              <h3>Quick Links</h3>
              <ul>
                <li><a href="/about">About</a></li>
                <li><a href="/contact">Contact</a></li>
                <li><a href="/privacy">Privacy Policy</a></li>
                <li><a href="/terms">Terms of Service</a></li>
              </ul>
            </div>
            
            <div className="bb-footer-widget">
              <h3>Connect With Us</h3>
              <div className="bb-social-icons">
                <a href="#" className="bb-social-icon">
                  <span className="bb-icon-facebook"></span>
                </a>
                <a href="#" className="bb-social-icon">
                  <span className="bb-icon-twitter"></span>
                </a>
                <a href="#" className="bb-social-icon">
                  <span className="bb-icon-instagram"></span>
                </a>
                <a href="#" className="bb-social-icon">
                  <span className="bb-icon-linkedin"></span>
                </a>
              </div>
            </div>
          </div>
          
          <div className="bb-footer-bottom">
            <p>&copy; {new Date().getFullYear()} Unified Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

/**
 * Dashboard layout for BuddyBoss
 */
export function BuddyBossDashboard({ children, sidebarItems = [] }) {
  return (
    <div className="bb-dashboard">
      <aside className="bb-dashboard-sidebar">
        <div className="bb-dashboard-user">
          <div className="bb-dashboard-avatar">
            <img src="/default-avatar.jpg" alt="User" />
          </div>
          <div className="bb-dashboard-user-info">
            <h3>John Doe</h3>
            <p>@johndoe</p>
          </div>
        </div>
        
        <nav className="bb-dashboard-navigation">
          <ul>
            {sidebarItems.map((item, index) => (
              <li key={index} className={item.active ? 'active' : ''}>
                <a href={item.url}>
                  {item.icon && <span className="bb-dashboard-icon">{item.icon}</span>}
                  <span className="bb-dashboard-label">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      
      <div className="bb-dashboard-content">
        {children}
      </div>
    </div>
  );
}

/**
 * Profile layout for BuddyBoss
 */
export function BuddyBossProfileLayout({ user, children, isCurrentUser = false }) {
  const { ProfileHeader } = require('./BuddyBossComponents');
  
  return (
    <div className="bb-profile-layout">
      <ProfileHeader user={user} isCurrentUser={isCurrentUser} />
      
      <div className="bb-profile-content-container">
        <div className="bb-profile-main">
          {children}
        </div>
        
        <aside className="bb-profile-sidebar">
          <div className="bb-profile-widget bb-about-widget">
            <h3>About</h3>
            <ul className="bb-profile-details-list">
              <li>
                <span className="bb-detail-label">Location</span>
                <span className="bb-detail-value">{user.location || 'Not specified'}</span>
              </li>
              <li>
                <span className="bb-detail-label">Joined</span>
                <span className="bb-detail-value">{new Date(user.createdAt).toLocaleDateString()}</span>
              </li>
              <li>
                <span className="bb-detail-label">Website</span>
                <span className="bb-detail-value">
                  {user.website ? <a href={user.website}>{user.website}</a> : 'Not specified'}
                </span>
              </li>
            </ul>
          </div>
          
          <div className="bb-profile-widget bb-friends-widget">
            <h3>Friends</h3>
            <div className="bb-friends-grid">
              {user.friends && user.friends.slice(0, 6).map((friend, index) => (
                <a key={index} href={`/profile/${friend.username}`} className="bb-friend-item">
                  <img src={friend.profileImage || '/default-avatar.jpg'} alt={friend.displayName} />
                </a>
              ))}
            </div>
            <a href={`/profile/${user.username}/friends`} className="bb-view-all">View All</a>
          </div>
          
          <div className="bb-profile-widget bb-groups-widget">
            <h3>Groups</h3>
            <div className="bb-groups-list">
              {user.groups && user.groups.slice(0, 3).map((group, index) => (
                <a key={index} href={`/groups/${group.id}`} className="bb-group-item">
                  <div className="bb-group-avatar">
                    <img src={group.avatar || '/default-group-avatar.jpg'} alt={group.name} />
                  </div>
                  <div className="bb-group-info">
                    <h4>{group.name}</h4>
                    <p>{group.memberCount} members</p>
                  </div>
                </a>
              ))}
            </div>
            <a href={`/profile/${user.username}/groups`} className="bb-view-all">View All</a>
          </div>
          
          {user.externalLinks && user.externalLinks.length > 0 && (
            <div className="bb-profile-widget bb-external-links-widget">
              <h3>External Links</h3>
              <ul className="bb-external-links-list">
                {user.externalLinks.map((link, index) => (
                  <li key={index}>
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      <span className={`bb-platform-icon bb-icon-${link.platform}`}></span>
                      <span className="bb-platform-name">{link.platform}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

export default {
  BuddyBossLayout,
  BuddyBossDashboard,
  BuddyBossProfileLayout
};
