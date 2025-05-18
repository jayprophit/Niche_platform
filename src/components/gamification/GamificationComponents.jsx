/**
 * Gamification Components
 * Core components for gamification functionality across the platform
 */

import React, { useState, useEffect } from 'react';
import { useDeviceInfo } from '../../lib/responsive/ResponsiveLayout';

/**
 * Achievement badge component
 */
export function AchievementBadge({ badge, size = 'medium', showTooltip = true, onClick }) {
  const [showDetails, setShowDetails] = useState(false);
  
  const handleBadgeClick = () => {
    if (onClick) {
      onClick(badge);
    } else if (showTooltip) {
      setShowDetails(!showDetails);
    }
  };
  
  const handleMouseEnter = () => {
    if (showTooltip) {
      setShowDetails(true);
    }
  };
  
  const handleMouseLeave = () => {
    if (showTooltip) {
      setShowDetails(false);
    }
  };
  
  return (
    <div 
      className={`achievement-badge ${size} ${badge.unlocked ? 'unlocked' : 'locked'}`}
      onClick={handleBadgeClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="badge-icon">
        {badge.unlocked ? (
          <img 
            src={badge.icon || '/default-badge.png'} 
            alt={badge.name} 
            className="badge-image"
          />
        ) : (
          <div className="locked-badge">
            <span className="lock-icon">🔒</span>
          </div>
        )}
      </div>
      
      {showDetails && (
        <div className="badge-tooltip">
          <div className="badge-name">{badge.name}</div>
          <div className="badge-description">{badge.description}</div>
          
          {!badge.unlocked && badge.progress && (
            <div className="badge-progress">
              <div className="progress-text">
                {badge.progress.current} / {badge.progress.required}
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${(badge.progress.current / badge.progress.required) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
          
          {badge.unlocked && badge.unlockedDate && (
            <div className="badge-unlocked-date">
              Unlocked on {new Date(badge.unlockedDate).toLocaleDateString()}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Achievement collection component
 */
export function AchievementCollection({ 
  badges = [], 
  title = 'Achievements', 
  onBadgeClick,
  showProgress = true,
  currentUser = null
}) {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter badges based on current filter and search term
  const filteredBadges = badges.filter(badge => {
    // Apply filter
    if (filter === 'unlocked' && !badge.unlocked) return false;
    if (filter === 'locked' && badge.unlocked) return false;
    
    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return badge.name.toLowerCase().includes(term) || 
             badge.description.toLowerCase().includes(term) ||
             badge.category.toLowerCase().includes(term);
    }
    
    return true;
  });
  
  // Group badges by category
  const groupedBadges = filteredBadges.reduce((groups, badge) => {
    const category = badge.category || 'Uncategorized';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(badge);
    return groups;
  }, {});
  
  // Calculate overall progress
  const totalBadges = badges.length;
  const unlockedBadges = badges.filter(badge => badge.unlocked).length;
  const progressPercentage = totalBadges > 0 ? (unlockedBadges / totalBadges) * 100 : 0;
  
  return (
    <div className="achievement-collection">
      <div className="collection-header">
        <h2>{title}</h2>
        
        {showProgress && (
          <div className="overall-progress">
            <div className="progress-text">
              {unlockedBadges} of {totalBadges} achievements unlocked ({Math.round(progressPercentage)}%)
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
      
      <div className="collection-filters">
        <div className="filter-buttons">
          <button 
            className={`filter-button ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button 
            className={`filter-button ${filter === 'unlocked' ? 'active' : ''}`}
            onClick={() => setFilter('unlocked')}
          >
            Unlocked
          </button>
          <button 
            className={`filter-button ${filter === 'locked' ? 'active' : ''}`}
            onClick={() => setFilter('locked')}
          >
            Locked
          </button>
        </div>
        
        <div className="search-filter">
          <input 
            type="text" 
            placeholder="Search achievements..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button 
              className="clear-search"
              onClick={() => setSearchTerm('')}
            >
              ×
            </button>
          )}
        </div>
      </div>
      
      {Object.keys(groupedBadges).length > 0 ? (
        <div className="badges-by-category">
          {Object.entries(groupedBadges).map(([category, categoryBadges]) => (
            <div key={category} className="category-section">
              <h3 className="category-title">{category}</h3>
              <div className="badges-grid">
                {categoryBadges.map((badge, index) => (
                  <AchievementBadge 
                    key={index} 
                    badge={badge}
                    onClick={onBadgeClick}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-badges">
          <div className="no-badges-icon">🏆</div>
          <h3>No achievements found</h3>
          <p>
            {searchTerm 
              ? 'Try adjusting your search or filter settings.' 
              : 'Start participating in platform activities to earn achievements!'}
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Achievement detail component
 */
export function AchievementDetail({ 
  badge, 
  onClose, 
  relatedBadges = [],
  onRelatedBadgeClick
}) {
  return (
    <div className="achievement-detail">
      <div className="detail-header">
        <button 
          className="close-button"
          onClick={onClose}
        >
          ×
        </button>
      </div>
      
      <div className="badge-showcase">
        <div className="badge-icon large">
          {badge.unlocked ? (
            <img 
              src={badge.icon || '/default-badge.png'} 
              alt={badge.name} 
              className="badge-image"
            />
          ) : (
            <div className="locked-badge">
              <span className="lock-icon">🔒</span>
            </div>
          )}
        </div>
        
        <div className="badge-info">
          <h2 className="badge-name">{badge.name}</h2>
          <div className="badge-category">{badge.category}</div>
          
          {badge.unlocked ? (
            <div className="badge-unlocked">
              <span className="unlocked-icon">✓</span>
              <span className="unlocked-text">
                Unlocked on {new Date(badge.unlockedDate).toLocaleDateString()}
              </span>
            </div>
          ) : (
            <div className="badge-locked">
              <span className="locked-icon">🔒</span>
              <span className="locked-text">Locked</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="badge-description">
        <p>{badge.description}</p>
      </div>
      
      {!badge.unlocked && badge.progress && (
        <div className="badge-progress">
          <h3>Progress</h3>
          <div className="progress-text">
            {badge.progress.current} / {badge.progress.required} {badge.progress.unit || 'steps'}
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${(badge.progress.current / badge.progress.required) * 100}%` }}
            ></div>
          </div>
          <div className="progress-description">
            {badge.progress.description || `Complete ${badge.progress.required} ${badge.progress.unit || 'steps'} to unlock this achievement.`}
          </div>
        </div>
      )}
      
      {badge.rewards && badge.rewards.length > 0 && (
        <div className="badge-rewards">
          <h3>Rewards</h3>
          <ul className="rewards-list">
            {badge.rewards.map((reward, index) => (
              <li key={index} className="reward-item">
                <span className="reward-icon">
                  {reward.type === 'points' && '🔢'}
                  {reward.type === 'xp' && '⭐'}
                  {reward.type === 'item' && '🎁'}
                  {reward.type === 'currency' && '💰'}
                  {reward.type === 'discount' && '🏷️'}
                  {reward.type === 'feature' && '🔓'}
                </span>
                <span className="reward-text">{reward.description}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {badge.howToEarn && (
        <div className="how-to-earn">
          <h3>How to Earn</h3>
          <div className="earn-steps">
            {Array.isArray(badge.howToEarn) ? (
              <ol className="steps-list">
                {badge.howToEarn.map((step, index) => (
                  <li key={index} className="step-item">{step}</li>
                ))}
              </ol>
            ) : (
              <p>{badge.howToEarn}</p>
            )}
          </div>
        </div>
      )}
      
      {relatedBadges.length > 0 && (
        <div className="related-badges">
          <h3>Related Achievements</h3>
          <div className="related-badges-grid">
            {relatedBadges.map((relatedBadge, index) => (
              <AchievementBadge 
                key={index} 
                badge={relatedBadge}
                size="small"
                onClick={onRelatedBadgeClick}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Points display component
 */
export function PointsDisplay({ 
  points, 
  showDetails = false, 
  onDetailsClick,
  size = 'medium'
}) {
  return (
    <div className={`points-display ${size}`}>
      <div className="points-value">
        <span className="points-icon">🔢</span>
        <span className="value">{points.total.toLocaleString()}</span>
        <span className="points-label">Points</span>
      </div>
      
      {showDetails && points.breakdown && (
        <div className="points-breakdown">
          <h4>Points Breakdown</h4>
          <ul className="breakdown-list">
            {Object.entries(points.breakdown).map(([category, value]) => (
              <li key={category} className="breakdown-item">
                <span className="category-name">{category}</span>
                <span className="category-value">{value.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {!showDetails && onDetailsClick && (
        <button 
          className="details-button"
          onClick={onDetailsClick}
        >
          Details
        </button>
      )}
    </div>
  );
}

/**
 * Level progress component
 */
export function LevelProgress({ 
  level, 
  showDetails = false, 
  onDetailsClick,
  size = 'medium'
}) {
  const progressPercentage = ((level.currentXP - level.minXP) / (level.maxXP - level.minXP)) * 100;
  
  return (
    <div className={`level-progress ${size}`}>
      <div className="level-header">
        <div className="level-indicator">
          <span className="level-label">Level</span>
          <span className="level-value">{level.current}</span>
        </div>
        
        <div className="level-title">
          {level.title}
        </div>
      </div>
      
      <div className="xp-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="xp-text">
          {level.currentXP.toLocaleString()} / {level.maxXP.toLocaleString()} XP
        </div>
      </div>
      
      <div className="next-level">
        <span className="next-level-xp">
          {(level.maxXP - level.currentXP).toLocaleString()} XP to Level {level.current + 1}
        </span>
        {level.nextTitle && (
          <span className="next-level-title">
            {level.nextTitle}
          </span>
        )}
      </div>
      
      {showDetails && level.perks && (
        <div className="level-perks">
          <h4>Level Perks</h4>
          <ul className="perks-list">
            {level.perks.map((perk, index) => (
              <li key={index} className="perk-item">
                <span className="perk-icon">✓</span>
                <span className="perk-text">{perk}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {!showDetails && onDetailsClick && (
        <button 
          className="details-button"
          onClick={onDetailsClick}
        >
          View Perks
        </button>
      )}
    </div>
  );
}

/**
 * Leaderboard component
 */
export function Leaderboard({ 
  entries = [], 
  title = 'Leaderboard', 
  category = 'points',
  timeframe = 'all-time',
  onUserClick,
  currentUser = null,
  onTimeframeChange,
  onCategoryChange
}) {
  const [expandedUser, setExpandedUser] = useState(null);
  
  const handleUserClick = (userId) => {
    if (expandedUser === userId) {
      setExpandedUser(null);
    } else {
      setExpandedUser(userId);
    }
    
    if (onUserClick) {
      onUserClick(userId);
    }
  };
  
  const handleTimeframeChange = (newTimeframe) => {
    if (onTimeframeChange) {
      onTimeframeChange(newTimeframe);
    }
  };
  
  const handleCategoryChange = (newCategory) => {
    if (onCategoryChange) {
      onCategoryChange(newCategory);
    }
  };
  
  // Find current user's position
  const currentUserPosition = currentUser 
    ? entries.findIndex(entry => entry.user.id === currentUser.id) + 1 
    : null;
  
  return (
    <div className="leaderboard">
      <div className="leaderboard-header">
        <h2>{title}</h2>
        
        <div className="leaderboard-filters">
          <div className="category-filter">
            <select 
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="category-select"
            >
              <option value="points">Points</option>
              <option value="xp">Experience</option>
              <option value="badges">Achievements</option>
              <option value="social">Social Activity</option>
              <option value="learning">Learning Progress</option>
              <option value="sales">Sales</option>
            </select>
          </div>
          
          <div className="timeframe-buttons">
            <button 
              className={`timeframe-button ${timeframe === 'daily' ? 'active' : ''}`}
              onClick={() => handleTimeframeChange('daily')}
            >
              Daily
            </button>
            <button 
              className={`timeframe-button ${timeframe === 'weekl<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>