/**
 * Social Media Features Implementation
 * Core components for social networking functionality
 */

import React, { useState, useEffect } from 'react';
import { useDeviceInfo } from '../../lib/responsive/ResponsiveLayout';
import { ExternalLinksDisplay, SocialShareButtons } from '../../components/integration/ExternalPlatformComponents';

/**
 * Post creation component
 */
export function PostCreator({ user, onPostSubmit }) {
  const [postContent, setPostContent] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [privacyLevel, setPrivacyLevel] = useState('public');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const handleContentChange = (e) => {
    setPostContent(e.target.value);
  };
  
  const handleAttachmentChange = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map(file => ({
      file,
      type: file.type.startsWith('image/') ? 'image' : 
            file.type.startsWith('video/') ? 'video' : 'file',
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      name: file.name,
      size: file.size
    }));
    
    setAttachments([...attachments, ...newAttachments]);
  };
  
  const removeAttachment = (index) => {
    const newAttachments = [...attachments];
    
    // Revoke object URL to prevent memory leaks
    if (newAttachments[index].preview) {
      URL.revokeObjectURL(newAttachments[index].preview);
    }
    
    newAttachments.splice(index, 1);
    setAttachments(newAttachments);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!postContent.trim() && attachments.length === 0) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onPostSubmit({
        content: postContent,
        attachments,
        privacyLevel
      });
      
      // Clear form after successful submission
      setPostContent('');
      
      // Revoke all object URLs
      attachments.forEach(attachment => {
        if (attachment.preview) {
          URL.revokeObjectURL(attachment.preview);
        }
      });
      
      setAttachments([]);
      setPrivacyLevel('public');
    } catch (error) {
      console.error('Error submitting post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };
  
  const addEmoji = (emoji) => {
    setPostContent(prevContent => prevContent + emoji);
    setShowEmojiPicker(false);
  };
  
  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      attachments.forEach(attachment => {
        if (attachment.preview) {
          URL.revokeObjectURL(attachment.preview);
        }
      });
    };
  }, []);
  
  return (
    <div className="social-post-creator">
      <div className="post-creator-header">
        <img 
          src={user?.avatar || '/default-avatar.jpg'} 
          alt={user?.displayName || 'User'} 
          className="user-avatar"
        />
        <div className="post-creator-info">
          <div className="user-name">{user?.displayName || 'User'}</div>
          <div className="privacy-selector">
            <select 
              value={privacyLevel}
              onChange={(e) => setPrivacyLevel(e.target.value)}
            >
              <option value="public">Public</option>
              <option value="friends">Friends Only</option>
              <option value="private">Private</option>
            </select>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="post-content-area">
          <textarea
            placeholder="What's on your mind?"
            value={postContent}
            onChange={handleContentChange}
            rows={4}
            disabled={isSubmitting}
          ></textarea>
          
          {attachments.length > 0 && (
            <div className="attachment-previews">
              {attachments.map((attachment, index) => (
                <div key={index} className={`attachment-preview attachment-${attachment.type}`}>
                  {attachment.type === 'image' && (
                    <img src={attachment.preview} alt={attachment.name} />
                  )}
                  {attachment.type === 'video' && (
                    <div className="video-preview">
                      <span className="video-icon">🎬</span>
                      <span className="video-name">{attachment.name}</span>
                    </div>
                  )}
                  {attachment.type === 'file' && (
                    <div className="file-preview">
                      <span className="file-icon">📄</span>
                      <span className="file-name">{attachment.name}</span>
                    </div>
                  )}
                  <button 
                    type="button" 
                    className="remove-attachment"
                    onClick={() => removeAttachment(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="post-actions">
          <div className="post-attachments">
            <label className="attachment-button">
              <span className="attachment-icon">📷</span>
              <span className="attachment-label">Photo</span>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleAttachmentChange}
                disabled={isSubmitting}
                multiple
                hidden
              />
            </label>
            
            <label className="attachment-button">
              <span className="attachment-icon">🎬</span>
              <span className="attachment-label">Video</span>
              <input 
                type="file" 
                accept="video/*" 
                onChange={handleAttachmentChange}
                disabled={isSubmitting}
                multiple
                hidden
              />
            </label>
            
            <label className="attachment-button">
              <span className="attachment-icon">📄</span>
              <span className="attachment-label">File</span>
              <input 
                type="file" 
                onChange={handleAttachmentChange}
                disabled={isSubmitting}
                multiple
                hidden
              />
            </label>
            
            <button 
              type="button" 
              className="emoji-button"
              onClick={toggleEmojiPicker}
              disabled={isSubmitting}
            >
              <span className="emoji-icon">😊</span>
              <span className="emoji-label">Emoji</span>
            </button>
          </div>
          
          <button 
            type="submit" 
            className="post-submit-button"
            disabled={isSubmitting || (!postContent.trim() && attachments.length === 0)}
          >
            {isSubmitting ? 'Posting...' : 'Post'}
          </button>
        </div>
        
        {showEmojiPicker && (
          <div className="emoji-picker">
            {/* Simple emoji picker - in a real app, use a proper emoji picker library */}
            <div className="emoji-grid">
              {['😊', '😂', '❤️', '👍', '🎉', '🔥', '😎', '🤔', '😢', '😡', '🥳', '😴'].map(emoji => (
                <button 
                  key={emoji} 
                  type="button" 
                  className="emoji-item"
                  onClick={() => addEmoji(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

/**
 * Social post component
 */
export function SocialPost({ post, currentUser, onLike, onComment, onShare, onDelete }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  const toggleComments = () => {
    setShowComments(!showComments);
  };
  
  const handleLike = () => {
    onLike(post.id);
  };
  
  const handleShare = () => {
    onShare(post.id);
  };
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      onDelete(post.id);
    }
  };
  
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!commentText.trim()) {
      return;
    }
    
    setIsSubmittingComment(true);
    
    try {
      await onComment(post.id, commentText);
      setCommentText('');
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmittingComment(false);
    }
  };
  
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffSec < 60) {
      return 'just now';
    } else if (diffMin < 60) {
      return `${diffMin}m ago`;
    } else if (diffHour < 24) {
      return `${diffHour}h ago`;
    } else if (diffDay < 7) {
      return `${diffDay}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
  const isCurrentUserPost = post.user.id === currentUser?.id;
  
  return (
    <div className="social-post">
      <div className="post-header">
        <div className="post-user">
          <img 
            src={post.user.avatar || '/default-avatar.jpg'} 
            alt={post.user.displayName} 
            className="user-avatar"
          />
          <div className="post-user-info">
            <div className="user-name">{post.user.displayName}</div>
            <div className="post-meta">
              <span className="post-time">{formatTimestamp(post.timestamp)}</span>
              <span className="post-privacy">{post.privacyLevel}</span>
            </div>
          </div>
        </div>
        
        <div className="post-actions-menu">
          <button className="post-menu-button">
            <span className="menu-icon">⋮</span>
            <div className="post-menu-dropdown">
              {isCurrentUserPost && (
                <button 
                  className="menu-item menu-delete"
                  onClick={handleDelete}
                >
                  Delete Post
                </button>
              )}
              <button className="menu-item">
                Save Post
              </button>
              <button className="menu-item">
                Report Post
              </button>
            </div>
          </button>
        </div>
      </div>
      
      <div className="post-content">
        {post.content && (
          <div className="post-text">
            {isExpanded || post.content.length <= 300 ? (
              <p>{post.content}</p>
            ) : (
              <>
                <p>{post.content.substring(0, 300)}...</p>
                <button 
                  className="read-more-button"
                  onClick={toggleExpand}
                >
                  Read More
                </button>
              </>
            )}
          </div>
        )}
        
        {post.attachments && post.attachments.length > 0 && (
          <div className={`post-attachments attachment-count-${post.attachments.length}`}>
            {post.attachments.map((attachment, index) => (
              <div key={index} className={`post-attachment attachment-${attachment.type}`}>
                {attachment.type === 'image' && (
                  <img 
                    src={attachment.url} 
                    alt={attachment.description || 'Post attachment'} 
                    className="attachment-image"
                  />
                )}
                {attachment.type === 'video' && (
                  <video 
                    src={attachment.url} 
                    controls
                    className="attachment-video"
                  ></video>
                )}
                {attachment.type === 'file' && (
                  <a 
                    href={attachment.url} 
                    className="attachment-file"
                    download
                  >
                    <span className="file-icon">📄</span>
                    <span className="file-name">{attachment.name}</span>
                    <span className="file-size">{attachment.size}</span>
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="post-stats">
        <div className="post-likes">
          <span className="like-icon">👍</span>
          <span className="like-count">{post.likeCount}</span>
        </div>
        
        <div className="post-comments-shares">
          <span className="comment-count">{post.commentCount} comments</span>
          <span className="share-count">{post.shareCount} shares</span>
        </div>
      </div>
      
      <div className="post-interaction-buttons">
        <button 
          className={`interaction-button like-button ${post.isLiked ? 'liked' : ''}`}
          onClick={handleLike}
        >
          <span className="button-icon">👍</span>
          <span className="button-label">Like</span>
        </button>
        
        <button 
          className="interaction-button comment-button"
          onClick={toggleComments}
        >
          <span className="button-icon">💬</span>
          <span className="button-label">Comment</span>
        </button>
        
        <button 
          className="interaction-button share-button"
          onClick={handleShare}
        >
          <span className="button-icon">↗️</span>
          <span className="button-label">Share</span>
        </button>
      </div>
      
      {showComments && (
        <div className="post-comments-section">
          <div className="comments-list">
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comment, index) => (
                <div key={index} className="comment-item">
                  <img 
                    src={comment.user.avatar || '/default-avatar.jpg'} 
                    alt={comment.user.displayName} 
                    className="comment-avatar"
                  />
                  <div className="comment-content">
                    <div className="comment-header">
                      <span className="comment-user">{comment.user.displayName}</span>
                      <span className="comment-time">{formatTimestamp(comment.timestamp)}</span>
                    </div>
                    <div className="comment-text">{comment.content}</div>
                    <div className="comment-actions">
                      <button className="comment-like">Like</button>
                      <button className="comment-reply">Reply</button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-comments">No comments yet</div>
            )}
          </div>
          
          <form className="comment-form" onSubmit={handleCommentSubmit}>
            <img 
              src={currentUser?.avatar || '/default-avatar.jpg'} 
              alt={currentUser?.displayName || 'User'} 
              className="comment-avatar"
            />
            <div className="comment-input-container">
              <input 
                type="text" 
      <response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>