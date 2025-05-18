/**
 * E-learning Components
 * Core components for e-learning functionality
 */

import React, { useState, useEffect } from 'react';
import { useDeviceInfo } from '../../lib/responsive/ResponsiveLayout';
import { ExternalLinksDisplay } from '../../components/integration/ExternalPlatformComponents';

/**
 * Course listing component
 */
export function CourseListing({ courses = [], onCourseSelect, filters = {}, onFilterChange }) {
  const [filteredCourses, setFilteredCourses] = useState(courses);
  const [sortOption, setSortOption] = useState('popular');
  const [viewMode, setViewMode] = useState('grid');
  const deviceInfo = useDeviceInfo();
  
  // Apply filters and sorting whenever courses or filters change
  useEffect(() => {
    let result = [...courses];
    
    // Apply category filter
    if (filters.category) {
      result = result.filter(course => 
        course.category === filters.category || 
        course.categories?.includes(filters.category)
      );
    }
    
    // Apply level filter
    if (filters.level) {
      result = result.filter(course => 
        course.level === filters.level
      );
    }
    
    // Apply price range filter
    if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
      result = result.filter(course => {
        const price = course.salePrice || course.price;
        if (filters.priceMin !== undefined && price < filters.priceMin) return false;
        if (filters.priceMax !== undefined && price > filters.priceMax) return false;
        return true;
      });
    }
    
    // Apply rating filter
    if (filters.ratingMin !== undefined) {
      result = result.filter(course => 
        course.rating >= filters.ratingMin
      );
    }
    
    // Apply search term
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(course => 
        course.title.toLowerCase().includes(term) || 
        course.description.toLowerCase().includes(term) ||
        course.instructor.name.toLowerCase().includes(term) ||
        course.tags?.some(tag => tag.toLowerCase().includes(term))
      );
    }
    
    // Apply sorting
    switch (sortOption) {
      case 'price-low':
        result.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
        break;
      case 'price-high':
        result.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'popular':
      default:
        result.sort((a, b) => b.enrollmentCount - a.enrollmentCount);
        break;
    }
    
    setFilteredCourses(result);
  }, [courses, filters, sortOption]);
  
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };
  
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };
  
  const handleFilterChange = (filterName, value) => {
    if (onFilterChange) {
      onFilterChange({
        ...filters,
        [filterName]: value
      });
    }
  };
  
  return (
    <div className="elearning-course-listing">
      <div className="listing-header">
        <div className="result-count">
          {filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'} found
        </div>
        
        <div className="listing-controls">
          <div className="sort-control">
            <label htmlFor="sort-select">Sort by:</label>
            <select 
              id="sort-select" 
              value={sortOption}
              onChange={handleSortChange}
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
          
          <div className="view-mode-control">
            <button 
              className={`view-mode-button ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => handleViewModeChange('grid')}
              aria-label="Grid view"
            >
              <span className="grid-icon">□□</span>
            </button>
            <button 
              className={`view-mode-button ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => handleViewModeChange('list')}
              aria-label="List view"
            >
              <span className="list-icon">≡</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className={`course-grid ${viewMode === 'list' ? 'list-view' : 'grid-view'}`}>
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course, index) => (
            <CourseCard 
              key={course.id || index}
              course={course}
              viewMode={viewMode}
              onClick={() => onCourseSelect(course)}
            />
          ))
        ) : (
          <div className="no-courses">
            <div className="no-courses-icon">🔍</div>
            <h3>No Courses Found</h3>
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
 * Course card component
 */
export function CourseCard({ course, viewMode = 'grid', onClick }) {
  const hasDiscount = course.salePrice && course.salePrice < course.price;
  const discountPercentage = hasDiscount 
    ? Math.round((1 - course.salePrice / course.price) * 100) 
    : 0;
  
  return (
    <div 
      className={`course-card ${viewMode === 'list' ? 'list-view' : 'grid-view'}`}
      onClick={onClick}
    >
      <div className="course-image-container">
        <img 
          src={course.thumbnail || '/default-course.jpg'} 
          alt={course.title} 
          className="course-image"
        />
        
        {hasDiscount && (
          <div className="discount-badge">
            {discountPercentage}% OFF
          </div>
        )}
        
        {course.isNew && (
          <div className="new-badge">
            NEW
          </div>
        )}
        
        {course.isBestseller && (
          <div className="bestseller-badge">
            BESTSELLER
          </div>
        )}
        
        {course.isFeatured && (
          <div className="featured-badge">
            FEATURED
          </div>
        )}
      </div>
      
      <div className="course-info">
        <h3 className="course-title">{course.title}</h3>
        
        <div className="course-meta">
          <div className="course-instructor">
            By {course.instructor.name}
          </div>
          
          <div className="course-level">
            <span className="level-icon">
              {course.level === 'beginner' && '🔰'}
              {course.level === 'intermediate' && '📊'}
              {course.level === 'advanced' && '🔥'}
              {course.level === 'all-levels' && '📚'}
            </span>
            <span className="level-text">
              {course.level === 'beginner' && 'Beginner'}
              {course.level === 'intermediate' && 'Intermediate'}
              {course.level === 'advanced' && 'Advanced'}
              {course.level === 'all-levels' && 'All Levels'}
            </span>
          </div>
        </div>
        
        <div className="course-rating">
          <div className="rating-stars">
            {[1, 2, 3, 4, 5].map(star => (
              <span 
                key={star} 
                className={`star ${star <= course.rating ? 'filled' : 'empty'}`}
              >
                ★
              </span>
            ))}
          </div>
          <span className="rating-value">{course.rating.toFixed(1)}</span>
          <span className="rating-count">({course.reviewCount})</span>
        </div>
        
        <div className="course-stats">
          <div className="course-duration">
            <span className="duration-icon">⏱️</span>
            <span className="duration-text">{course.duration}</span>
          </div>
          
          <div className="course-lectures">
            <span className="lectures-icon">📝</span>
            <span className="lectures-text">{course.lectureCount} lectures</span>
          </div>
          
          <div className="course-students">
            <span className="students-icon">👥</span>
            <span className="students-text">{course.enrollmentCount} students</span>
          </div>
        </div>
        
        {viewMode === 'list' && (
          <div className="course-description">
            {course.description.length > 150 
              ? `${course.description.substring(0, 150)}...` 
              : course.description}
          </div>
        )}
        
        <div className="course-price">
          {hasDiscount && (
            <span className="original-price">${course.price.toFixed(2)}</span>
          )}
          <span className="current-price">
            {(course.salePrice || course.price) === 0 
              ? 'Free' 
              : `$${(course.salePrice || course.price).toFixed(2)}`}
          </span>
        </div>
        
        <div className="course-actions">
          <button className="view-details-button">
            View Course
          </button>
          
          {viewMode === 'list' && (
            <button className="enroll-button">
              Enroll Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Course filters component
 */
export function CourseFilters({ categories = [], filters = {}, onFilterChange }) {
  const [priceRange, setPriceRange] = useState({
    min: filters.priceMin || 0,
    max: filters.priceMax || 1000
  });
  
  const [ratingFilter, setRatingFilter] = useState(filters.ratingMin || 0);
  
  const handleCategoryChange = (category) => {
    onFilterChange({
      ...filters,
      category: filters.category === category ? null : category
    });
  };
  
  const handleLevelChange = (level) => {
    onFilterChange({
      ...filters,
      level: filters.level === level ? null : level
    });
  };
  
  const handlePriceChange = (type, value) => {
    const newPriceRange = {
      ...priceRange,
      [type]: value
    };
    
    setPriceRange(newPriceRange);
  };
  
  const applyPriceFilter = () => {
    onFilterChange({
      ...filters,
      priceMin: priceRange.min,
      priceMax: priceRange.max
    });
  };
  
  const handleRatingChange = (rating) => {
    const newRating = ratingFilter === rating ? 0 : rating;
    setRatingFilter(newRating);
    
    onFilterChange({
      ...filters,
      ratingMin: newRating
    });
  };
  
  const clearAllFilters = () => {
    setPriceRange({ min: 0, max: 1000 });
    setRatingFilter(0);
    onFilterChange({});
  };
  
  return (
    <div className="course-filters">
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
          <h3>Level</h3>
        </div>
        
        <div className="level-filters">
          {['beginner', 'intermediate', 'advanced', 'all-levels'].map((level) => (
            <div key={level} className="level-filter-item">
              <label className="level-checkbox">
                <input 
                  type="checkbox" 
                  checked={filters.level === level}
                  onChange={() => handleLevelChange(level)}
                />
                <span className="level-icon">
                  {level === 'beginner' && '🔰'}
                  {level === 'intermediate' && '📊'}
                  {level === 'advanced' && '🔥'}
                  {level === 'all-levels' && '📚'}
                </span>
                <span className="level-name">
                  {level === 'beginner' && 'Beginner'}
                  {level === 'intermediate' && 'Intermediate'}
                  {level === 'advanced' && 'Advanced'}
                  {level === 'all-levels' && 'All Levels'}
                </span>
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="filter-section">
        <div className="filter-header">
          <h3>Price Range</h3>
        </div>
        
        <div className="price-filter">
          <div className="price-inputs">
            <div className="price-input-group">
              <label htmlFor="price-min">Min</label>
              <div className="price-input-wrapper">
                <span className="currency-symbol">$</span>
                <input 
                  type="number" 
                  id="price-min"
                  min="0"
                  value={priceRange.min}
                  onChange={(e) => handlePriceChange('min', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
            
            <div className="price-input-group">
              <label htmlFor="price-max">Max</label>
              <div className="price-input-wrapper">
                <span className="currency-symbol">$</span>
                <input 
                  type="number" 
                  id="price-max"
                  min="0"
                  value={priceRange.max}
                  onChange={(e) => handlePriceChange('max', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>
          
          <button 
            className="apply-price-button"
            onClick={applyPriceFilter}
          >
            Apply
          </button>
        </div>
      </div>
      
      <div className="filter-section">
        <div className="filter-header">
          <h3>Rating</h3>
        </div>
        
        <div className="rating-filter">
          {[5, 4, 3, 2, 1].map(rating => (
            <div 
              key={rating} 
              className={`rating-filter-item ${ratingFilter === rating ? 'active' : ''}`}
              onClick={() => handleRatingChange(rating)}
            >
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map(star => (
                  <span 
                    key={star} 
                    className={`star ${star <= rating ? 'filled' : 'empty'}`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="rating-label">& Up</span>
            </div>
          ))}
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
 * Course detail component
 */
export function CourseDetail({ 
  course, 
  onEnroll, 
  relatedCourses = [],
  onRelatedCourseSelect,
  relatedProducts = [],
  onRelatedProductSelect,
  currentUser = null
}) {
  const [activeTab, setActiveTab] = useState('overview'<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>