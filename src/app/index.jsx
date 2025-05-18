import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

// Import responsive components
import { ResponsiveLayout } from '../lib/responsive/ResponsiveLayout';
import { AdaptiveNavigation } from '../lib/responsive/AdaptiveNavigation';
import { deviceDetection } from '../lib/responsive/deviceDetection';

// Import core components
import { CoreLayout } from '../components/core/CoreLayout';

// Import social components
import { SocialComponents } from '../components/social/SocialComponents';
import { GroupComponents } from '../components/social/GroupComponents';
import { EventComponents } from '../components/social/EventComponents';

// Import e-commerce components
import { EcommerceComponents } from '../components/ecommerce/EcommerceComponents';
import { EnhancedProductComponents } from '../components/ecommerce/EnhancedProductComponents';

// Import e-learning components
import { ElearningComponents } from '../components/elearning/ElearningComponents';

// Import blogging components
import { BloggingComponents } from '../components/blogging/BloggingComponents';

// Import gamification components
import { GamificationComponents } from '../components/gamification/GamificationComponents';

// Import chat components
import { ChatComponents } from '../components/chat/ChatComponents';

// Import job marketplace components
import { JobMarketplaceComponents } from '../components/jobs/JobMarketplaceComponents';

// Import blockchain components
import { BlockchainComponents } from '../components/blockchain/BlockchainComponents';

// Import AI components
import { AIComponents } from '../components/ai/AIComponents';

// Import BuddyBoss components
import { BuddyBossComponents } from '../components/buddyboss/BuddyBossComponents';
import { BuddyBossLayout } from '../components/buddyboss/BuddyBossLayout';
import { BuddyBossNotifications } from '../components/buddyboss/BuddyBossNotifications';

// Import business components
import { BusinessComponents } from '../components/business/BusinessComponents';
import { JobMarketplaceComponents as BusinessJobComponents } from '../components/business/JobMarketplaceComponents';

// Import integration components
import { ExternalPlatformComponents } from '../components/integration/ExternalPlatformComponents';
import { ComponentAdapter } from '../lib/integration/ComponentAdapter';
import { ExistingComponentIntegration } from '../lib/integration/ExistingComponentIntegration';

// Import age restriction components
import { 
  AgeVerificationModal, 
  ParentalConsentModal, 
  PurchaseConsentModal,
  ContentRestrictionBanner,
  AgeRestrictionProvider,
  useAgeRestriction
} from '../components/restrictions/AgeRestrictionComponents';

// Main App Component
const UnifiedPlatformApp = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deviceType, setDeviceType] = useState('desktop');
  const router = useRouter();
  
  useEffect(() => {
    // Detect device type
    const device = deviceDetection();
    setDeviceType(device);
    
    // Simulate user authentication
    setTimeout(() => {
      setCurrentUser({
        id: 'user123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        avatar: '/images/avatar.png',
        role: 'user',
        age: 25,
        preferences: {
          theme: 'light',
          notifications: true,
          privacy: 'friends'
        }
      });
      setIsLoading(false);
    }, 1000);
  }, []);
  
  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading Unified Platform...</p>
      </div>
    );
  }
  
  return (
    <AgeRestrictionProvider>
      <div className={`unified-platform ${deviceType}`}>
        <BuddyBossLayout user={currentUser}>
          <AdaptiveNavigation deviceType={deviceType} user={currentUser} />
          
          <main className="platform-content">
            {router.pathname === '/' && <HomePage user={currentUser} />}
            {router.pathname === '/social' && <SocialPage user={currentUser} />}
            {router.pathname === '/shop' && <ShopPage user={currentUser} />}
            {router.pathname === '/learn' && <LearnPage user={currentUser} />}
            {router.pathname === '/blog' && <BlogPage user={currentUser} />}
            {router.pathname === '/jobs' && <JobsPage user={currentUser} />}
            {router.pathname === '/chat' && <ChatPage user={currentUser} />}
            {router.pathname === '/profile' && <ProfilePage user={currentUser} />}
            {router.pathname === '/dashboard' && <DashboardPage user={currentUser} />}
          </main>
          
          <BuddyBossNotifications user={currentUser} />
        </BuddyBossLayout>
      </div>
    </AgeRestrictionProvider>
  );
};

