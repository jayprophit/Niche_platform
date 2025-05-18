/**
 * Social Group Components
 * Components for group functionality in the social media section
 */

import React, { useState, useEffect } from 'react';
import { PostCreator, ActivityFeed } from './SocialComponents';

/**
 * Group list component
 */
export function GroupList({ groups = [], onJoinGroup }) {
  return (
    <div className="social-group-list">
      <h2>Groups</h2>
      
      {groups.length > 0 ? (
        <div className="groups-grid">
          {groups.map((group, index) => (
            <GroupCard 
              key={index} 
              group={group} 
              onJoinGroup={onJoinGroup} 
            />
          ))}
        </div>
      ) : (
        <div className="empty-groups">
          <div className="empty-icon">👥</div>
          <h3>No Groups Found</h3>
          <p>Join or create a group to connect with people who share your interests.</p>
          <button className="create-group-button">Create Group</button>
        </div>
      )}
    </div>
  );
}

/**
 * Group card component
 */
export function GroupCard({ group, onJoinGroup }) {
  const [isJoined, setIsJoined] = useState(group.isMember);
  
  const handleJoinToggle = () => {
    setIsJoined(!isJoined);
    onJoinGroup(group.id, !isJoined);
  };
  
  return (
    <div className="group-card">
      <div className="group-cover">
        <img 
          src={group.coverImage || '/default-group-cover.jpg'} 
          alt={group.name} 
          className="cover-image"
        />
      </div>
      
      <div className="group-info">
        <div className="group-avatar">
          <img 
            src={group.avatar || '/default-group-avatar.jpg'} 
            alt={group.name} 
            className="avatar-image"
          />
        </div>
        
        <h3 className="group-name">{group.name}</h3>
        
        <div className="group-meta">
          <div className="group-privacy">
            <span className={`privacy-icon ${group.privacy}`}></span>
            <span className="privacy-label">
              {group.privacy === 'public' ? 'Public Group' : 
               group.privacy === 'private' ? 'Private Group' : 
               'Secret Group'}
            </span>
          </div>
          
          <div className="group-members">
            <span className="members-icon">👥</span>
            <span className="members-count">{group.memberCount} members</span>
          </div>
          
          <div className="group-activity">
            <span className="activity-icon">📊</span>
            <span className="activity-label">{group.activityLevel} activity</span>
          </div>
        </div>
        
        <p className="group-description">
          {group.description.length > 120 ? 
            `${group.description.substring(0, 120)}...` : 
            group.description}
        </p>
        
        <div className="group-actions">
          <button 
            className={`join-button ${isJoined ? 'joined' : ''}`}
            onClick={handleJoinToggle}
          >
            {isJoined ? 'Joined' : 'Join Group'}
          </button>
          
          <a 
            href={`/groups/${group.id}`} 
            className="view-button"
          >
            View Group
          </a>
        </div>
      </div>
    </div>
  );
}

/**
 * Group detail component
 */
