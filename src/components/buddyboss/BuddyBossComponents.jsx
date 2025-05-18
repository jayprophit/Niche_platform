/**
 * BuddyBoss-style components and features
 * Implements social networking functionality similar to BuddyBoss theme
 */

import React, { useState, useEffect } from 'react';
import { useDeviceInfo } from './responsive/ResponsiveLayout';

/**
 * Main BuddyBoss-style profile component
 */
export function ProfileHeader({ user, isCurrentUser = false }) {
  return (
    <div className="bb-profile-header">
      <div className="bb-profile-cover">
        <img src={user.coverImage || '/default-cover.jpg'} alt="Profile Cover" />
      </div>
      <div className="bb-profile-content">
        <div className="bb-profile-avatar">
          <img src={user.profileImage || '/default-avatar.jpg'} alt={user.displayName} />
          {isCurrentUser && (
            <button className="bb-avatar-change">
              <span className="bb-icon-camera"></span>
            </button>
          )}
        </div>
        <div className="bb-profile-details">
          <h1>{user.displayName}</h1>
          <p className="bb-profile-bio">{user.bio}</p>
          <div className="bb-profile-meta">
            <span className="bb-profile-location">
              <span className="bb-icon-location"></span> {user.location}
            </span>
            <span className="bb-profile-joined">
              <span className="bb-icon-calendar"></span> Joined {new Date(user.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="bb-profile-actions">
          {!isCurrentUser && (
            <>
              <button className="bb-button bb-button-primary">
                <span className="bb-icon-user-plus"></span> Connect
              </button>
              <button className="bb-button">
                <span className="bb-icon-message"></span> Message
              </button>
            </>
          )}
          {isCurrentUser && (
            <button className="bb-button">
              <span className="bb-icon-edit"></span> Edit Profile
            </button>
          )}
        </div>
      </div>
      <nav className="bb-profile-navigation">
        <ul>
          <li className="active"><a href="#timeline">Timeline</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#friends">Friends</a></li>
          <li><a href="#groups">Groups</a></li>
          <li><a href="#photos">Photos</a></li>
          <li><a href="#videos">Videos</a></li>
          <li><a href="#courses">Courses</a></li>
          <li><a href="#products">Products</a></li>
        </ul>
      </nav>
    </div>
  );
}

/**
 * BuddyBoss-style activity feed component
 */
export function ActivityFeed({ posts = [], onNewPost }) {
  const [newPostContent, setNewPostContent] = useState('');
  
  const handleSubmitPost = (e) => {
    e.preventDefault();
    if (newPostContent.trim()) {
      onNewPost(newPostContent);
      setNewPostContent('');
    }
  };
  
  return (
    <div className="bb-activity-feed">
      <div className="bb-post-form">
        <form onSubmit={handleSubmitPost}>
          <div className="bb-post-input">
            <textarea 
              placeholder="What's on your mind?"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
            ></textarea>
          </div>
          <div className="bb-post-actions">
            <div className="bb-post-media-buttons">
              <button type="button" className="bb-media-button">
                <span className="bb-icon-image"></span> Photo/Video
              </button>
              <button type="button" className="bb-media-button">
                <span className="bb-icon-link"></span> Link
              </button>
              <button type="button" className="bb-media-button">
                <span className="bb-icon-smile"></span> Emoji
              </button>
            </div>
            <button type="submit" className="bb-button bb-button-primary">Post</button>
          </div>
        </form>
      </div>
      
      <div className="bb-activity-list">
        {posts.map((post, index) => (
          <ActivityPost key={index} post={post} />
        ))}
      </div>
    </div>
  );
}

/**
 * BuddyBoss-style activity post component
 */
export function ActivityPost({ post }) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  
  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      // Add comment logic here
      setNewComment('');
    }
  };
  
  return (
    <div className="bb-activity-item">
      <div className="bb-activity-avatar">
        <a href={`/profile/${post.author.username}`}>
          <img src={post.author.profileImage || '/default-avatar.jpg'} alt={post.author.displayName} />
        </a>
      </div>
      <div className="bb-activity-content">
        <div className="bb-activity-header">
          <div className="bb-activity-author">
            <a href={`/profile/${post.author.username}`}>{post.author.displayName}</a>
          </div>
          <div className="bb-activity-time">
            <a href={`/activity/${post.id}`}>{new Date(post.createdAt).toLocaleString()}</a>
          </div>
        </div>
        
        <div className="bb-activity-body">
          <div className="bb-activity-text">
            {post.content}
          </div>
          
          {post.media && post.media.length > 0 && (
            <div className="bb-activity-media">
              {post.media.map((item, index) => (
                <div key={index} className="bb-media-item">
                  {item.type === 'image' && (
                    <img src={item.url} alt={item.alt || 'Activity media'} />
                  )}
                  {item.type === 'video' && (
                    <video controls src={item.url}></video>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="bb-activity-footer">
          <div className="bb-activity-reactions">
            <button className="bb-reaction-button">
              <span className="bb-icon-like"></span> Like ({post.likeCount || 0})
            </button>
            <button 
              className="bb-reaction-button"
              onClick={() => setShowComments(!showComments)}
            >
              <span className="bb-icon-comment"></span> Comment ({post.commentCount || 0})
            </button>
            <button className="bb-reaction-button">
              <span className="bb-icon-share"></span> Share
            </button>
          </div>
          
          {showComments && (
            <div className="bb-activity-comments">
              {post.comments && post.comments.map((comment, index) => (
                <div key={index} className="bb-comment-item">
                  <div className="bb-comment-avatar">
                    <a href={`/profile/${comment.author.username}`}>
                      <img src={comment.author.profileImage || '/default-avatar.jpg'} alt={comment.author.displayName} />
                    </a>
                  </div>
                  <div className="bb-comment-content">
                    <div className="bb-comment-header">
                      <a href={`/profile/${comment.author.username}`}>{comment.author.displayName}</a>
                      <span className="bb-comment-time">{new Date(comment.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="bb-comment-text">
                      {comment.content}
                    </div>
                    <div className="bb-comment-actions">
                      <button className="bb-comment-action">Like</button>
                      <button className="bb-comment-action">Reply</button>
                    </div>
                  </div>
                </div>
              ))}
              
              <form className="bb-comment-form" onSubmit={handleSubmitComment}>
                <div className="bb-comment-input">
                  <textarea 
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  ></textarea>
                </div>
                <button type="submit" className="bb-button bb-button-primary">Post</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * BuddyBoss-style groups component
 */
export function GroupsList({ groups = [] }) {
  return (
    <div className="bb-groups-list">
      <div className="bb-groups-header">
        <h2>Groups</h2>
        <div className="bb-groups-actions">
          <button className="bb-button bb-button-primary">Create Group</button>
        </div>
      </div>
      
      <div className="bb-groups-filters">
        <div className="bb-groups-search">
          <input type="text" placeholder="Search Groups..." />
          <button className="bb-search-button">
            <span className="bb-icon-search"></span>
          </button>
        </div>
        <div className="bb-groups-sort">
          <select>
            <option value="newest">Newest</option>
            <option value="active">Most Active</option>
            <option value="popular">Most Popular</option>
            <option value="alphabetical">Alphabetical</option>
          </select>
        </div>
      </div>
      
      <div className="bb-groups-grid">
        {groups.map((group, index) => (
          <div key={index} className="bb-group-card">
            <div className="bb-group-cover">
              <img src={group.coverImage || '/default-group-cover.jpg'} alt={group.name} />
            </div>
            <div className="bb-group-content">
              <div className="bb-group-avatar">
                <img src={group.avatar || '/default-group-avatar.jpg'} alt={group.name} />
              </div>
              <h3 className="bb-group-name">
                <a href={`/groups/${group.id}`}>{group.name}</a>
              </h3>
              <div className="bb-group-meta">
                <span className="bb-group-type">{group.privacy}</span>
                <span className="bb-group-members">{group.memberCount} members</span>
                <span className="bb-group-activity">{group.activityCount} posts</span>
              </div>
              <p className="bb-group-description">{group.description}</p>
              <div className="bb-group-actions">
                <button className="bb-button bb-button-primary">Join Group</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * BuddyBoss-style members directory component
 */
export function MembersDirectory({ members = [] }) {
  return (
    <div className="bb-members-directory">
      <div className="bb-members-header">
        <h2>Members</h2>
        <div className="bb-members-filters">
          <div className="bb-members-search">
            <input type="text" placeholder="Search Members..." />
            <button className="bb-search-button">
              <span className="bb-icon-search"></span>
            </button>
          </div>
          <div className="bb-members-sort">
            <select>
              <option value="newest">Newest</option>
              <option value="active">Active</option>
              <option value="popular">Popular</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="bb-members-grid">
        {members.map((member, index) => (
          <div key={index} className="bb-member-card">
            <div className="bb-member-avatar">
              <a href={`/profile/${member.username}`}>
                <img src={member.profileImage || '/default-avatar.jpg'} alt={member.displayName} />
              </a>
            </div>
            <div className="bb-member-content">
              <h3 className="bb-member-name">
                <a href={`/profile/${member.username}`}>{member.displayName}</a>
              </h3>
              <div className="bb-member-meta">
                <span className="bb-member-status">{member.isOnline ? 'Online' : 'Offline'}</span>
                <span className="bb-member-joined">Joined {new Date(member.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="bb-member-actions">
                <button className="bb-button bb-button-primary">Connect</button>
                <button className="bb-button">Message</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * BuddyBoss-style messaging component
 */
export function MessagingInterface({ conversations = [], activeConversation = null }) {
  const [message, setMessage] = useState('');
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && activeConversation) {
      // Send message logic here
      setMessage('');
    }
  };
  
  return (
    <div className="bb-messaging">
      <div className="bb-messaging-sidebar">
        <div className="bb-messaging-header">
          <h3>Messages</h3>
          <button className="bb-button bb-button-primary">
            <span className="bb-icon-compose"></span> New Message
          </button>
        </div>
        <div className="bb-conversations-list">
          {conversations.map((conversation, index) => (
            <div 
              key={index} 
              className={`bb-conversation-item ${activeConversation && activeConversation.id === conversation.id ? 'active' : ''}`}
            >
              <div className="bb-conversation-avatar">
                <img src={conversation.avatar || '/default-avatar.jpg'} alt={conversation.title} />
                {conversation.isOnline && <span className="bb-online-indicator"></span>}
              </div>
              <div className="bb-conversation-content">
                <div className="bb-conversation-title">{conversation.title}</div>
                <div className="bb-conversation-preview">{conversation.lastMessage}</div>
              </div>
              <div className="bb-conversation-meta">
                <div className="bb-conversation-time">{conversation.lastMessageTime}</div>
                {conversation.unreadCount > 0 && (
                  <div className="bb-conversation-unread">{conversation.unreadCount}</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bb-messaging-content">
        {activeConversation ? (
          <>
            <div className="bb-messaging-header">
              <div className="bb-conversation-info">
                <div className="bb-conversation-avatar">
                  <img src={activeConversation.avatar || '/default-avatar.jpg'} alt={activeConversation.title} />
                  {activeConversation.isOnline && <span className="bb-online-indicator"></span>}
                </div>
                <div className="bb-conversation-details">
                  <div className="bb-conversation-title">{activeConversation.title}</div>
                  <div className="bb-conversation-status">
                    {activeConversation.isOnline ? 'Online' : 'Last active ' + activeConversation.lastActive}
                  </div>
                </div>
              </div>
              <div className="bb-conversation-actions">
                <button className="bb-button">
                  <span className="bb-icon-video"></span>
                </button>
                <button className="bb-button">
                  <span className="bb-icon-call"></span>
                </button>
                <button className="bb-button">
                  <span className="bb-icon-info"></span>
                </button>
         <response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>