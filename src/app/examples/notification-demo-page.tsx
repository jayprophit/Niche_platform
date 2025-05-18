import React, { useState } from 'react';
import { useToast } from '../../components/ui/ToastProvider';
import { useNotifications } from '../../components/ui/NotificationContextProvider';
import { playNotificationSound } from '../../components/ui/NotificationSounds';

export default function NotificationDemoPage() {
  const { showToast } = useToast();
  const { addNotification } = useNotifications();
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Toggle theme between light and dark mode
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    showToast(`Theme switched to ${newTheme} mode`, 'info');
  };

  // Handle post submission
  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!postTitle.trim() || !postContent.trim()) {
      showToast('Please fill out all fields', 'error');
      playNotificationSound('error');
      return;
    }
    
    // Show immediate toast feedback
    showToast('Post submitted successfully!', 'success');
    
    // Add to notification center for later reference
    addNotification(
      `Your post "${postTitle}" has been submitted for review`,
      'info',
      'Content'
    );
    
    // Clear form
    setPostTitle('');
    setPostContent('');
  };

  // Example of user interactions that trigger notifications
  const simulateUserActions = () => {
    // Someone liked the user's post
    showToast('Jane Doe liked your post', 'info');
    addNotification('Jane Doe liked your post "Getting Started with React"', 'info', 'Social');
    
    // New comment notification
    setTimeout(() => {
      playNotificationSound('default');
      addNotification(
        'John Smith commented on your post: "Great article, thanks for sharing!"',
        'info',
        'Social'
      );
    }, 2000);
    
    // Content approval notification
    setTimeout(() => {
      playNotificationSound('success');
      showToast('Your content has been approved!', 'success');
      addNotification(
        'Your post "Getting Started with React" has been approved by moderators',
        'success',
        'Content'
      );
    }, 4000);
  };

  return (
    <div className="notification-demo-page" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>Notification System Demo</h1>
        <button 
          onClick={toggleTheme}
          style={{
            padding: '8px 16px',
            background: 'var(--button-primary)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>
      </header>

      <section style={{ marginBottom: '40px' }}>
        <h2>Create a New Post</h2>
        <form onSubmit={handleSubmitPost} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label htmlFor="post-title" style={{ display: 'block', marginBottom: '5px' }}>Post Title</label>
            <input
              id="post-title"
              type="text"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid var(--border-color)',
                background: 'var(--background-secondary)',
                color: 'var(--text-primary)'
              }}
            />
          </div>
          
          <div>
            <label htmlFor="post-content" style={{ display: 'block', marginBottom: '5px' }}>Post Content</label>
            <textarea
              id="post-content"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              rows={5}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '4px',
                border: '1px solid var(--border-color)',
                background: 'var(--background-secondary)',
                color: 'var(--text-primary)'
              }}
            />
          </div>
          
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              background: 'var(--success-color)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              alignSelf: 'flex-start'
            }}
          >
            Submit Post
          </button>
        </form>
      </section>
      
      <section>
        <h2>Simulate User Interactions</h2>
        <p>Click the button below to simulate user interactions that would trigger various notifications:</p>
        <button
          onClick={simulateUserActions}
          style={{
            padding: '10px 20px',
            background: 'var(--info-color)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Run Simulation
        </button>
      </section>
      
      <section style={{ marginTop: '40px' }}>
        <h2>Notification System Features</h2>
        <ul>
          <li>Toast notifications for immediate feedback</li>
          <li>Persistent notifications in the notification center</li>
          <li>Sound effects for important notifications</li>
          <li>Theme support (light/dark mode)</li>
          <li>Categorized notifications for better organization</li>
          <li>User preferences for notification behavior</li>
        </ul>
      </section>
    </div>
  );
}
