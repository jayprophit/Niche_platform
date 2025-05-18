/**
 * Business and Organization Account Components
 * Implements functionality for business profiles, B2B interactions, and tiered plans
 */

import React, { useState } from 'react';
import { useDeviceInfo } from '../../lib/responsive/ResponsiveLayout';

/**
 * Business profile header component
 */
export function BusinessProfileHeader({ business, isAdmin = false }) {
  return (
    <div className="bb-business-profile-header">
      <div className="bb-business-cover">
        <img src={business.bannerUrl || '/default-business-cover.jpg'} alt={business.name} />
      </div>
      <div className="bb-business-content">
        <div className="bb-business-logo">
          <img src={business.logoUrl || '/default-business-logo.jpg'} alt={business.name} />
          {isAdmin && (
            <button className="bb-logo-change">
              <span className="bb-icon-camera"></span>
            </button>
          )}
        </div>
        <div className="bb-business-details">
          <div className="bb-business-badges">
            {business.verified && (
              <span className="bb-badge bb-badge-verified">
                <span className="bb-icon-check-circle"></span> Verified
              </span>
            )}
            <span className="bb-badge bb-badge-tier">
              {business.subscriptionTier} Plan
            </span>
          </div>
          <h1>{business.name}</h1>
          <p className="bb-business-tagline">{business.tagline}</p>
          <div className="bb-business-meta">
            <span className="bb-business-industry">
              <span className="bb-icon-briefcase"></span> {business.industry}
            </span>
            <span className="bb-business-location">
              <span className="bb-icon-location"></span> {business.location}
            </span>
            <span className="bb-business-size">
              <span className="bb-icon-users"></span> {business.size} employees
            </span>
            <span className="bb-business-founded">
              <span className="bb-icon-calendar"></span> Founded {business.foundingDate}
            </span>
          </div>
        </div>
        <div className="bb-business-actions">
          {!isAdmin ? (
            <>
              <button className="bb-button bb-button-primary">
                <span className="bb-icon-user-plus"></span> Follow
              </button>
              <button className="bb-button">
                <span className="bb-icon-message"></span> Contact
              </button>
            </>
          ) : (
            <button className="bb-button">
              <span className="bb-icon-edit"></span> Edit Profile
            </button>
          )}
        </div>
      </div>
      <nav className="bb-business-navigation">
        <ul>
          <li className="active"><a href="#overview">Overview</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#products">Products</a></li>
          <li><a href="#courses">Courses</a></li>
          <li><a href="#jobs">Jobs</a></li>
          <li><a href="#reviews">Reviews</a></li>
          <li><a href="#team">Team</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>
    </div>
  );
}

/**
 * Business registration form component
 */
