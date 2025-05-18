/**
 * External Platform Integration Components
 * Implements functionality for linking social media and external websites
 */

import React, { useState, useEffect } from 'react';

/**
 * List of supported external platforms
 */
const SUPPORTED_PLATFORMS = [
  {
    id: 'facebook',
    name: 'Facebook',
    icon: 'facebook',
    baseUrl: 'https://facebook.com/',
    color: '#1877F2',
    urlPattern: 'https://facebook.com/{username}'
  },
  {
    id: 'twitter',
    name: 'X (Twitter)',
    icon: 'twitter',
    baseUrl: 'https://twitter.com/',
    color: '#000000',
    urlPattern: 'https://twitter.com/{username}'
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: 'instagram',
    baseUrl: 'https://instagram.com/',
    color: '#E1306C',
    urlPattern: 'https://instagram.com/{username}'
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: 'linkedin',
    baseUrl: 'https://linkedin.com/in/',
    color: '#0A66C2',
    urlPattern: 'https://linkedin.com/in/{username}'
  },
  {
    id: 'youtube',
    name: 'YouTube',
    icon: 'youtube',
    baseUrl: 'https://youtube.com/',
    color: '#FF0000',
    urlPattern: 'https://youtube.com/c/{username}'
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    icon: 'pinterest',
    baseUrl: 'https://pinterest.com/',
    color: '#E60023',
    urlPattern: 'https://pinterest.com/{username}'
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: 'tiktok',
    baseUrl: 'https://tiktok.com/@',
    color: '#000000',
    urlPattern: 'https://tiktok.com/@{username}'
  },
  {
    id: 'snapchat',
    name: 'Snapchat',
    icon: 'snapchat',
    baseUrl: 'https://snapchat.com/add/',
    color: '#FFFC00',
    urlPattern: 'https://snapchat.com/add/{username}'
  },
  {
    id: 'github',
    name: 'GitHub',
    icon: 'github',
    baseUrl: 'https://github.com/',
    color: '#181717',
    urlPattern: 'https://github.com/{username}'
  },
  {
    id: 'dribbble',
    name: 'Dribbble',
    icon: 'dribbble',
    baseUrl: 'https://dribbble.com/',
    color: '#EA4C89',
    urlPattern: 'https://dribbble.com/{username}'
  },
  {
    id: 'behance',
    name: 'Behance',
    icon: 'behance',
    baseUrl: 'https://behance.net/',
    color: '#1769FF',
    urlPattern: 'https://behance.net/{username}'
  },
  {
    id: 'medium',
    name: 'Medium',
    icon: 'medium',
    baseUrl: 'https://medium.com/@',
    color: '#000000',
    urlPattern: 'https://medium.com/@{username}'
  },
  {
    id: 'website',
    name: 'Website',
    icon: 'globe',
    baseUrl: '',
    color: '#4A5568',
    urlPattern: '{url}'
  }
];

/**
 * External links manager component
 */
