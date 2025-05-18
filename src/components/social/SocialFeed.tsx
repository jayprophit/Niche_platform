import React, { useState, useEffect } from 'react';
import { useFeedRealtime } from './useFeedRealtime';
import { PostCard } from './PostCard';

interface Post {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  likes?: number;
  shares?: number;
  sharedBy?: string;
  originalPostId?: string;
}

interface FeedResponse {
  posts: Post[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export function SocialFeed({ currentUserId }: { currentUserId: string }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchPosts = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/social/feed?page=${page}&search=${encodeURIComponent(search)}`);
      if (!response.ok) throw new Error('Failed to fetch posts');
      
      const data: FeedResponse = await response.json();
      setPosts(data.posts);
      setHasMore(data.hasMore);
      setTotal(data.total);
    } catch (err) {
      setError('Error loading posts. Please try again.');
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [page, search]);

  // Use real-time updates
  useFeedRealtime(() => fetchPosts());

  const handleNextPage = () => {
    if (hasMore && !loading) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1 && !loading) {
      setPage(page - 1);
    }
  };

  return (
    <div className="social-feed">
      <div className="feed-header">
        <h2>Social Feed</h2>
        <div className="search-container">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search posts..."
            className="search-input"
          />
        </div>
      </div>

      {loading && <div className="loading-indicator">Loading posts...</div>}
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="posts-container">
        {posts.length > 0 ? (
          posts.map(post => (
            <PostCard 
              key={post.id} 
              post={post} 
              currentUserId={currentUserId} 
            />
          ))
        ) : !loading && (
          <div className="no-posts-message">
            {search ? 'No posts match your search.' : 'No posts yet. Be the first to share something!'}
          </div>
        )}
      </div>

      <div className="pagination-controls">
        <button 
          onClick={handlePreviousPage} 
          disabled={page <= 1 || loading}
          className="pagination-btn"
        >
          Previous
        </button>
        
        <span className="page-info">
          Page {page} of {Math.ceil(total / 10)}
        </span>
        
        <button 
          onClick={handleNextPage} 
          disabled={!hasMore || loading}
          className="pagination-btn"
        >
          Next
        </button>
      </div>
    </div>
  );
}