export function BusinessRegistrationForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    businessType: 'company',
    industry: '',
    size: 'small',
    description: '',
    website: '',
    email: '',
    phone: '',
    address: '',
    taxId: '',
    registrationNumber: '',
    foundingDate: '',
    subscriptionTier: 'basic'
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <div className="bb-business-registration">
      <div className="bb-business-registration-header">
        <h2>Register Your Business</h2>
        <p>Create a business profile to access enhanced features, job marketplace, and B2B networking.</p>
      </div>
      
      <form className="bb-business-form" onSubmit={handleSubmit}>
        <div className="bb-form-section">
          <h3>Basic Information</h3>
          
          <div className="bb-form-group">
            <label htmlFor="name">Business Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="bb-form-row">
            <div className="bb-form-group">
              <label htmlFor="businessType">Business Type *</label>
              <select
                id="businessType"
                name="businessType"
                value={formData.businessType}
                onChange={handleChange}
                required
              >
                <option value="company">Company</option>
                <option value="agency">Agency</option>
                <option value="educational">Educational Institution</option>
                <option value="government">Government Organization</option>
                <option value="nonprofit">Non-profit</option>
              </select>
            </div>
            
            <div className="bb-form-group">
              <label htmlFor="industry">Industry *</label>
              <input
                type="text"
                id="industry"
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="bb-form-row">
            <div className="bb-form-group">
              <label htmlFor="size">Company Size *</label>
              <select
                id="size"
                name="size"
                value={formData.size}
                onChange={handleChange}
                required
              >
                <option value="small">Small (1-50 employees)</option>
                <option value="medium">Medium (51-200 employees)</option>
                <option value="large">Large (201-1000 employees)</option>
                <option value="enterprise">Enterprise (1000+ employees)</option>
              </select>
            </div>
            
            <div className="bb-form-group">
              <label htmlFor="foundingDate">Founding Date</label>
              <input
                type="date"
                id="foundingDate"
                name="foundingDate"
                value={formData.foundingDate}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="bb-form-group">
            <label htmlFor="description">Business Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              required
            ></textarea>
          </div>
        </div>
        
        <div className="bb-form-section">
          <h3>Contact Information</h3>
          
          <div className="bb-form-group">
            <label htmlFor="website">Website</label>
            <input
              type="url"
              id="website"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://example.com"
            />
          </div>
          
          <div className="bb-form-row">
            <div className="bb-form-group">
              <label htmlFor="email">Business Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="bb-form-group">
              <label htmlFor="phone">Business Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="bb-form-group">
            <label htmlFor="address">Business Address</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
            ></textarea>
          </div>
        </div>
        
        <div className="bb-form-section">
          <h3>Legal Information</h3>
          
          <div className="bb-form-row">
            <div className="bb-form-group">
              <label htmlFor="taxId">Tax ID / VAT Number</label>
              <input
                type="text"
                id="taxId"
                name="taxId"
                value={formData.taxId}
                onChange={handleChange}
              />
            </div>
            
            <div className="bb-form-group">
              <label htmlFor="registrationNumber">Registration Number</label>
              <input
                type="text"
                id="registrationNumber"
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        
        <div className="bb-form-section">
          <h3>Subscription Plan</h3>
          
          <div className="bb-plan-options">
            <div className={`bb-plan-card ${formData.subscriptionTier === 'basic' ? 'selected' : ''}`}>
              <div className="bb-plan-header">
                <h4>Basic</h4>
                <div className="bb-plan-price">$49<span>/month</span></div>
              </div>
              <ul className="bb-plan-features">
                <li>Business profile</li>
                <li>5 job postings</li>
                <li>Basic analytics</li>
                <li>Standard support</li>
              </ul>
              <div className="bb-plan-action">
                <button 
                  type="button" 
                  className={`bb-button ${formData.subscriptionTier === 'basic' ? 'bb-button-primary' : ''}`}
                  onClick={() => setFormData({...formData, subscriptionTier: 'basic'})}
                >
                  {formData.subscriptionTier === 'basic' ? 'Selected' : 'Select Plan'}
                </button>
              </div>
            </div>
            
            <div className={`bb-plan-card ${formData.subscriptionTier === 'professional' ? 'selected' : ''}`}>
              <div className="bb-plan-header">
                <h4>Professional</h4>
                <div className="bb-plan-price">$99<span>/month</span></div>
              </div>
              <ul className="bb-plan-features">
                <li>Enhanced business profile</li>
                <li>20 job postings</li>
                <li>Advanced analytics</li>
                <li>Priority support</li>
                <li>E-commerce integration</li>
              </ul>
              <div className="bb-plan-action">
                <button 
                  type="button" 
                  className={`bb-button ${formData.subscriptionTier === 'professional' ? 'bb-button-primary' : ''}`}
                  onClick={() => setFormData({...formData, subscriptionTier: 'professional'})}
                >
                  {formData.subscriptionTier === 'professional' ? 'Selected' : 'Select Plan'}
                </button>
              </div>
            </div>
            
            <div className={`bb-plan-card ${formData.subscriptionTier === 'enterprise' ? 'selected' : ''}`}>
              <div className="bb-plan-header">
                <h4>Enterprise</h4>
                <div className="bb-plan-price">$249<span>/month</span></div>
              </div>
              <ul className="bb-plan-features">
                <li>Premium business profile</li>
                <li>Unlimited job postings</li>
                <li>Comprehensive analytics</li>
                <li>Dedicated support</li>
                <li>E-commerce & E-learning integration</li>
                <li>API access</li>
                <li>Custom branding</li>
              </ul>
              <div className="bb-plan-action">
                <button 
                  type="button" 
                  className={`bb-button ${formData.subscriptionTier === 'enterprise' ? 'bb-button-primary' : ''}`}
                  onClick={() => setFormData({...formData, subscriptionTier: 'enterprise'})}
                >
                  {formData.subscriptionTier === 'enterprise' ? 'Selected' : 'Select Plan'}
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bb-form-actions">
          <button type="submit" className="bb-button bb-button-primary">
            Register Business
          </button>
        </div>
      </form>
    </div>
  );
}

/**
 * Business directory component
 */
export function BusinessDirectory({ businesses = [] }) {
  const [filters, setFilters] = useState({
    industry: '',
    type: '',
    size: ''
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Apply filters and search
  const filteredBusinesses = businesses.filter(business => {
    let matches = true;
    
    if (filters.industry && business.industry !== filters.industry) {
      matches = false;
    }
    
    if (filters.type && business.businessType !== filters.type) {
      matches = false;
    }
    
    if (filters.size && business.size !== filters.size) {
      matches = false;
    }
    
    if (searchTerm && !business.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      matches = false;
    }
    
    return matches;
  });
  
  return (
    <div className="bb-business-directory">
      <div className="bb-business-directory-header">
        <h2>Business Directory</h2>
        <p>Connect with businesses, organizations, and institutions on our platform.</p>
      </div>
      
      <div className="bb-business-filters">
        <div className="bb-business-search">
          <input 
            type="text" 
            placeholder="Search businesses..." 
            value={searchTerm}
            onChange={handleSearch}
          />
          <button className="bb-search-button">
            <span className="bb-icon-search"></span>
          </button>
        </div>
        
        <div className="bb-filter-controls">
          <div className="bb-filter-group">
            <label htmlFor="industry">Industry</label>
            <select 
              id="industry" 
              name="industry" 
              value={filters.industry}
              onChange={handleFilterChange}
            >
              <option value="">All Industries</option>
              <option value="technology">Technology</option>
              <option value="education">Education</option>
              <option value="healthcare">Healthcare</option>
              <option value="finance">Finance</option>
              <option value="retail">Retail</option>
              <option value="manufacturing">Manufacturing</option>
            </select>
          </div>
          
          <div className="bb-filter-group">
            <label htmlFor="type">Type</label>
      <response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>