export function ExternalLinksManager({ 
  userLinks = [], 
  onAdd, 
  onUpdate, 
  onRemove, 
  entityType = 'user' 
}) {
  const [newLink, setNewLink] = useState({
    platform: '',
    username: '',
    url: '',
    displayName: '',
    isPublic: true
  });
  
  const [editingLink, setEditingLink] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const handleInputChange = (e, linkState, setLinkState) => {
    const { name, value, type, checked } = e.target;
    setLinkState({
      ...linkState,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handlePlatformChange = (e, linkState, setLinkState) => {
    const platformId = e.target.value;
    const platform = SUPPORTED_PLATFORMS.find(p => p.id === platformId);
    
    setLinkState({
      ...linkState,
      platform: platformId,
      url: platform?.id === 'website' ? '' : platform?.baseUrl || ''
    });
  };
  
  const handleUsernameChange = (e, linkState, setLinkState) => {
    const username = e.target.value;
    const platform = SUPPORTED_PLATFORMS.find(p => p.id === linkState.platform);
    
    if (platform && platform.id !== 'website') {
      const url = platform.urlPattern.replace('{username}', username);
      setLinkState({
        ...linkState,
        username,
        url
      });
    } else {
      setLinkState({
        ...linkState,
        username
      });
    }
  };
  
  const handleAddSubmit = (e) => {
    e.preventDefault();
    onAdd(newLink);
    setNewLink({
      platform: '',
      username: '',
      url: '',
      displayName: '',
      isPublic: true
    });
    setShowAddForm(false);
  };
  
  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    onUpdate(editingLink);
    setEditingLink(null);
  };
  
  const startEditing = (link) => {
    setEditingLink({ ...link });
  };
  
  const cancelEditing = () => {
    setEditingLink(null);
  };
  
  return (
    <div className="bb-external-links-manager">
      <div className="bb-external-links-header">
        <h3>External Platforms</h3>
        <p>Connect your {entityType === 'user' ? 'profile' : 'business'} with external social media and websites.</p>
      </div>
      
      <div className="bb-external-links-list">
        {userLinks.length > 0 ? (
          userLinks.map((link, index) => {
            const platform = SUPPORTED_PLATFORMS.find(p => p.id === link.platform) || {
              name: link.platform,
              icon: 'link',
              color: '#718096'
            };
            
            return editingLink && editingLink.id === link.id ? (
              <form key={index} className="bb-external-link-edit-form" onSubmit={handleUpdateSubmit}>
                <div className="bb-form-row">
                  <div className="bb-form-group">
                    <label htmlFor={`platform-edit-${index}`}>Platform</label>
                    <select
                      id={`platform-edit-${index}`}
                      name="platform"
                      value={editingLink.platform}
                      onChange={(e) => handlePlatformChange(e, editingLink, setEditingLink)}
                      required
                    >
                      <option value="">Select Platform</option>
                      {SUPPORTED_PLATFORMS.map(platform => (
                        <option key={platform.id} value={platform.id}>
                          {platform.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {editingLink.platform === 'website' ? (
                    <div className="bb-form-group">
                      <label htmlFor={`url-edit-${index}`}>Website URL</label>
                      <input
                        type="url"
                        id={`url-edit-${index}`}
                        name="url"
                        value={editingLink.url}
                        onChange={(e) => handleInputChange(e, editingLink, setEditingLink)}
                        placeholder="https://example.com"
                        required
                      />
                    </div>
                  ) : (
                    <div className="bb-form-group">
                      <label htmlFor={`username-edit-${index}`}>Username</label>
                      <input
                        type="text"
                        id={`username-edit-${index}`}
                        name="username"
                        value={editingLink.username}
                        onChange={(e) => handleUsernameChange(e, editingLink, setEditingLink)}
                        placeholder="yourusername"
                        required
                      />
                    </div>
                  )}
                </div>
                
                <div className="bb-form-row">
                  <div className="bb-form-group">
                    <label htmlFor={`displayName-edit-${index}`}>Display Name (Optional)</label>
                    <input
                      type="text"
                      id={`displayName-edit-${index}`}
                      name="displayName"
                      value={editingLink.displayName}
                      onChange={(e) => handleInputChange(e, editingLink, setEditingLink)}
                      placeholder="How to display this link"
                    />
                  </div>
                  
                  <div className="bb-form-group bb-checkbox-group">
                    <label className="bb-checkbox-label">
                      <input
                        type="checkbox"
                        name="isPublic"
                        checked={editingLink.isPublic}
                        onChange={(e) => handleInputChange(e, editingLink, setEditingLink)}
                      />
                      Make this link public
                    </label>
                  </div>
                </div>
                
                <div className="bb-form-actions">
                  <button type="submit" className="bb-button bb-button-primary">
                    Save Changes
                  </button>
                  <button 
                    type="button" 
                    className="bb-button"
                    onClick={cancelEditing}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div key={index} className="bb-external-link-item">
                <div className="bb-external-link-platform" style={{ backgroundColor: platform.color }}>
                  <span className={`bb-icon-${platform.icon}`}></span>
                </div>
                
                <div className="bb-external-link-info">
                  <div className="bb-external-link-name">
                    {platform.name}
                    {!link.isPublic && <span className="bb-external-link-private">Private</span>}
                  </div>
                  <div className="bb-external-link-username">
                    {link.displayName || link.username || new URL(link.url).hostname}
                  </div>
                  <a 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bb-external-link-url"
                  >
                    {link.url}
                  </a>
                </div>
                
                <div className="bb-external-link-actions">
                  <button 
                    className="bb-button bb-button-icon"
                    onClick={() => startEditing(link)}
                  >
                    <span className="bb-icon-edit"></span>
                  </button>
                  <button 
                    className="bb-button bb-button-icon bb-button-danger"
                    onClick={() => onRemove(link.id)}
                  >
                    <span className="bb-icon-trash"></span>
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="bb-external-links-empty">
            <p>No external platforms connected yet.</p>
          </div>
        )}
      </div>
      
      {showAddForm ? (
        <form className="bb-external-link-add-form" onSubmit={handleAddSubmit}>
          <h4>Add New Platform</h4>
          
          <div className="bb-form-row">
            <div className="bb-form-group">
              <label htmlFor="platform-add">Platform</label>
              <select
                id="platform-add"
                name="platform"
                value={newLink.platform}
                onChange={(e) => handlePlatformChange(e, newLink, setNewLink)}
                required
              >
                <option value="">Select Platform</option>
                {SUPPORTED_PLATFORMS.map(platform => (
                  <option key={platform.id} value={platform.id}>
                    {platform.name}
                  </option>
                ))}
              </select>
            </div>
            
            {newLink.platform === 'website' ? (
              <div className="bb-form-group">
                <label htmlFor="url-add">Website URL</label>
                <input
                  type="url"
                  id="url-add"
                  name="url"
                  value={newLink.url}
                  onChange={(e) => handleInputChange(e, newLink, setNewLink)}
                  placeholder="https://example.com"
                  required
                />
              </div>
            ) : (
              <div className="bb-form-group">
                <label htmlFor="username-add">Username</label>
                <input
                  type="text"
                  id="username-add"
                  name="username"
                  value={newLink.username}
                  onChange={(e) => handleUsernameChange(e, newLink, setNewLink)}
                  placeholder="yourusername"
                  disabled={!newLink.platform}
                  required
                />
              </div>
            )}
          </div>
          
          <div className="bb-form-row">
            <div className="bb-form-group">
              <label htmlFor="displayName-add">Display Name (Optional)</label>
              <input
                type="text"
                id="displayName-add"
                name="displayName"
                value={newLink.displayName}
                onChange={(e) => handleInputChange(e, newLink, setNewLink)}
                placeholder="How to display this link"
              />
            </div>
            
            <div className="bb-form-group bb-checkbox-group">
              <label className="bb-checkbox-label">
                <input
                  type="checkbox"
                  name="isPublic"
                  checked={newLink.isPublic}
                  onChange={(e) => handleInputChange(e, newLink, setNewLink)}
                />
                Make this link public
              </label>
            </div>
          </div>
          
          <div className="bb-form-actions">
            <button type="submit" className="bb-button bb-button-primary">
              Add Platform
            </button>
            <button 
              type="button" 
              className="bb-button"
              onClick={() => setShowAddForm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="bb-external-links-add">
          <button 
            className="bb-button bb-button-primary"
            onClick={() => setShowAddForm(true)}
          >
            <span className="bb-icon-plus"></span> Add Platform
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * External links display component for profiles
 */
export function ExternalLinksDisplay({ links = [], displayStyle = 'list' }) {
  if (!links || links.length === 0) {
    return null;
  }
  
  // Filter out private links
  const publicLinks = links.filter(link => link.isPublic);
  
  if (publicLinks.length === 0) {
    return null;
  }
  
  return (
    <div className={`bb-external-links-display bb-display-${displayStyle}`}>
      {displayStyle === 'list' && <h4>Connect With Me</h4>}
      
      <div className="bb-external-links">
        {publicLinks.map((link, index) => {
          const platform = SUPPORTED_PLATFORMS.find(p => p.id === link.platform) || {
            name: link.platform,
            icon: 'link',
            color: '#718096'
          };
          
          return (
            <a 
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bb-external-link"
              title={platform.name}
              style={displayStyle === 'icons' ? { backgroundColor: platform.color } : {}}
            >
              <span className={`bb-icon-${platform.icon}`}></span>
              {displayStyle === 'list' && (
                <span className="bb-external-link-label">
                  {link.displayName || platform.name}
                </span>
              )}
            </a>
     <response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>