// Home Page Component
const HomePage = ({ user }) => {
  const { checkAgeRestriction, verifyAge } = useAgeRestriction();
  
  return (
    <ResponsiveLayout>
      <div className="home-page">
        <section className="hero-section">
          <div className="hero-content">
            <h1>Welcome to the Unified Platform</h1>
            <p>Your all-in-one platform for social networking, e-commerce, e-learning, and more.</p>
            <div className="hero-actions">
              <Link href="/social">
                <a className="primary-btn">Explore Social</a>
              </Link>
              <Link href="/shop">
                <a className="secondary-btn">Shop Now</a>
              </Link>
              <Link href="/learn">
                <a className="secondary-btn">Start Learning</a>
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <img src="/images/hero-image.png" alt="Unified Platform" />
          </div>
        </section>
        
        <section className="features-section">
          <h2>Platform Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="social-icon"></i>
              </div>
              <h3>Social Networking</h3>
              <p>Connect with friends, join groups, and share your experiences.</p>
              <Link href="/social">
                <a className="feature-link">Explore Social</a>
              </Link>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="shop-icon"></i>
              </div>
              <h3>E-Commerce</h3>
              <p>Buy and sell products with enhanced interactive features.</p>
              <Link href="/shop">
                <a className="feature-link">Shop Now</a>
              </Link>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="learn-icon"></i>
              </div>
              <h3>E-Learning</h3>
              <p>Take courses, earn certificates, and advance your career.</p>
              <Link href="/learn">
                <a className="feature-link">Start Learning</a>
              </Link>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="blog-icon"></i>
              </div>
              <h3>Blogging</h3>
              <p>Create and share articles, stories, and insights.</p>
              <Link href="/blog">
                <a className="feature-link">Read Blog</a>
              </Link>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="jobs-icon"></i>
              </div>
              <h3>Job Marketplace</h3>
              <p>Find jobs, showcase your skills, and connect with employers.</p>
              <Link href="/jobs">
                <a className="feature-link">Find Jobs</a>
              </Link>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="chat-icon"></i>
              </div>
              <h3>Chat & Communication</h3>
              <p>Message friends, join chat rooms, and video conference.</p>
              {checkAgeRestriction(13) ? (
                <Link href="/chat">
                  <a className="feature-link">Start Chatting</a>
                </Link>
              ) : (
                <button className="feature-link" onClick={() => verifyAge(13, '/')}>
                  Verify Age to Chat
                </button>
              )}
            </div>
          </div>
        </section>
        
        <section className="ai-section">
          <div className="ai-content">
            <h2>AI-Powered Features</h2>
            <p>Experience the power of artificial intelligence across our platform.</p>
            <ul className="ai-features-list">
              <li>Personalized recommendations</li>
              <li>Intelligent content creation</li>
              <li>Advanced analytics</li>
              <li>Smart assistant</li>
            </ul>
            <Link href="/ai">
              <a className="primary-btn">Explore AI Features</a>
            </Link>
          </div>
          <div className="ai-image">
            <img src="/images/ai-features.png" alt="AI Features" />
          </div>
        </section>
        
        <section className="blockchain-section">
          <div className="blockchain-image">
            <img src="/images/blockchain-features.png" alt="Blockchain Features" />
          </div>
          <div className="blockchain-content">
            <h2>Blockchain Integration</h2>
            <p>Secure transactions, smart contracts, and digital ownership.</p>
            <ul className="blockchain-features-list">
              <li>Blockchain-verified certificates</li>
              <li>Secure transactions</li>
              <li>Smart contracts</li>
              <li>Digital asset ownership</li>
            </ul>
            <Link href="/blockchain">
              <a className="primary-btn">Explore Blockchain</a>
            </Link>
          </div>
        </section>
      </div>
    </ResponsiveLayout>
  );
};

