import React, { useState, useEffect } from 'react';
import { useNotifications } from './NotificationContextProvider';

/**
 * Notification Analytics Dashboard
 * Displays metrics about notification engagement and provides data visualization
 */
export const NotificationAnalytics: React.FC = () => {
  const { analyticsData, connectionStatus } = useNotifications();
  const [dateRange, setDateRange] = useState<'day' | 'week' | 'month'>('week');
  
  // Calculate engagement rate as the percentage of notifications that were read
  const engagementRate = analyticsData.totalReceived > 0 
    ? Math.round((analyticsData.totalRead / analyticsData.totalReceived) * 100) 
    : 0;
  
  // Calculate click-through rate as percentage of read notifications that were clicked
  const clickThroughRate = analyticsData.totalRead > 0 
    ? Math.round((analyticsData.totalClicked / analyticsData.totalRead) * 100) 
    : 0;

  // Prepare category data for visualization
  const categories = Object.entries(analyticsData.categoryBreakdown || {})
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
    
  // Prepare type data for visualization
  const types = Object.entries(analyticsData.typeBreakdown || {})
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
  
  // Calculate max value for chart scaling
  const maxCategoryValue = categories.length > 0 
    ? Math.max(...categories.map(c => c.count)) 
    : 10;
    
  const maxTypeValue = types.length > 0 
    ? Math.max(...types.map(t => t.count)) 
    : 10;
  
  return (
    <div className="notification-analytics">
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '1.5rem',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '1rem'
      }}>
        <h2 style={{ margin: 0 }}>Notification Analytics</h2>
        
        <div className="date-range-selector" style={{ display: 'flex', gap: '0.5rem' }}>
          {['day', 'week', 'month'].map(range => (
            <button 
              key={range}
              onClick={() => setDateRange(range as any)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '4px',
                border: '1px solid var(--border-color)',
                background: dateRange === range ? 'var(--button-primary)' : 'var(--background-secondary)',
                color: dateRange === range ? 'white' : 'var(--text-primary)',
                cursor: 'pointer'
              }}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </header>
      
      <div className="analytics-status" style={{ 
        padding: '0.75rem', 
        backgroundColor: 'var(--background-secondary)', 
        borderRadius: '4px', 
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <div style={{ 
          width: '12px', 
          height: '12px', 
          borderRadius: '50%', 
          backgroundColor: connectionStatus === 'connected' ? 'var(--success-color)' : 'var(--error-color)' 
        }}></div>
        <span>
          WebSocket Status: {connectionStatus === 'connected' ? 'Connected' : 'Disconnected'} 
          {connectionStatus !== 'connected' && ' - Some real-time analytics may be delayed'}
        </span>
      </div>
      
      <div className="metrics-overview" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div className="metric-card" style={{ 
          padding: '1.5rem', 
          background: 'var(--background-secondary)', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)' }}>Total Notifications</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>{analyticsData.totalReceived}</p>
        </div>
        
        <div className="metric-card" style={{ 
          padding: '1.5rem', 
          background: 'var(--background-secondary)', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)' }}>Read Rate</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>{engagementRate}%</p>
        </div>
        
        <div className="metric-card" style={{ 
          padding: '1.5rem', 
          background: 'var(--background-secondary)', 
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)' }}>Click-Through Rate</h3>
          <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>{clickThroughRate}%</p>
        </div>
      </div>
      
      <div className="charts-container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div className="chart-section">
          <h3>Notifications by Category</h3>
          
          {categories.length === 0 ? (
            <p>No category data available</p>
          ) : (
            <div className="horizontal-bar-chart">
              {categories.map(category => (
                <div key={category.name} style={{ marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span>{category.name}</span>
                    <span>{category.count}</span>
                  </div>
                  <div style={{ 
                    width: '100%', 
                    backgroundColor: 'var(--background-secondary)', 
                    height: '12px', 
                    borderRadius: '6px',
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      height: '100%', 
                      width: `${Math.min(100, (category.count / maxCategoryValue) * 100)}%`,
                      backgroundColor: 'var(--primary-color)'
                    }}></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="chart-section">
          <h3>Notifications by Type</h3>
          
          {types.length === 0 ? (
            <p>No type data available</p>
          ) : (
            <div className="horizontal-bar-chart">
              {types.map(type => (
                <div key={type.name} style={{ marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span>{type.name}</span>
                    <span>{type.count}</span>
                  </div>
                  <div style={{ 
                    width: '100%', 
                    backgroundColor: 'var(--background-secondary)', 
                    height: '12px', 
                    borderRadius: '6px',
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      height: '100%', 
                      width: `${Math.min(100, (type.count / maxTypeValue) * 100)}%`,
                      backgroundColor: getTypeColor(type.name)
                    }}></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="analytics-tips" style={{ marginTop: '2rem', padding: '1rem', backgroundColor: 'var(--background-secondary)', borderRadius: '8px' }}>
        <h3>Engagement Insights</h3>
        <ul>
          {engagementRate < 30 && (
            <li>Notification read rate is low. Consider making notification content more compelling or relevant.</li>
          )}
          {clickThroughRate < 20 && (
            <li>Click-through rate is low. Try adding clear calls-to-action in your notifications.</li>
          )}
          {analyticsData.totalReceived > 50 && (
            <li>You have sent many notifications. Consider reducing frequency to prevent notification fatigue.</li>
          )}
          {categories.length > 0 && categories[0].count > categories[categories.length - 1].count * 3 && (
            <li>There's a high disparity between category usage. Consider balancing notification categories.</li>
          )}
        </ul>
      </div>
      
      <div className="export-section" style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={() => {
            const dataStr = JSON.stringify(analyticsData, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
            const exportFileDefaultName = `notification-analytics-${new Date().toISOString().split('T')[0]}.json`;
            
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
          }}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'var(--button-primary)',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Export Analytics Data
        </button>
      </div>
    </div>
  );
};

// Helper function to get color based on notification type
const getTypeColor = (type: string): string => {
  switch (type) {
    case 'success': return 'var(--success-color)';
    case 'error': return 'var(--error-color)';
    case 'warning': return 'var(--warning-color)';
    case 'info': return 'var(--info-color)';
    default: return 'var(--primary-color)';
  }
};
