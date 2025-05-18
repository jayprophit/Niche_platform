/**
 * Blogging Components
 * Core components for blogging functionality
 */

import React, { useState, useEffect } from 'react';
import { useDeviceInfo } from '../../lib/responsive/ResponsiveLayout';
import { ExternalLinksDisplay } from '../../components/integration/ExternalPlatformComponents';

/**
 * Article listing component
 */
export function ArticleListing({ articles = [], onArticleSelect, filters = {}, onFilterChange }) {
  const [filteredArticles, setFilteredArticles] = useState(articles);
  const [sortOption, setSortOption] = useState('recent');
  const deviceInfo = useDeviceInfo();
  
  // Apply filters and sorting whenever articles or filters change
  useEffect(() => {
    let result = [...articles];
    
    // Apply category filter
    if (filters.category) {
      result = result.filter(article => 
        article.category === filters.category || 
        article.categories?.includes(filters.category)
      );
    }
    
    // Apply tag filter
    if (filters.tag) {
      result = result.filter(article => 
        article.tags?.includes(filters.tag)
      );
    }
    
    // Apply author filter
    if (filters.author) {
      result = result.filter(article => 
        article.author.id === filters.author
      );
    }
    
    // Apply search term
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(article => 
        article.title.toLowerCase().includes(term) || 
        article.excerpt.toLowerCase().includes(term) ||
        article.content.toLowerCase().includes(term) ||
        article.author.name.toLowerCase().includes(term) ||
        article.tags?.some(tag => tag.toLowerCase().includes(term))
      );
    }
    
    // Apply date range filter
    if (filters.dateFrom || filters.dateTo) {
      result = result.filter(article => {
        const publishDate = new Date(article.publishedAt);
        if (filters.dateFrom && publishDate < new Date(filters.dateFrom)) return false;
        if (filters.dateTo && publishDate > new Date(filters.dateTo)) return false;
        return true;
      });
    }
    
    // Apply sorting
    switch (sortOption) {
      case 'recent':
        result.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt));
        break;
      case 'popular':
        result.sort((a, b) => b.viewCount - a.viewCount);
        break;
      case 'comments':
        result.sort((a, b) => b.commentCount - a.commentCount);
        break;
      case 'likes':
        result.sort((a, b) => b.likeCount - a.likeCount);
        break;
      default:
        // Default to recent
        result.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
        break;
    }
    
    setFilteredArticles(result);
  }, [articles, filters, sortOption]);
  
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };
  
  return (
    <div className="blog-article-listing">
      <div className="listing-header">
        <div className="result-count">
          {filteredArticles.length} {filteredArticles.length === 1 ? 'article' : 'articles'} found
        </div>
        
        <div className="listing-controls">
          <div className="sort-control">
            <label htmlFor="sort-select">Sort by:</label>
            <select 
              id="sort-select" 
              value={sortOption}
              onChange={handleSortChange}
            >
              <option value="recent">Most Recent</option>
              <option value="oldest">Oldest First</option>
              <option value="popular">Most Popular</option>
              <option value="comments">Most Comments</option>
              <option value="likes">Most Likes</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="article-grid">
        {filteredArticles.length > 0 ? (
          filteredArticles.map((article, index) => (
            <ArticleCard 
              key={article.id || index}
              article={article}
              onClick={() => onArticleSelect(article)}
            />
          ))
        ) : (
          <div className="no-articles">
            <div className="no-articles-icon">🔍</div>
            <h3>No Articles Found</h3>
            <p>Try adjusting your filters or search terms.</p>
            <button 
              className="clear-filters-button"
              onClick={() => onFilterChange({})}
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Article card component
 */
export function ArticleCard({ article, onClick }) {
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <div 
      className="article-card"
      onClick={onClick}
    >
      <div className="article-image-container">
        <img 
          src={article.coverImage || '/default-article.jpg'} 
          alt={article.title} 
          className="article-image"
        />
        
        {article.featured && (
          <div className="featured-badge">
            FEATURED
          </div>
        )}
      </div>
      
      <div className="article-info">
        <div className="article-meta">
          <div className="article-category">
            {article.category}
          </div>
          <div className="article-date">
            {formatDate(article.publishedAt)}
          </div>
        </div>
        
        <h3 className="article-title">{article.title}</h3>
        
        <div className="article-excerpt">
          {article.excerpt}
        </div>
        
        <div className="article-author">
          <img 
            src={article.author.avatar || '/default-avatar.jpg'} 
            alt={article.author.name} 
            className="author-avatar"
          />
          <span className="author-name">By {article.author.name}</span>
        </div>
        
        <div className="article-stats">
          <div className="stat-item">
            <span className="stat-icon">👁️</span>
            <span className="stat-value">{article.viewCount}</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">💬</span>
            <span className="stat-value">{article.commentCount}</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">❤️</span>
            <span className="stat-value">{article.likeCount}</span>
          </div>
        </div>
        
        {article.tags && article.tags.length > 0 && (
          <div className="article-tags">
            {article.tags.slice(0, 3).map((tag, index) => (
              <span key={index} className="tag-item">#{tag}</span>
            ))}
            {article.tags.length > 3 && (
              <span className="more-tags">+{article.tags.length - 3}</span>
            )}
          </div>
        )}
        
        <div className="read-more">
          Read More
        </div>
      </div>
    </div>
  );
}

/**
 * Article filters component
 */
export function ArticleFilters({ categories = [], tags = [], authors = [], filters = {}, onFilterChange }) {
  const [dateRange, setDateRange] = useState({
    from: filters.dateFrom || '',
    to: filters.dateTo || ''
  });
  
  const handleCategoryChange = (category) => {
    onFilterChange({
      ...filters,
      category: filters.category === category ? null : category
    });
  };
  
  const handleTagChange = (tag) => {
    onFilterChange({
      ...filters,
      tag: filters.tag === tag ? null : tag
    });
  };
  
  const handleAuthorChange = (authorId) => {
    onFilterChange({
      ...filters,
      author: filters.author === authorId ? null : authorId
    });
  };
  
  const handleDateChange = (type, value) => {
    const newDateRange = {
      ...dateRange,
      [type]: value
    };
    
    setDateRange(newDateRange);
    
    onFilterChange({
      ...filters,
      dateFrom: newDateRange.from,
      dateTo: newDateRange.to
    });
  };
  
  const clearAllFilters = () => {
    setDateRange({ from: '', to: '' });
    onFilterChange({});
  };
  
  return (
    <div className="article-filters">
      <div className="filter-section">
        <div className="filter-header">
          <h3>Categories</h3>
        </div>
        
        <div className="category-filters">
          {categories.map((category, index) => (
            <div key={index} className="category-filter-item">
              <label className="category-checkbox">
                <input 
                  type="checkbox" 
                  checked={filters.category === category.id}
                  onChange={() => handleCategoryChange(category.id)}
                />
                <span className="category-name">{category.name}</span>
                <span className="category-count">({category.count})</span>
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="filter-section">
        <div className="filter-header">
          <h3>Popular Tags</h3>
        </div>
        
        <div className="tag-filters">
          {tags.map((tag, index) => (
            <div 
              key={index} 
              className={`tag-filter-item ${filters.tag === tag.id ? 'active' : ''}`}
              onClick={() => handleTagChange(tag.id)}
            >
              <span className="tag-name">#{tag.name}</span>
              <span className="tag-count">({tag.count})</span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="filter-section">
        <div className="filter-header">
          <h3>Authors</h3>
        </div>
        
        <div className="author-filters">
          {authors.map((author, index) => (
            <div key={index} className="author-filter-item">
              <label className="author-checkbox">
                <input 
                  type="checkbox" 
                  checked={filters.author === author.id}
                  onChange={() => handleAuthorChange(author.id)}
                />
                <div className="author-info">
                  <img 
                    src={author.avatar || '/default-avatar.jpg'} 
                    alt={author.name} 
                    className="author-avatar"
                  />
                  <div className="author-details">
                    <span className="author-name">{author.name}</span>
                    <span className="author-count">({author.articleCount} articles)</span>
                  </div>
                </div>
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="filter-section">
        <div className="filter-header">
          <h3>Date Range</h3>
        </div>
        
        <div className="date-filter">
          <div className="date-inputs">
            <div className="date-input-group">
              <label htmlFor="date-from">From</label>
              <input 
                type="date" 
                id="date-from"
                value={dateRange.from}
                onChange={(e) => handleDateChange('from', e.target.value)}
              />
            </div>
            
            <div className="date-input-group">
              <label htmlFor="date-to">To</label>
              <input 
                type="date" 
                id="date-to"
                value={dateRange.to}
                onChange={(e) => handleDateChange('to', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      
      <button 
        className="clear-filters-button"
        onClick={clearAllFilters}
      >
        Clear All Filters
      </button>
    </div>
  );
}

/**
 * Article detail component
 */
export function ArticleDetail({ 
  article, 
  onLike, 
  onComment, 
  onShare,
  onFollow,
  relatedArticles = [],
  onRelatedArticleSelect,
  relatedProducts = [],
  onRelatedProductSelect,
  relatedCourses = [],
  onRelatedCourseSelect,
  currentUser = null
}) {
  const [comment, setComment] = useState('');
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [isLiked, setIsLiked] = useState(article.isLikedByCurrentUser);
  const [likeCount, setLikeCount] = useState(article.likeCount);
  const [isFollowing, setIsFollowing] = useState(article.author.isFollowedByCurrentUser);
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const handleLike = () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    setLikeCount(prevCount => newLikedState ? prevCount + 1 : prevCount - 1);
    onLike(article.id, newLikedState);
  };
  
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    
    if (!comment.trim()) return;
    
    onComment(article.id, comment);
    setComment('');
    setShowCommentForm(false);
  };
  
  const handleShare = (platform) => {
    onShare(article.id, platform);
  };
  
  const handleFollow = () => {
    const newFollowingState = !isFollowing;
    setIsFollowing(newFollowingState);
    onFollow(article.author.id, newFollowingState);
  };
  
  const toggleCommentForm = () => {
    setShowCommentForm(!showCommentForm);
  };
  
  return (
    <div className="article-detail">
      <div className="article-header">
        <div className="article-breadcrumbs">
          <a href="/blog">Blog</a>
          {article.category && (
            <>
              <span className="breadcrumb-separator">›</span>
              <a href={`/blog/category/${article.category.slug}`}>{article.category.name}</a>
            </>
          )}
          <span className="breadcrumb-separator">›</span>
          <span className="current-page">{article.title}</span>
        </div>
        
        <h1 className="article-title">{article.title}</h1>
        
        <div className="article-meta">
          <div className="article-author">
            <img 
              src={article.author.avatar || '/default-avatar.jpg'} 
              alt={article.author.name} 
              className="author-avatar"
            />
            <div className="author-info">
              <a href={`/blog/author/${article.author.id}`} className="author-name">
                {article.author.name}
              </a>
              <button 
                className={`follow-button ${isFollowing ? 'following' : ''}`}
                onClick={handleFollow}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            </div>
          </div>
          
          <div className="article-date">
            <span className="date-icon">📅</span>
            <span className="date-text">{formatDate(article.publishedAt)}</span>
          </div>
          
          <div className="article-read-time">
            <span className="time-icon">⏱️</span>
            <span className="time-text">{article.readTime} min read</span>
          </div>
        </div>
        
        {article.coverImage && (
          <div className="article-cover-image">
            <img 
              src={article.coverImage} 
              alt={article.title} 
              className="cover-image"
            />
            {article.coverImageCaption && (
              <div className="image-caption">{article.coverImageCaption}</div>
            )}
          </div>
        )}
      </div>
      
      <div className="article-content">
        <div className="article-main">
          <div className="article-body">
            {article.content.split('\n\n').map((paragraph, index) => {
              // Check if paragra<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>