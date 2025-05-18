/**
 * Core Platform Structure
 * Main application layout and routing for the unified platform
 */

import React from 'react';
import { BuddyBossLayout } from '../components/buddyboss/BuddyBossLayout';
import { NotificationCenter } from '../components/buddyboss/BuddyBossNotifications';
import { useDeviceInfo } from '../lib/responsive/ResponsiveLayout';
import { ExternalLinksDisplay } from '../components/integration/ExternalPlatformComponents';

/**
 * Main application layout component
 */
export function AppLayout({ children, user, notifications = [] }) {
  const { type: deviceType } = useDeviceInfo();
  
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="app-logo">
          <a href="/">
            <img src="/logo.svg" alt="Unified Platform" />
          </a>
        </div>
        
        <nav className="app-navigation">
          <ul className="nav-list">
            <li className="nav-item">
              <a href="/" className="nav-link">Home</a>
            </li>
            <li className="nav-item">
              <a href="/social" className="nav-link">Social</a>
            </li>
            <li className="nav-item">
              <a href="/shop" className="nav-link">Shop</a>
            </li>
            <li className="nav-item">
              <a href="/learn" className="nav-link">Learn</a>
            </li>
            <li className="nav-item">
              <a href="/blog" className="nav-link">Blog</a>
            </li>
            <li className="nav-item">
              <a href="/jobs" className="nav-link">Jobs</a>
            </li>
          </ul>
        </nav>
        
        <div className="app-actions">
          <div className="app-search">
            <input type="text" placeholder="Search..." />
            <button className="search-button">
              <span className="icon-search"></span>
            </button>
          </div>
          
          <NotificationCenter notifications={notifications} />
          
          {user ? (
            <div className="user-menu">
              <img 
                src={user.avatar || '/default-avatar.jpg'} 
                alt={user.displayName} 
                className="user-avatar"
              />
              <div className="user-dropdown">
                <a href={`/profile/${user.username}`}>My Profile</a>
                <a href="/dashboard">Dashboard</a>
                <a href="/settings">Settings</a>
                <a href="/logout">Logout</a>
              </div>
            </div>
          ) : (
            <div className="auth-buttons">
              <a href="/login" className="login-button">Login</a>
              <a href="/register" className="register-button">Register</a>
            </div>
          )}
        </div>
      </header>
      
      <main className="app-main">
        {children}
      </main>
      
      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>About Us</h3>
            <p>Our unified platform combines social networking, e-commerce, e-learning, and more in one seamless experience.</p>
          </div>
          
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><a href="/about">About</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms of Service</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3>Connect With Us</h3>
            <ExternalLinksDisplay 
              links={[
                { platform: 'facebook', url: 'https://facebook.com/unifiedplatform', isPublic: true },
                { platform: 'twitter', url: 'https://twitter.com/unifiedplatform', isPublic: true },
                { platform: 'instagram', url: 'https://instagram.com/unifiedplatform', isPublic: true },
                { platform: 'linkedin', url: 'https://linkedin.com/company/unifiedplatform', isPublic: true }
              ]}
              displayStyle="icons"
            />
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Unified Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

/**
 * Social section layout
 */
export function SocialLayout({ children, user }) {
  return (
    <BuddyBossLayout>
      {children}
    </BuddyBossLayout>
  );
}

/**
 * E-commerce section layout
 */
export function ShopLayout({ children, categories = [] }) {
  return (
    <div className="shop-layout">
      <aside className="shop-sidebar">
        <div className="shop-categories">
          <h3>Categories</h3>
          <ul>
            {categories.map((category, index) => (
              <li key={index}>
                <a href={`/shop/category/${category.slug}`}>{category.name}</a>
                {category.subcategories && category.subcategories.length > 0 && (
                  <ul>
                    {category.subcategories.map((subcategory, subIndex) => (
                      <li key={subIndex}>
                        <a href={`/shop/category/${category.slug}/${subcategory.slug}`}>
                          {subcategory.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="shop-filters">
          <h3>Filters</h3>
          {/* Filter components will be added here */}
        </div>
      </aside>
      
      <div className="shop-content">
        {children}
      </div>
    </div>
  );
}

/**
 * E-learning section layout
 */
export function LearnLayout({ children, categories = [] }) {
  return (
    <div className="learn-layout">
      <aside className="learn-sidebar">
        <div className="learn-categories">
          <h3>Categories</h3>
          <ul>
            {categories.map((category, index) => (
              <li key={index}>
                <a href={`/learn/category/${category.slug}`}>{category.name}</a>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="learn-filters">
          <h3>Filters</h3>
          {/* Filter components will be added here */}
        </div>
      </aside>
      
      <div className="learn-content">
        {children}
      </div>
    </div>
  );
}

/**
 * Blog section layout
 */
export function BlogLayout({ children, categories = [], recentPosts = [] }) {
  return (
    <div className="blog-layout">
      <div className="blog-content">
        {children}
      </div>
      
      <aside className="blog-sidebar">
        <div className="blog-categories">
          <h3>Categories</h3>
          <ul>
            {categories.map((category, index) => (
              <li key={index}>
                <a href={`/blog/category/${category.slug}`}>{category.name}</a>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="blog-recent-posts">
          <h3>Recent Posts</h3>
          <ul>
            {recentPosts.map((post, index) => (
              <li key={index}>
                <a href={`/blog/${post.slug}`}>{post.title}</a>
                <span className="post-date">{new Date(post.publishedAt).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}

/**
 * Jobs section layout
 */
export function JobsLayout({ children, categories = [] }) {
  return (
    <div className="jobs-layout">
      <aside className="jobs-sidebar">
        <div className="jobs-categories">
          <h3>Categories</h3>
          <ul>
            {categories.map((category, index) => (
              <li key={index}>
                <a href={`/jobs/category/${category.slug}`}>{category.name}</a>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="jobs-filters">
          <h3>Filters</h3>
          {/* Filter components will be added here */}
        </div>
      </aside>
      
      <div className="jobs-content">
        {children}
      </div>
    </div>
  );
}

/**
 * Dashboard layout
 */
export function DashboardLayout({ children, user, activeSection = 'overview' }) {
  const sidebarItems = [
    { label: 'Overview', url: '/dashboard', icon: '📊', active: activeSection === 'overview' },
    { label: 'Profile', url: '/dashboard/profile', icon: '👤', active: activeSection === 'profile' },
    { label: 'Social', url: '/dashboard/social', icon: '🌐', active: activeSection === 'social' },
    { label: 'Courses', url: '/dashboard/courses', icon: '📚', active: activeSection === 'courses' },
    { label: 'Orders', url: '/dashboard/orders', icon: '🛒', active: activeSection === 'orders' },
    { label: 'Jobs', url: '/dashboard/jobs', icon: '💼', active: activeSection === 'jobs' },
    { label: 'Blog', url: '/dashboard/blog', icon: '📝', active: activeSection === 'blog' },
    { label: 'Messages', url: '/dashboard/messages', icon: '✉️', active: activeSection === 'messages' },
    { label: 'Settings', url: '/dashboard/settings', icon: '⚙️', active: activeSection === 'settings' }
  ];
  
  // Add business-specific items if user has a business account
  if (user?.hasBusiness) {
    sidebarItems.splice(3, 0, 
      { label: 'Business', url: '/dashboard/business', icon: '🏢', active: activeSection === 'business' }
    );
  }
  
  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div className="dashboard-user">
          <img 
            src={user?.avatar || '/default-avatar.jpg'} 
            alt={user?.displayName || 'User'} 
            className="dashboard-avatar"
          />
          <div className="dashboard-user-info">
            <h3>{user?.displayName || 'User'}</h3>
            <p>@{user?.username || 'username'}</p>
          </div>
        </div>
        
        <nav className="dashboard-navigation">
          <ul>
            {sidebarItems.map((item, index) => (
              <li key={index} className={item.active ? 'active' : ''}>
                <a href={item.url}>
                  <span className="dashboard-icon">{item.icon}</span>
                  <span className="dashboard-label">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      
      <div className="dashboard-content">
        {children}
      </div>
    </div>
  );
}

/**
 * Age verification modal component
 */
export function AgeVerificationModal({ onVerify, onCancel, requiredAge = 13 }) {
  return (
    <div className="age-verification-modal">
      <div className="modal-content">
        <h2>Age Verification Required</h2>
        <p>You must be at least {requiredAge} years old to access this content.</p>
        
        <div className="age-verification-buttons">
          <button 
            className="verify-button"
            onClick={() => onVerify(true)}
          >
            I am {requiredAge} or older
          </button>
          <button 
            className="cancel-button"
            onClick={() => onCancel()}
          >
            I am under {requiredAge}
          </button>
        </div>
        
        <p className="verification-note">
          By clicking "I am {requiredAge} or older", you confirm that you meet the age requirement.
        </p>
      </div>
    </div>
  );
}

/**
 * Parental consent modal component
 */
export function ParentalConsentModal({ onConsent, onCancel, childName = '', itemName = '' }) {
  return (
    <div className="parental-consent-modal">
      <div className="modal-content">
        <h2>Parental Consent Required</h2>
        <p>
          {childName ? `${childName} is` : 'Your child is'} requesting permission to 
          {itemName ? ` purchase ${itemName}` : ' make a purchase'}.
        </p>
        
        <div className="consent-form">
          <div className="form-group">
            <label htmlFor="parentName">Parent/Guardian Name</label>
            <input type="text" id="parentName" required />
          </div>
          
          <div className="form-group">
            <label htmlFor="parentEmail">Parent/Guardian Email</label>
            <input type="email" id="parentEmail" required />
          </div>
          
          <div className="form-group checkbox-group">
            <label>
              <input type="checkbox" required />
              I confirm I am the parent or legal guardian
            </label>
          </div>
          
          <div className="form-group checkbox-group">
            <label>
              <input type="checkbox" required />
              I consent to this purchase
            </label>
          </div>
        </div>
        
        <div className="consent-buttons">
          <button 
            className="consent-button"
            onClick={() => onConsent(true)}
          >
            Provide Consent
          </button>
          <button 
            className="cancel-button"
            onClick={() => onCancel()}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default {
  AppLayout,
  SocialLayout,
  ShopLayout,
  LearnLayout,
  BlogLayout,
  JobsLayout,
  DashboardLayout,
  AgeVerificationModal,
  ParentalConsentModal
};