// Social Page Component
const SocialPage = ({ user }) => {
  const [activeTab, setActiveTab] = useState('feed');
  
  return (
    <ResponsiveLayout>
      <div className="social-page">
        <div className="page-header">
          <h1>Social Network</h1>
          <div className="page-tabs">
            <button 
              className={`tab-btn ${activeTab === 'feed' ? 'active' : ''}`}
              onClick={() => setActiveTab('feed')}
            >
              Feed
            </button>
            <button 
              className={`tab-btn ${activeTab === 'groups' ? 'active' : ''}`}
              onClick={() => setActiveTab('groups')}
            >
              Groups
            </button>
            <button 
              className={`tab-btn ${activeTab === 'events' ? 'active' : ''}`}
              onClick={() => setActiveTab('events')}
            >
              Events
            </button>
            <button 
              className={`tab-btn ${activeTab === 'friends' ? 'active' : ''}`}
              onClick={() => setActiveTab('friends')}
            >
              Friends
            </button>
          </div>
        </div>
        
        <div className="social-content">
          {activeTab === 'feed' && (
            <div className="feed-container">
              <SocialComponents.CreatePost user={user} />
              <SocialComponents.PostsFeed user={user} />
            </div>
          )}
          
          {activeTab === 'groups' && (
            <div className="groups-container">
              <GroupComponents.GroupsDirectory user={user} />
            </div>
          )}
          
          {activeTab === 'events' && (
            <div className="events-container">
              <EventComponents.EventsCalendar user={user} />
              <EventComponents.UpcomingEvents user={user} />
            </div>
          )}
          
          {activeTab === 'friends' && (
            <div className="friends-container">
              <SocialComponents.FriendsList user={user} />
              <SocialComponents.FriendSuggestions user={user} />
            </div>
          )}
        </div>
      </div>
    </ResponsiveLayout>
  );
};

// Shop Page Component
const ShopPage = ({ user }) => {
  const [activeTab, setActiveTab] = useState('products');
  
  return (
    <ResponsiveLayout>
      <div className="shop-page">
        <div className="page-header">
          <h1>E-Commerce Platform</h1>
          <div className="page-tabs">
            <button 
              className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
            >
              Products
            </button>
            <button 
              className={`tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
              onClick={() => setActiveTab('categories')}
            >
              Categories
            </button>
            <button 
              className={`tab-btn ${activeTab === 'cart' ? 'active' : ''}`}
              onClick={() => setActiveTab('cart')}
            >
              Cart
            </button>
            <button 
              className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              Orders
            </button>
          </div>
        </div>
        
        <div className="shop-content">
          {activeTab === 'products' && (
            <div className="products-container">
              <EcommerceComponents.ProductListing user={user} />
            </div>
          )}
          
          {activeTab === 'categories' && (
            <div className="categories-container">
              <EcommerceComponents.CategoryBrowser user={user} />
            </div>
          )}
          
          {activeTab === 'cart' && (
            <div className="cart-container">
              <EcommerceComponents.ShoppingCart user={user} />
            </div>
          )}
          
          {activeTab === 'orders' && (
            <div className="orders-container">
              <EcommerceComponents.OrderHistory user={user} />
            </div>
          )}
        </div>
      </div>
    </ResponsiveLayout>
  );
};

// Learn Page Component
const LearnPage = ({ user }) => {
  const [activeTab, setActiveTab] = useState('courses');
  
  return (
    <ResponsiveLayout>
      <div className="learn-page">
        <div className="page-header">
          <h1>E-Learning Platform</h1>
          <div className="page-tabs">
            <button 
              className={`tab-btn ${activeTab === 'courses' ? 'active' : ''}`}
              onClick={() => setActiveTab('courses')}
            >
              Courses
            </button>
            <button 
              className={`tab-btn ${activeTab === 'my-courses' ? 'active' : ''}`}
              onClick={() => setActiveTab('my-courses')}
            >
              My Courses
            </button>
            <button 
              className={`tab-btn ${activeTab === 'certificates' ? 'active' : ''}`}
              onClick={() => setActiveTab('certificates')}
            >
              Certificates
            </button>
            <button 
              className={`tab-btn ${activeTab === 'instructors' ? 'active' : ''}`}
              onClick={() => setActiveTab('instructors')}
            >
              Instructors
            </button>
          </div>
        </div>
        
        <div className="learn-content">
          {activeTab === 'courses' && (
 <response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>