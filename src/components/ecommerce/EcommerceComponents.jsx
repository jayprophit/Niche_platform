/**
 * E-commerce Components
 * Core components for e-commerce functionality
 */

import React, { useState, useEffect } from 'react';
import { useDeviceInfo } from '../../lib/responsive/ResponsiveLayout';
import { ExternalLinksDisplay } from '../../components/integration/ExternalPlatformComponents';

/**
 * Product listing component
 */
export function ProductListing({ products = [], onProductSelect, filters = {}, onFilterChange }) {
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [sortOption, setSortOption] = useState('featured');
  const [viewMode, setViewMode] = useState('grid');
  const deviceInfo = useDeviceInfo();
  
  // Apply filters and sorting whenever products or filters change
  useEffect(() => {
    let result = [...products];
    
    // Apply category filter
    if (filters.category) {
      result = result.filter(product => 
        product.category === filters.category || 
        product.categories?.includes(filters.category)
      );
    }
    
    // Apply price range filter
    if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
      result = result.filter(product => {
        const price = product.salePrice || product.price;
        if (filters.priceMin !== undefined && price < filters.priceMin) return false;
        if (filters.priceMax !== undefined && price > filters.priceMax) return false;
        return true;
      });
    }
    
    // Apply rating filter
    if (filters.ratingMin !== undefined) {
      result = result.filter(product => 
        product.rating >= filters.ratingMin
      );
    }
    
    // Apply search term
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(term) || 
        product.description.toLowerCase().includes(term) ||
        product.tags?.some(tag => tag.toLowerCase().includes(term))
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
      case 'popularity':
        result.sort((a, b) => b.popularity - a.popularity);
        break;
      case 'featured':
      default:
        // Assume products are already sorted by featured status
        break;
    }
    
    setFilteredProducts(result);
  }, [products, filters, sortOption]);
  
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
    <div className="ecommerce-product-listing">
      <div className="listing-header">
        <div className="result-count">
          {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
        </div>
        
        <div className="listing-controls">
          <div className="sort-control">
            <label htmlFor="sort-select">Sort by:</label>
            <select 
              id="sort-select" 
              value={sortOption}
              onChange={handleSortChange}
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="newest">Newest</option>
              <option value="rating">Highest Rated</option>
              <option value="popularity">Most Popular</option>
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
      
      <div className={`product-grid ${viewMode === 'list' ? 'list-view' : 'grid-view'}`}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => (
            <ProductCard 
              key={product.id || index}
              product={product}
              viewMode={viewMode}
              onClick={() => onProductSelect(product)}
            />
          ))
        ) : (
          <div className="no-products">
            <div className="no-products-icon">🔍</div>
            <h3>No Products Found</h3>
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
 * Product card component
 */
export function ProductCard({ product, viewMode = 'grid', onClick }) {
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercentage = hasDiscount 
    ? Math.round((1 - product.salePrice / product.price) * 100) 
    : 0;
  
  return (
    <div 
      className={`product-card ${viewMode === 'list' ? 'list-view' : 'grid-view'}`}
      onClick={onClick}
    >
      <div className="product-image-container">
        <img 
          src={product.image || '/default-product.jpg'} 
          alt={product.name} 
          className="product-image"
        />
        
        {hasDiscount && (
          <div className="discount-badge">
            {discountPercentage}% OFF
          </div>
        )}
        
        {product.isNew && (
          <div className="new-badge">
            NEW
          </div>
        )}
        
        {product.isFeatured && (
          <div className="featured-badge">
            FEATURED
          </div>
        )}
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        
        <div className="product-rating">
          <div className="rating-stars">
            {[1, 2, 3, 4, 5].map(star => (
              <span 
                key={star} 
                className={`star ${star <= product.rating ? 'filled' : 'empty'}`}
              >
                ★
              </span>
            ))}
          </div>
          <span className="rating-count">({product.reviewCount})</span>
        </div>
        
        <div className="product-price">
          {hasDiscount && (
            <span className="original-price">${product.price.toFixed(2)}</span>
          )}
          <span className="current-price">
            ${(product.salePrice || product.price).toFixed(2)}
          </span>
        </div>
        
        {viewMode === 'list' && (
          <div className="product-description">
            {product.description.length > 150 
              ? `${product.description.substring(0, 150)}...` 
              : product.description}
          </div>
        )}
        
        <div className="product-actions">
          <button className="view-details-button">
            View Details
          </button>
          
          {viewMode === 'list' && (
            <button className="add-to-cart-button">
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Product filters component
 */
export function ProductFilters({ categories = [], filters = {}, onFilterChange }) {
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
    <div className="product-filters">
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
 * Product detail component with enhanced features
 */
export function ProductDetail({ 
  product, 
  onAddToCart, 
  onBuyNow,
  relatedProducts = [],
  onRelatedProductSelect
}) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  
  // Set initial variant if available
  useEffect(() => {
    if (product.variants && product.variants.length > 0) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product]);
  
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };
  
  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  
  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
  };
  
  const handleAddToCart = () => {
    onAddToCart({
      product,
      variant: selectedVariant,
      quantity
    });
  };
  
  const handleBuyNow = () => {
    onBuyNow({
      product,
      variant: selectedVariant,
      quantity
    });
  };
  
  const handleImageHover = (e) => {
    if (!isZoomed) return;
    
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - left) / width;
    const y = (e.clientY - top) / height;
    
    setZoomPosition({ x, y });
  };
  
  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };
  
  // Calculate current price based on selected variant
  const currentPrice = selectedVariant?.price || product.price;
  const currentSalePrice = selectedVariant?.salePrice || product.salePrice;
  const hasDiscount = currentSalePrice && currentSalePrice < currentPrice;
  const discountPercentage = hasDiscount 
    ? Math.round((1 - currentSalePrice / currentPrice) * 100) 
    : 0;
  
  return (
    <div className="product-detail">
      <div className="product-detail-main">
        <div className="product-images">
          <div 
            className={`main-image-container ${isZoomed ? 'zoomed' : ''}`}
            onMouseMove={handleImageHover}
            onClick={toggleZoom}
          >
            <img 
              src={product.images?.[selectedImage] || product.image || '/default-product.jpg'} 
              alt={product.name} 
              className="main-image"
              style={isZoomed ? {
                transformOrigin: `${zoomPosition.x * 100}% ${zoomPosition.y * 100}%`,
                transform: 'scale(2.5)'
              } : {}}
            />
            <div className="zoom-instruction">
              {isZoomed ? 'Click to exit zoom' : 'Click to zoom'}
            </div>
          </div>
          
          {product.images && product.images.length > 1 && (
            <div className="thumbnail-images">
              {product.images.map((image, index) => (
                <div 
                  key={index} 
                  className={`thumbnail-container ${selectedImage === index ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                 <response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>