export function GroupDetail({ group, currentUser, onPost, onJoinGroup }) {
  const [activeTab, setActiveTab] = useState('feed');
  const [isJoined, setIsJoined] = useState(group.isMember);
  
  const handleJoinToggle = () => {
    setIsJoined(!isJoined);
    onJoinGroup(group.id, !isJoined);
  };
  
  const canViewContent = group.privacy === 'public' || isJoined;
  
  return (
    <div className="social-group-detail">
      <div className="group-header">
        <div className="group-cover">
          <img 
            src={group.coverImage || '/default-group-cover.jpg'} 
            alt={group.name} 
            className="cover-image"
          />
        </div>
        
        <div className="group-info">
          <div className="group-avatar">
            <img 
              src={group.avatar || '/default-group-avatar.jpg'} 
              alt={group.name} 
              className="avatar-image"
            />
          </div>
          
          <div className="group-details">
            <h1 className="group-name">{group.name}</h1>
            
            <div className="group-meta">
              <div className="group-privacy">
                <span className={`privacy-icon ${group.privacy}`}></span>
                <span className="privacy-label">
                  {group.privacy === 'public' ? 'Public Group' : 
                   group.privacy === 'private' ? 'Private Group' : 
                   'Secret Group'}
                </span>
              </div>
              
              <div className="group-members">
                <span className="members-icon">👥</span>
                <span className="members-count">{group.memberCount} members</span>
              </div>
              
              <div className="group-created">
                <span className="created-icon">📅</span>
                <span className="created-date">Created {new Date(group.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          
          <div className="group-actions">
            {!isJoined ? (
              <button 
                className="join-button"
                onClick={handleJoinToggle}
              >
                Join Group
              </button>
            ) : (
              <div className="member-actions">
                <button className="invite-button">
                  <span className="invite-icon">✉️</span>
                  <span className="invite-label">Invite</span>
                </button>
                
                <button 
                  className="leave-button"
                  onClick={handleJoinToggle}
                >
                  <span className="leave-icon">🚪</span>
                  <span className="leave-label">Leave</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="group-content">
        <div className="group-tabs">
          <button 
            className={`group-tab ${activeTab === 'feed' ? 'active' : ''}`}
            onClick={() => setActiveTab('feed')}
          >
            <span className="tab-icon">📰</span>
            <span className="tab-label">Feed</span>
          </button>
          
          <button 
            className={`group-tab ${activeTab === 'about' ? 'active' : ''}`}
            onClick={() => setActiveTab('about')}
          >
            <span className="tab-icon">ℹ️</span>
            <span className="tab-label">About</span>
          </button>
          
          <button 
            className={`group-tab ${activeTab === 'members' ? 'active' : ''}`}
            onClick={() => setActiveTab('members')}
          >
            <span className="tab-icon">👥</span>
            <span className="tab-label">Members</span>
          </button>
          
          <button 
            className={`group-tab ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            <span className="tab-icon">📅</span>
            <span className="tab-label">Events</span>
          </button>
          
          <button 
            className={`group-tab ${activeTab === 'media' ? 'active' : ''}`}
            onClick={() => setActiveTab('media')}
          >
            <span className="tab-icon">🖼️</span>
            <span className="tab-label">Media</span>
          </button>
        </div>
        
        <div className="group-tab-content">
          {activeTab === 'feed' && (
            <div className="group-feed">
              {!canViewContent ? (
                <div className="private-content">
                  <div className="private-icon">🔒</div>
                  <h3>Private Group</h3>
                  <p>Join this group to see the discussion, photos, and more.</p>
                  <button 
                    className="join-button"
                    onClick={handleJoinToggle}
                  >
                    Join Group
                  </button>
                </div>
              ) : (
                <>
                  {isJoined && (
                    <PostCreator 
                      user={currentUser} 
                      onPostSubmit={(post) => onPost(group.id, post)} 
                    />
                  )}
                  
                  <ActivityFeed 
                    posts={group.posts || []}
                    currentUser={currentUser}
                    onLike={() => {}}
                    onComment={() => {}}
                    onShare={() => {}}
                    onDelete={() => {}}
                  />
                </>
              )}
            </div>
          )}
          
          {activeTab === 'about' && (
            <div className="group-about">
              <div className="about-section">
                <h3>Description</h3>
                <p>{group.description || 'No description provided'}</p>
              </div>
              
              <div className="about-section">
                <h3>Rules</h3>
                {group.rules && group.rules.length > 0 ? (
                  <ol className="rules-list">
                    {group.rules.map((rule, index) => (
                      <li key={index} className="rule-item">
                        <div className="rule-title">{rule.title}</div>
                        {rule.description && (
                          <div className="rule-description">{rule.description}</div>
                        )}
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p>No rules specified</p>
                )}
              </div>
              
              <div className="about-section">
                <h3>Admins and Moderators</h3>
                <div className="admin-list">
                  {group.admins && group.admins.map((admin, index) => (
                    <div key={index} className="admin-item">
                      <img 
                        src={admin.avatar || '/default-avatar.jpg'} 
                        alt={admin.displayName} 
                        className="admin-avatar"
                      />
                      <div className="admin-info">
                        <div className="admin-name">{admin.displayName}</div>
                        <div className="admin-role">
                          {admin.role === 'owner' ? 'Owner' : 
                           admin.role === 'admin' ? 'Admin' : 
                           'Moderator'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'members' && (
            <div className="group-members">
              {!canViewContent ? (
                <div className="private-content">
                  <div className="private-icon">🔒</div>
                  <h3>Private Group</h3>
                  <p>Join this group to see the members list.</p>
                  <button 
                    className="join-button"
                    onClick={handleJoinToggle}
                  >
                    Join Group
                  </button>
                </div>
              ) : (
                <>
                  <div className="members-search">
                    <input 
                      type="text" 
                      placeholder="Search members..." 
                      className="members-search-input"
                    />
                  </div>
                  
                  <div className="members-list">
                    {group.members && group.members.map((member, index) => (
                      <div key={index} className="member-item">
                        <img 
                          src={member.avatar || '/default-avatar.jpg'} 
                          alt={member.displayName} 
                          className="member-avatar"
                        />
                        <div className="member-info">
                          <div className="member-name">{member.displayName}</div>
                          <div className="member-joined">
                            Joined {new Date(member.joinedAt).toLocaleDateString()}
                          </div>
                        </div>
                        {isJoined && (
                          <div className="member-actions">
                            <button className="message-member">
                              <span className="message-icon">✉️</span>
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
          
          {activeTab === 'events' && (
            <div className="group-events">
              {!canViewContent ? (
                <div className="private-content">
                  <div className="private-icon">🔒</div>
                  <h3>Private Group</h3>
                  <p>Join this group to see upcoming events.</p>
                  <button 
                    className="join-button"
                    onClick={handleJoinToggle}
                  >
                    Join Group
                  </button>
                </div>
              ) : (
                <>
                  {isJoined && (
                    <div className="create-event">
                      <button className="create-event-button">
                        <span className="create-icon">➕</span>
                        <span className="create-label">Create Event</span>
                      </button>
                    </div>
                  )}
                  
                  {group.events && group.events.length > 0 ? (
                    <div className="events-list">
                      {group.events.map((event, index) => (
                        <div key={index} className="event-item">
                          <div className="event-date">
                            <div className="event-month">
                              {new Date(event.startDate).toLocaleDateString('en-US', { month: 'short' })}
                            </div>
                            <div className="event-day">
                              {new Date(event.startDate).getDate()}
                            </div>
                          </div>
                          
                          <div className="event-details">
                            <h3 className="event-title">{event.title}</h3>
                            <div className="event-meta">
                              <div className="event-time">
                                <span className="time-icon">🕒</span>
                                <span className="time-text">
                                  {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  {event.endDate && ` - ${new Date(event.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                                </span>
                              </div>
                              
                              <div className="event-location">
                                <span className="location-icon">📍</span>
                                <span className="location-text">{event.location}</span>
                              </div>
                            </div>
                            
                            <<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>