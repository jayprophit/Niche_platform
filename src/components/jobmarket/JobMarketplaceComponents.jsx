/**
 * Job Marketplace Components
 * Implements functionality for job listings, applications, and business tiers
 */

import React, { useState } from 'react';

/**
 * Job listing creation form component
 */
export function JobListingForm({ onSubmit, business }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    jobType: 'full_time',
    location: '',
    isRemote: false,
    salaryMin: '',
    salaryMax: '',
    salaryCurrency: 'USD',
    salaryPeriod: 'yearly',
    requiredSkills: [],
    requiredExperience: '',
    requiredEducation: '',
    requiredCertificates: [],
    applicationUrl: '',
    contactEmail: business?.email || '',
    expiresAt: ''
  });
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSkillsChange = (e) => {
    const skills = e.target.value.split(',').map(skill => skill.trim()).filter(Boolean);
    setFormData(prevData => ({
      ...prevData,
      requiredSkills: skills
    }));
  };
  
  const handleCertificatesChange = (e) => {
    const certificates = e.target.value.split(',').map(cert => cert.trim()).filter(Boolean);
    setFormData(prevData => ({
      ...prevData,
      requiredCertificates: certificates
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <div className="bb-job-listing-form">
      <div className="bb-job-form-header">
        <h2>Create Job Listing</h2>
        <p>Post a new job opportunity for your business.</p>
      </div>
      
      <form className="bb-job-form" onSubmit={handleSubmit}>
        <div className="bb-form-section">
          <h3>Job Details</h3>
          
          <div className="bb-form-group">
            <label htmlFor="title">Job Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="bb-form-group">
            <label htmlFor="description">Job Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="6"
              required
            ></textarea>
          </div>
          
          <div className="bb-form-row">
            <div className="bb-form-group">
              <label htmlFor="jobType">Job Type *</label>
              <select
                id="jobType"
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                required
              >
                <option value="full_time">Full Time</option>
                <option value="part_time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="freelance">Freelance</option>
                <option value="internship">Internship</option>
              </select>
            </div>
            
            <div className="bb-form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="City, Country"
              />
            </div>
          </div>
          
          <div className="bb-form-group bb-checkbox-group">
            <label className="bb-checkbox-label">
              <input
                type="checkbox"
                name="isRemote"
                checked={formData.isRemote}
                onChange={handleChange}
              />
              Remote position
            </label>
          </div>
        </div>
        
        <div className="bb-form-section">
          <h3>Compensation</h3>
          
          <div className="bb-form-row">
            <div className="bb-form-group">
              <label htmlFor="salaryMin">Minimum Salary</label>
              <input
                type="number"
                id="salaryMin"
                name="salaryMin"
                value={formData.salaryMin}
                onChange={handleChange}
                min="0"
              />
            </div>
            
            <div className="bb-form-group">
              <label htmlFor="salaryMax">Maximum Salary</label>
              <input
                type="number"
                id="salaryMax"
                name="salaryMax"
                value={formData.salaryMax}
                onChange={handleChange}
                min="0"
              />
            </div>
          </div>
          
          <div className="bb-form-row">
            <div className="bb-form-group">
              <label htmlFor="salaryCurrency">Currency</label>
              <select
                id="salaryCurrency"
                name="salaryCurrency"
                value={formData.salaryCurrency}
                onChange={handleChange}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="CAD">CAD</option>
                <option value="AUD">AUD</option>
                <option value="JPY">JPY</option>
              </select>
            </div>
            
            <div className="bb-form-group">
              <label htmlFor="salaryPeriod">Period</label>
              <select
                id="salaryPeriod"
                name="salaryPeriod"
                value={formData.salaryPeriod}
                onChange={handleChange}
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="bb-form-section">
          <h3>Requirements</h3>
          
          <div className="bb-form-group">
            <label htmlFor="requiredSkills">Required Skills (comma separated)</label>
            <input
              type="text"
              id="requiredSkills"
              name="requiredSkills"
              value={formData.requiredSkills.join(', ')}
              onChange={handleSkillsChange}
              placeholder="JavaScript, React, Node.js"
            />
          </div>
          
          <div className="bb-form-group">
            <label htmlFor="requiredExperience">Required Experience</label>
            <input
              type="text"
              id="requiredExperience"
              name="requiredExperience"
              value={formData.requiredExperience}
              onChange={handleChange}
              placeholder="3+ years of experience"
            />
          </div>
          
          <div className="bb-form-group">
            <label htmlFor="requiredEducation">Required Education</label>
            <input
              type="text"
              id="requiredEducation"
              name="requiredEducation"
              value={formData.requiredEducation}
              onChange={handleChange}
              placeholder="Bachelor's degree in Computer Science or related field"
            />
          </div>
          
          <div className="bb-form-group">
            <label htmlFor="requiredCertificates">Required Certificates (comma separated)</label>
            <input
              type="text"
              id="requiredCertificates"
              name="requiredCertificates"
              value={formData.requiredCertificates.join(', ')}
              onChange={handleCertificatesChange}
              placeholder="AWS Certified Developer, Google Cloud Professional"
            />
          </div>
        </div>
        
        <div className="bb-form-section">
          <h3>Application Details</h3>
          
          <div className="bb-form-group">
            <label htmlFor="applicationUrl">Application URL (optional)</label>
            <input
              type="url"
              id="applicationUrl"
              name="applicationUrl"
              value={formData.applicationUrl}
              onChange={handleChange}
              placeholder="https://example.com/apply"
            />
          </div>
          
          <div className="bb-form-group">
            <label htmlFor="contactEmail">Contact Email *</label>
            <input
              type="email"
              id="contactEmail"
              name="contactEmail"
              value={formData.contactEmail}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="bb-form-group">
            <label htmlFor="expiresAt">Listing Expires On</label>
            <input
              type="date"
              id="expiresAt"
              name="expiresAt"
              value={formData.expiresAt}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="bb-form-actions">
          <button type="submit" className="bb-button bb-button-primary">
            Post Job
          </button>
        </div>
      </form>
    </div>
  );
}

/**
 * Job listing component
 */
export function JobListing({ job, onApply, isLoggedIn }) {
  const [showDetails, setShowDetails] = useState(false);
  
  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };
  
  const formatSalary = () => {
    if (!job.salaryMin && !job.salaryMax) return 'Not specified';
    
    let salary = '';
    if (job.salaryMin && job.salaryMax) {
      salary = `${job.salaryMin.toLocaleString()} - ${job.salaryMax.toLocaleString()}`;
    } else if (job.salaryMin) {
      salary = `${job.salaryMin.toLocaleString()}+`;
    } else if (job.salaryMax) {
      salary = `Up to ${job.salaryMax.toLocaleString()}`;
    }
    
    return `${job.salaryCurrency} ${salary} ${job.salaryPeriod}`;
  };
  
  const formatJobType = (type) => {
    switch (type) {
      case 'full_time': return 'Full Time';
      case 'part_time': return 'Part Time';
      case 'contract': return 'Contract';
      case 'freelance': return 'Freelance';
      case 'internship': return 'Internship';
      default: return type;
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  return (
    <div className="bb-job-listing">
      <div className="bb-job-header" onClick={toggleDetails}>
        <div className="bb-job-company">
          <img 
            src={job.company.logoUrl || '/default-business-logo.jpg'} 
            alt={job.company.name} 
            className="bb-job-company-logo"
          />
        </div>
        
        <div className="bb-job-info">
          <h3 className="bb-job-title">{job.title}</h3>
          <div className="bb-job-meta">
            <span className="bb-job-company-name">{job.company.name}</span>
            <span className="bb-job-location">
              {job.location}
              {job.isRemote && ' (Remote)'}
            </span>
            <span className="bb-job-type">{formatJobType(job.jobType)}</span>
            <span className="bb-job-salary">{formatSalary()}</span>
          </div>
        </div>
        
        <div className="bb-job-posted">
          <span className="bb-job-date">Posted {formatDate(job.postedAt)}</span>
          <span className={`bb-job-status bb-status-${job.status}`}>{job.status}</span>
        </div>
      </div>
      
      {showDetails && (
        <div className="bb-job-details">
          <div className="bb-job-description">
            <h4>Job Description</h4>
            <div dangerouslySetInnerHTML={{ __html: job.description }}></div>
          </div>
          
          <div className="bb-job-requirements">
            <h4>Requirements</h4>
            
            {job.requiredSkills && job.requiredSkills.length > 0 && (
              <div className="bb-job-skills">
                <h5>Skills</h5>
                <div className="bb-skills-list">
                  {job.requiredSkills.map((skill, index) => (
                    <span key={index} className="bb-skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
            )}
            
            {job.requiredExperience && (
              <div className="bb-job-experience">
                <h5>Experience</h5>
                <p>{job.requiredExperience}</p>
              </div>
            )}
            
            {job.requiredEducation && (
              <div className="bb-job-education">
                <h5>Education</h5>
                <p>{job.requiredEducation}</p>
              </div>
            )}
            
            {job.requiredCertificates && job.requiredCertificates.length > 0 && (
              <div className="bb-job-certificates">
                <h5>Certificates</h5>
                <ul>
                  {job.requiredCertificates.map((cert, index) => (
                    <li key={index}>{cert}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div className="bb-job-actions">
            {isLoggedIn ? (
              <button 
                className="bb-button bb-button-primary"
                onClick={() => onApply(job.id)}
              >
                Apply Now
              </button>
            ) : (
              <div className="bb-job-login-required">
                <p>Please <a href="/login">log in</a> to apply for this job.</p>
              </div>
            )}
            
            {job.applicationUrl && (
              <a 
                href={job.applicationUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bb-button"
              >
                Apply on Company Website
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Job marketplace component
 */
export function JobMarketplace({ jobs = [], onApply, isLoggedIn }) {
  const [filters, setFilters] = useState({
    jobType: '',
    location: '',
    isRemote: false,
    salary: '',
    company: '',
    skills: []
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSkillsChange = (e) => {
    const skills = e.target.value.split(',').map(skill => skill.trim()).filter(Boolean);
    setFilters(prevFilters => ({
      ...prevFilters,
      skills
    }));
  };
  
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Apply filters and search
  const filteredJobs = jobs.filter(job => {
    let matches = true;
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const titleMatch = job.title.toLowerCase().includes(searchLower);
      const companyMatch = job.company.name.toLowerCase().includes(searchLower);
      const descriptionMatch = job.description.toLowerCase().includes(searchLower);
      
      if (!(titleMatch || companyMatch || descriptionMatch)) {
        matches = false;
      }
    }
    
    if (filters.jobType && job.jobType !== filters.jobType) {
      matches = false;
    }
    
    if (filters.location && !job.location.toLowerCase().includes(filters.location.toLowerCase())) {
      matches = false;
    }
    
    if (filter<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>