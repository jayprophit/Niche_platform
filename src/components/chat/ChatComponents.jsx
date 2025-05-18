/**
 * Chat and Communication Components
 * Core components for chat and communication functionality across the platform
 */

import React, { useState, useEffect, useRef } from 'react';
import { useDeviceInfo } from '../../lib/responsive/ResponsiveLayout';

/**
 * Direct message conversation component
 */
export function DirectMessageConversation({
  conversation,
  currentUser,
  onSendMessage,
  onLoadMoreMessages,
  onAttachFile,
  onStartVideoCall,
  onStartAudioCall,
  onViewProfile,
  onBlockUser,
  onReportUser
}) {
  const [messageText, setMessageText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const deviceInfo = useDeviceInfo();
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [conversation.messages]);
  
  // Simulate typing indicator
  useEffect(() => {
    if (conversation.otherUser.isTyping) {
      setIsTyping(true);
      const timer = setTimeout(() => {
        setIsTyping(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [conversation.otherUser.isTyping]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!messageText.trim()) return;
    
    onSendMessage(conversation.id, messageText);
    setMessageText('');
    setShowEmojiPicker(false);
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };
  
  const handleAttachClick = () => {
    setShowAttachMenu(!showAttachMenu);
  };
  
  const handleEmojiClick = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };
  
  const handleMoreOptionsClick = () => {
    setShowMoreOptions(!showMoreOptions);
  };
  
  const handleFileInputChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onAttachFile(conversation.id, files);
    }
    // Reset file input
    e.target.value = null;
  };
  
  const handleAttachFileClick = () => {
    fileInputRef.current.click();
    setShowAttachMenu(false);
  };
  
  const handleVideoCallClick = () => {
    onStartVideoCall(conversation.id);
    setShowMoreOptions(false);
  };
  
  const handleAudioCallClick = () => {
    onStartAudioCall(conversation.id);
    setShowMoreOptions(false);
  };
  
  const handleViewProfileClick = () => {
    onViewProfile(conversation.otherUser.id);
    setShowMoreOptions(false);
  };
  
  const handleBlockUserClick = () => {
    onBlockUser(conversation.otherUser.id);
    setShowMoreOptions(false);
  };
  
  const handleReportUserClick = () => {
    onReportUser(conversation.otherUser.id);
    setShowMoreOptions(false);
  };
  
  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + 
             date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };
  
  const renderMessageContent = (message) => {
    if (message.type === 'text') {
      return <div className="message-text">{message.content}</div>;
    } else if (message.type === 'image') {
      return (
        <div className="message-image">
          <img src={message.content} alt="Shared image" />
        </div>
      );
    } else if (message.type === 'file') {
      return (
        <div className="message-file">
          <div className="file-icon">📎</div>
          <div className="file-info">
            <div className="file-name">{message.fileName}</div>
            <div className="file-size">{message.fileSize}</div>
          </div>
          <a href={message.content} download className="download-button">
            Download
          </a>
        </div>
      );
    } else if (message.type === 'video') {
      return (
        <div className="message-video">
          <video controls>
            <source src={message.content} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    } else if (message.type === 'audio') {
      return (
        <div className="message-audio">
          <audio controls>
            <source src={message.content} type="audio/mpeg" />
            Your browser does not support the audio tag.
          </audio>
        </div>
      );
    } else if (message.type === 'system') {
      return <div className="message-system">{message.content}</div>;
    }
    
    return <div className="message-text">{message.content}</div>;
  };
  
  return (
    <div className="direct-message-conversation">
      <div className="conversation-header">
        <div className="user-info" onClick={handleViewProfileClick}>
          <div className="user-avatar">
            <img 
              src={conversation.otherUser.avatar || '/default-avatar.jpg'} 
              alt={conversation.otherUser.name} 
              className="avatar-image"
            />
            <div className={`status-indicator ${conversation.otherUser.status}`}></div>
          </div>
          
          <div className="user-details">
            <div className="user-name">{conversation.otherUser.name}</div>
            <div className="user-status">
              {conversation.otherUser.status === 'online' && 'Online'}
              {conversation.otherUser.status === 'away' && 'Away'}
              {conversation.otherUser.status === 'busy' && 'Busy'}
              {conversation.otherUser.status === 'offline' && 'Offline'}
              {isTyping && <span className="typing-indicator"> • Typing...</span>}
            </div>
          </div>
        </div>
        
        <div className="conversation-actions">
          <button 
            className="action-button audio-call"
            onClick={handleAudioCallClick}
            title="Audio Call"
          >
            <span className="action-icon">📞</span>
          </button>
          
          <button 
            className="action-button video-call"
            onClick={handleVideoCallClick}
            title="Video Call"
          >
            <span className="action-icon">📹</span>
          </button>
          
          <button 
            className="action-button more-options"
            onClick={handleMoreOptionsClick}
            title="More Options"
          >
            <span className="action-icon">⋮</span>
          </button>
          
          {showMoreOptions && (
            <div className="more-options-menu">
              <button 
                className="menu-item"
                onClick={handleViewProfileClick}
              >
                <span className="item-icon">👤</span>
                <span className="item-text">View Profile</span>
              </button>
              
              <button 
                className="menu-item"
                onClick={handleBlockUserClick}
              >
                <span className="item-icon">🚫</span>
                <span className="item-text">Block User</span>
              </button>
              
              <button 
                className="menu-item"
                onClick={handleReportUserClick}
              >
                <span className="item-icon">⚠️</span>
                <span className="item-text">Report User</span>
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="conversation-messages">
        {conversation.hasMoreMessages && (
          <div className="load-more-container">
            <button 
              className="load-more-button"
              onClick={() => onLoadMoreMessages(conversation.id)}
            >
              Load More Messages
            </button>
          </div>
        )}
        
        {conversation.messages.map((message, index) => {
          const isCurrentUser = message.senderId === currentUser.id;
          const showAvatar = !isCurrentUser && 
                            (index === 0 || 
                             conversation.messages[index - 1].senderId !== message.senderId);
          
          return (
            <div 
              key={message.id} 
              className={`message-container ${isCurrentUser ? 'outgoing' : 'incoming'}`}
            >
              {!isCurrentUser && showAvatar && (
                <div className="message-avatar">
                  <img 
                    src={conversation.otherUser.avatar || '/default-avatar.jpg'} 
                    alt={conversation.otherUser.name} 
                    className="avatar-image"
                  />
                </div>
              )}
              
              <div className="message-bubble">
                {renderMessageContent(message)}
                
                <div className="message-meta">
                  <span className="message-time">
                    {formatMessageTime(message.timestamp)}
                  </span>
                  
                  {isCurrentUser && (
                    <span className="message-status">
                      {message.status === 'sent' && '✓'}
                      {message.status === 'delivered' && '✓✓'}
                      {message.status === 'read' && '✓✓'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        
        {isTyping && (
          <div className="typing-container">
            <div className="typing-indicator">
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="conversation-input">
        <form onSubmit={handleSendMessage}>
          <div className="input-container">
            <button 
              type="button"
              className="attach-button"
              onClick={handleAttachClick}
            >
              <span className="button-icon">📎</span>
            </button>
            
            {showAttachMenu && (
              <div className="attach-menu">
                <button 
                  type="button"
                  className="attach-option"
                  onClick={handleAttachFileClick}
                >
                  <span className="option-icon">📄</span>
                  <span className="option-text">File</span>
                </button>
                
                <button 
                  type="button"
                  className="attach-option"
                >
                  <span className="option-icon">🖼️</span>
                  <span className="option-text">Image</span>
                </button>
                
                <button 
                  type="button"
                  className="attach-option"
                >
                  <span className="option-icon">📹</span>
                  <span className="option-text">Video</span>
                </button>
                
                <button 
                  type="button"
                  className="attach-option"
                >
                  <span className="option-icon">🎤</span>
                  <span className="option-text">Audio</span>
                </button>
              </div>
            )}
            
            <input 
              type="file" 
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleFileInputChange}
              multiple
            />
            
            <textarea 
              placeholder="Type a message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={handleKeyPress}
              className="message-input"
              rows={1}
            ></textarea>
            
            <button 
              type="button"
              className="emoji-button"
              onClick={handleEmojiClick}
            >
              <span className="button-icon">😊</span>
            </button>
            
            {showEmojiPicker && (
              <div className="emoji-picker">
                {/* Emoji picker content would go here */}
                <div className="emoji-grid">
                  {['😊', '😂', '❤️', '👍', '🎉', '🔥', '😍', '🤔', '👏', '🙏', '😭', '😎', '🥳', '😢', '😡', '👋', '🤝', '💪', '✨', '⭐'].map((emoji, index) => (
                    <button 
                      key={index}
                      type="button"
                      className="emoji-item"
                      onClick={() => {
                        setMessageText(prev => prev + emoji);
                        setShowEmojiPicker(false);
                      }}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <button 
              type="submit"
              className="send-button"
              disabled={!messageText.trim()}
            >
              <span className="button-icon">📤</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/**
 * Conversation list component
 */
export function ConversationList({
  conversations = [],
  currentUser,
  selectedConversationId,
  onSelectConversation,
  onSearchConversations,
  onStartNewConversation,
  onArchiveConversation
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearchConversations(term);
  };
  
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };
  
  const handleArchive = (e, conversationId) => {
    e.stopPropagation();
    onArchiveConversation(conversationId);
  };
  
  const formatLastMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      // Today, show time
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      // Yesterday
      return 'Yesterday';
    } else if (diffDays < 7) {
      // Within a week, show day name
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      // Older, show date
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };
  
  // Filter conversations based on current filter
  const filteredConversations = conversations.filter(conversation => {
    if (filter === 'unread') {
      return conversation.unreadCount > 0;
    } else if (filter === 'archived') {
      return conversation.archived;
    } else {
      return !conversation.archived;
    }
  });
  
  return (
    <div className="conversation-list">
      <div className="list-header">
        <h2>Messages</h2>
        
        <button 
          className="new-message-button"
          onClick={onStartNewConversation}
        >
          <span className="button-icon">✏️</span>
          <span className="button-text">New Message</span>
        </button>
      </div>
      
      <div className="search-container">
        <div className="search-input-container">
          <span className="<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>