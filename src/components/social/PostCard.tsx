import React, { useState } from 'react';
import { emitSocialEvent } from '../../server/realtime';

interface PostCardProps {
  post: {
    id: string;
    content: string;
    authorId: string;
    authorName: string;
    createdAt: string;
    likes?: number;
    shares?: number;
  };
  currentUserId: string;
}

export const PostCard: React.FC<PostCardProps> = ({ post, currentUserId }) => {
  const [isReacting, setIsReacting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [reportReason, setReportReason] = useState('');

  // Handle reactions (like, love, etc.)
  const handleReaction = async (reactionType: string) => {
    setIsReacting(true);
    try {
      const response = await fetch('/api/social/reaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          postId: post.id, 
          userId: currentUserId, 
          reactionType 
        })
      });
      if (!response.ok) throw new Error('Failed to add reaction');
    } catch (error) {
      console.error('Error adding reaction:', error);
    } finally {
      setIsReacting(false);
    }
  };

  // Handle sharing
  const handleShare = async (target: 'feed' | 'group', groupId?: string) => {
    setIsSharing(true);
    try {
      const response = await fetch('/api/social/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          postId: post.id, 
          userId: currentUserId, 
          target,
          groupId
        })
      });
      if (!response.ok) throw new Error('Failed to share post');
    } catch (error) {
      console.error('Error sharing post:', error);
    } finally {
      setIsSharing(false);
    }
  };

  // Handle reporting
  const handleReport = async () => {
    if (!reportReason) return;
    
    setIsReporting(true);
    try {
      const response = await fetch('/api/social/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          contentId: post.id, 
          userId: currentUserId, 
          reason: reportReason 
        })
      });
      if (!response.ok) throw new Error('Failed to report content');
      setReportReason('');
    } catch (error) {
      console.error('Error reporting content:', error);
    } finally {
      setIsReporting(false);
    }
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <span className="author-name">{post.authorName}</span>
        <span className="post-date">{new Date(post.createdAt).toLocaleString()}</span>
      </div>
      
      <div className="post-content">{post.content}</div>
      
      <div className="post-actions">
        <div className="reaction-buttons">
          <button 
            onClick={() => handleReaction('like')} 
            disabled={isReacting}
            className="reaction-btn"
          >
            👍 Like
          </button>
          <button 
            onClick={() => handleReaction('love')} 
            disabled={isReacting}
            className="reaction-btn"
          >
            ❤️ Love
          </button>
        </div>
        
        <button 
          onClick={() => handleShare('feed')} 
          disabled={isSharing}
          className="share-btn"
        >
          🔄 Share to Feed
        </button>
        
        <button 
          onClick={() => setIsReporting(!isReporting)} 
          className="report-btn"
        >
          🚩 Report
        </button>
      </div>
      
      {isReporting && (
        <div className="report-form">
          <select 
            value={reportReason} 
            onChange={(e) => setReportReason(e.target.value)}
            className="report-reason"
          >
            <option value="">Select a reason</option>
            <option value="spam">Spam</option>
            <option value="inappropriate">Inappropriate Content</option>
            <option value="harassment">Harassment</option>
            <option value="misinformation">Misinformation</option>
          </select>
          <button 
            onClick={handleReport} 
            disabled={!reportReason || isReporting}
            className="submit-report-btn"
          >
            Submit Report
          </button>
        </div>
      )}
    </div>
  );
};
