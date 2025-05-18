/**
 * Core Platform Routing
 * Implements the main application routes and page structure
 */

import React from 'react';
import {
  AppLayout,
  SocialLayout,
  ShopLayout,
  LearnLayout,
  BlogLayout,
  JobsLayout,
  DashboardLayout
} from './CoreLayout';

/**
 * Home page component
 */
export function HomePage({ user, featuredProducts = [], featuredCourses = [], recentPosts = [] }) {
  return (
    <AppLayout user={user}>
      <div className="home-page">
        <section className="hero-section">
          <div className="hero-content">
            <h1>Welcome to the Unified Platform</h1>
            <p>Connect, shop, learn, and grow with our all-in-one platform</p>
            <div className="hero-buttons">
              <a href="/register" className="primary-button">Join Now</a>
              <a href="/about" className="secondary-button">Learn More</a>
            </div>
          </div>
        </section>
        
        <section className="features-section">
          <h2>Everything You Need in One Place</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🌐</div>
              <h3>Social Networking</h3>
              <p>Connect with friends, join groups, and share your experiences</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🛒</div>
              <h3>E-Commerce</h3>
              <p>Discover and purchase products with interactive previews</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3>E-Learning</h3>
              <p>Take courses and earn certificates to advance your career</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📝</div>
              <h3>Blogging</h3>
              <p>Share your knowledge and insights with the community</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">💼</div>
              <h3>Job Marketplace</h3>
              <p>Find opportunities and connect with employers</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🏆</div>
              <h3>Gamification</h3>
              <p>Earn rewards and track your progress across the platform</p>
            </div>
          </div>
        </section>
        
        {featuredProducts.length > 0 && (
          <section className="featured-products-section">
            <h2>Featured Products</h2>
            <div className="products-grid">
              {featuredProducts.map((product, index) => (
                <div key={index} className="product-card">
                  <div className="product-image">
                    <img src={product.thumbnail} alt={product.name} />
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="product-price">${product.price.toFixed(2)}</p>
                    <a href={`/shop/product/${product.id}`} className="view-product-button">
                      View Product
                    </a>
                  </div>
                </div>
              ))}
            </div>
            <div className="section-action">
              <a href="/shop" className="view-all-button">View All Products</a>
            </div>
          </section>
        )}
        
        {featuredCourses.length > 0 && (
          <section className="featured-courses-section">
            <h2>Featured Courses</h2>
            <div className="courses-grid">
              {featuredCourses.map((course, index) => (
                <div key={index} className="course-card">
                  <div className="course-image">
                    <img src={course.thumbnail} alt={course.title} />
                  </div>
                  <div className="course-info">
                    <h3>{course.title}</h3>
                    <p className="course-instructor">by {course.instructor}</p>
                    <div className="course-meta">
                      <span className="course-duration">{course.duration}</span>
                      <span className="course-level">{course.level}</span>
                    </div>
                    <a href={`/learn/course/${course.id}`} className="view-course-button">
                      View Course
                    </a>
                  </div>
                </div>
              ))}
            </div>
            <div className="section-action">
              <a href="/learn" className="view-all-button">View All Courses</a>
            </div>
          </section>
        )}
        
        {recentPosts.length > 0 && (
          <section className="recent-posts-section">
            <h2>Recent Blog Posts</h2>
            <div className="posts-grid">
              {recentPosts.map((post, index) => (
                <div key={index} className="post-card">
                  <div className="post-image">
                    <img src={post.thumbnail} alt={post.title} />
                  </div>
                  <div className="post-info">
                    <h3>{post.title}</h3>
                    <p className="post-meta">
                      <span className="post-author">by {post.author}</span>
                      <span className="post-date">{new Date(post.publishedAt).toLocaleDateString()}</span>
                    </p>
                    <p className="post-excerpt">{post.excerpt}</p>
                    <a href={`/blog/${post.slug}`} className="read-more-button">
                      Read More
                    </a>
                  </div>
                </div>
              ))}
            </div>
            <div className="section-action">
              <a href="/blog" className="view-all-button">View All Posts</a>
            </div>
          </section>
        )}
        
        <section className="cta-section">
          <div className="cta-content">
            <h2>Ready to Get Started?</h2>
            <p>Join our community today and experience the power of our unified platform.</p>
            <a href="/register" className="cta-button">Sign Up Now</a>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}

/**
 * Social home page component
 */
export function SocialHomePage({ user, activityFeed = [], suggestedGroups = [], suggestedFriends = [] }) {
  return (
    <SocialLayout user={user}>
      <div className="social-home-page">
        <div className="social-main-content">
          <div className="create-post-card">
            <div className="post-input-container">
              <img 
                src={user?.avatar || '/default-avatar.jpg'} 
                alt={user?.displayName || 'User'} 
                className="user-avatar"
              />
              <div className="post-input">
                <textarea placeholder="What's on your mind?"></textarea>
              </div>
            </div>
            <div className="post-actions">
              <button className="post-action-button">
                <span className="icon-photo"></span> Photo
              </button>
              <button className="post-action-button">
                <span className="icon-video"></span> Video
              </button>
              <button className="post-action-button">
                <span className="icon-event"></span> Event
              </button>
              <button className="post-button">Post</button>
            </div>
          </div>
          
          <div className="activity-feed">
            {activityFeed.map((activity, index) => (
              <div key={index} className="activity-card">
                <div className="activity-header">
                  <img 
                    src={activity.user.avatar || '/default-avatar.jpg'} 
                    alt={activity.user.displayName} 
                    className="user-avatar"
                  />
                  <div className="activity-meta">
                    <div className="activity-user">{activity.user.displayName}</div>
                    <div className="activity-time">{activity.timeAgo}</div>
                  </div>
                </div>
                
                <div className="activity-content">
                  <p>{activity.content}</p>
                  
                  {activity.media && activity.media.type === 'image' && (
                    <div className="activity-image">
                      <img src={activity.media.url} alt="" />
                    </div>
                  )}
                  
                  {activity.media && activity.media.type === 'video' && (
                    <div className="activity-video">
                      <video src={activity.media.url} controls></video>
                    </div>
                  )}
                </div>
                
                <div className="activity-stats">
                  <div className="activity-likes">
                    <span className="icon-heart"></span> {activity.likeCount} Likes
                  </div>
                  <div className="activity-comments">
                    <span className="icon-comment"></span> {activity.commentCount} Comments
                  </div>
                  <div className="activity-shares">
                    <span className="icon-share"></span> {activity.shareCount} Shares
                  </div>
                </div>
                
                <div className="activity-actions">
                  <button className="activity-action-button">
                    <span className="icon-heart"></span> Like
                  </button>
                  <button className="activity-action-button">
                    <span className="icon-comment"></span> Comment
                  </button>
                  <button className="activity-action-button">
                    <span className="icon-share"></span> Share
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="social-sidebar">
          <div className="sidebar-section">
            <h3>Suggested Groups</h3>
            <div className="suggested-groups">
              {suggestedGroups.map((group, index) => (
                <div key={index} className="suggested-group">
                  <img 
                    src={group.avatar || '/default-group-avatar.jpg'} 
                    alt={group.name} 
                    className="group-avatar"
                  />
                  <div className="group-info">
                    <div className="group-name">{group.name}</div>
                    <div className="group-members">{group.memberCount} members</div>
                  </div>
                  <button className="join-button">Join</button>
                </div>
              ))}
            </div>
            <a href="/groups" className="view-all-link">View All Groups</a>
          </div>
          
          <div className="sidebar-section">
            <h3>People You May Know</h3>
            <div className="suggested-friends">
              {suggestedFriends.map((friend, index) => (
                <div key={index} className="suggested-friend">
                  <img 
                    src={friend.avatar || '/default-avatar.jpg'} 
                    alt={friend.displayName} 
                    className="friend-avatar"
                  />
                  <div className="friend-info">
                    <div className="friend-name">{friend.displayName}</div>
                    <div className="friend-mutuals">
                      {friend.mutualFriends} mutual {friend.mutualFriends === 1 ? 'friend' : 'friends'}
                    </div>
                  </div>
                  <button className="add-friend-button">Add</button>
                </div>
              ))}
            </div>
            <a href="/members" className="view-all-link">View All Members</a>
          </div>
          
          <div className="sidebar-section">
            <h3>Upcoming Events</h3>
            <div className="upcoming-events">
              {/* Events will be populated here */}
              <div className="no-events">No upcoming events</div>
            </div>
            <a href="/events" className="view-all-link">View All Events</a>
          </div>
        </div>
      </div>
    </SocialLayout>
  );
}

/**
 * Shop home page component
 */
export function ShopHomePage({ 
  user, 
  featuredProducts = [], 
  categories = [], 
  newArrivals = [], 
  bestSellers = [] 
}) {
  return (
    <ShopLayout user={user} categories={categories}>
      <div className="shop-home-page">
        <div className="shop-hero">
          <div className="shop-hero-content">
            <h1>Discover Amazing Products</h1>
            <p>Explore our collection of unique items with interactive previews</p>
            <div className="shop-hero-search">
              <input type="text" placeholder="Search products..." />
              <button className="search-button">Search</button>
            </div>
          </div>
        </div>
        
        <div className="featured-categories">
          <h2>Shop by Category</h2>
          <div className="category-grid">
            {categories.slice(0, 6).map((category, index) => (
              <a 
                key={index} 
                href={`/shop/category/${category.slug}`} 
                className="category-card"
                style={{ backgroundImage: `url(${category.image})` }}
              >
                <div className="category-overlay">
                  <h3>{category.name}</h3>
                  <span className="category-count">{category.productCount} products</span>
                </div>
              </a>
            ))}
          </div>
        </div>
        
        <div className="featured-products">
          <h2>Featured Products</h2>
          <div className="product-grid">
            {featuredProducts.map((product, index) => (
              <div key={index} className="product-card">
                <div className="product-badge">
                  {product.isNew && <span className="badge badge-new">New</span>}
                  {product.isOnSale && <span className="badge badge-sale">Sale</span>}
                </div>
                <div className="product-image">
                  <img src={product.thumbnail} alt={product.name} />
                  <div className="product-actions">
                    <button className="product-action-button">
                      <span className="icon-heart"></span>
                    </button>
                    <button className="product-action-button">
                      <span className="icon-cart"></span>
                    </button>
                    <button className="product-action-button">
                      <span className="icon-eye"></span>
                    </button>
                  </div>
                </div>
                <div className="product-info">
                  <div className="product-category">{product.category}</div>
                  <h3 className="product-name">{product.name}</h3>
                  <div className="product-price">
                    {product.isOnSale && (
                      <span className="product-original-price">${product.originalPrice.toFixed(2)}</span>
                    )}
                    <span className="product-current-price">${product.price.toFixed(2)}</span>
                  </div>
                  <div className="product-rating">
                    <div className="rating-stars">
                      {/* Rating stars would be rendered here */}
                      ★★★★☆
                    </div>
                    <span cla<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>