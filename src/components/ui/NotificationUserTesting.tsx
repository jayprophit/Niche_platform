import React, { useState, useEffect } from 'react';
import { useNotifications } from './NotificationContextProvider';
import { NotificationSoundType, getAllSounds, previewSound } from './NotificationSounds';

/**
 * NotificationUserTesting component for collecting user feedback on notifications
 * This helps validate the UX of the notification system
 */
export interface TestFeedback {
  effectiveness: number; // 1-5 scale
  audioQuality: number; // 1-5 scale
  visualAppeal: number; // 1-5 scale
  usefulness: number; // 1-5 scale
  comments: string;
}

interface NotificationTestProps {
  onComplete: (feedback: TestFeedback) => void;
  initialFeedback?: Partial<TestFeedback>;
}

export const NotificationUserTesting: React.FC<NotificationTestProps> = ({ 
  onComplete,
  initialFeedback = {}
}) => {
  const { addNotification, browserNotificationsEnabled, toggleBrowserNotifications } = useNotifications();
  const [step, setStep] = useState<number>(1);
  const [feedback, setFeedback] = useState<TestFeedback>({
    effectiveness: initialFeedback.effectiveness || 3,
    audioQuality: initialFeedback.audioQuality || 3,
    visualAppeal: initialFeedback.visualAppeal || 3,
    usefulness: initialFeedback.usefulness || 3,
    comments: initialFeedback.comments || ''
  });

  // All available notification sounds
  const allSounds = getAllSounds();
  
  // Types of notifications to test
  const notificationTypes: NotificationSoundType[] = ['default', 'success', 'error', 'warning', 'message'];
  
  // Run through notification test sequence
  const runNotificationTest = (type: NotificationSoundType) => {
    const sound = allSounds[type];
    
    // Show toast notification
    addNotification(
      `This is a test ${type} notification: ${sound.description}`,
      type,
      'Test'
    );
    
    // Play the sound
    previewSound(type);
  };
  
  // Request browser notification permission if needed
  const setupBrowserNotifications = async () => {
    if (!browserNotificationsEnabled) {
      await toggleBrowserNotifications(true);
    }
  };
  
  // Run all notification tests in sequence
  const runAllTests = () => {
    setupBrowserNotifications();
    
    notificationTypes.forEach((type, index) => {
      setTimeout(() => {
        runNotificationTest(type);
      }, index * 2000); // Run each test 2 seconds apart
    });
  };
  
  // Update feedback state
  const updateFeedback = (field: keyof TestFeedback, value: any) => {
    setFeedback(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Submit feedback
  const submitFeedback = () => {
    onComplete(feedback);
  };
  
  return (
    <div className="notification-user-testing">
      <h2>Notification System User Testing</h2>
      
      {step === 1 && (
        <div className="testing-step">
          <p>We'd like your help testing our notification system. This will run through different notification types and collect your feedback.</p>
          <p>Please make sure your sound is on and browser notifications are enabled for the best experience.</p>
          
          <div className="permission-section" style={{ margin: '20px 0', padding: '15px', backgroundColor: 'var(--background-secondary)', borderRadius: '8px' }}>
            <h3>Notification Permissions</h3>
            <p>Browser notifications: {browserNotificationsEnabled ? 'Enabled ✅' : 'Disabled ❌'}</p>
            {!browserNotificationsEnabled && (
              <button 
                onClick={setupBrowserNotifications}
                style={{
                  padding: '8px 16px',
                  background: 'var(--button-primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Enable Browser Notifications
              </button>
            )}
          </div>
          
          <button
            onClick={() => {
              runAllTests();
              setStep(2);
            }}
            style={{
              padding: '10px 20px',
              background: 'var(--button-primary)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Start Notification Tests
          </button>
        </div>
      )}
      
      {step === 2 && (
        <div className="feedback-form">
          <p>Please rate your experience with the notification system:</p>
          
          <div className="feedback-question" style={{ margin: '20px 0' }}>
            <label>How effective were the notifications at getting your attention?</label>
            <div className="rating-scale" style={{ display: 'flex', gap: '10px', margin: '10px 0' }}>
              {[1, 2, 3, 4, 5].map(rating => (
                <button
                  key={rating}
                  onClick={() => updateFeedback('effectiveness', rating)}
                  style={{
                    padding: '8px 16px',
                    background: feedback.effectiveness === rating ? 'var(--button-primary)' : 'var(--background-secondary)',
                    color: feedback.effectiveness === rating ? 'white' : 'var(--text-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  {rating}
                </button>
              ))}
              <span style={{ marginLeft: '10px' }}>({feedback.effectiveness === 1 ? 'Poor' : feedback.effectiveness === 5 ? 'Excellent' : ''})</span>
            </div>
          </div>
          
          <div className="feedback-question" style={{ margin: '20px 0' }}>
            <label>How would you rate the quality of the notification sounds?</label>
            <div className="rating-scale" style={{ display: 'flex', gap: '10px', margin: '10px 0' }}>
              {[1, 2, 3, 4, 5].map(rating => (
                <button
                  key={rating}
                  onClick={() => updateFeedback('audioQuality', rating)}
                  style={{
                    padding: '8px 16px',
                    background: feedback.audioQuality === rating ? 'var(--button-primary)' : 'var(--background-secondary)',
                    color: feedback.audioQuality === rating ? 'white' : 'var(--text-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  {rating}
                </button>
              ))}
              <span style={{ marginLeft: '10px' }}>({feedback.audioQuality === 1 ? 'Poor' : feedback.audioQuality === 5 ? 'Excellent' : ''})</span>
            </div>
          </div>
          
          <div className="feedback-question" style={{ margin: '20px 0' }}>
            <label>How visually appealing were the notifications?</label>
            <div className="rating-scale" style={{ display: 'flex', gap: '10px', margin: '10px 0' }}>
              {[1, 2, 3, 4, 5].map(rating => (
                <button
                  key={rating}
                  onClick={() => updateFeedback('visualAppeal', rating)}
                  style={{
                    padding: '8px 16px',
                    background: feedback.visualAppeal === rating ? 'var(--button-primary)' : 'var(--background-secondary)',
                    color: feedback.visualAppeal === rating ? 'white' : 'var(--text-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  {rating}
                </button>
              ))}
              <span style={{ marginLeft: '10px' }}>({feedback.visualAppeal === 1 ? 'Poor' : feedback.visualAppeal === 5 ? 'Excellent' : ''})</span>
            </div>
          </div>
          
          <div className="feedback-question" style={{ margin: '20px 0' }}>
            <label>How useful do you find these notifications for your daily usage?</label>
            <div className="rating-scale" style={{ display: 'flex', gap: '10px', margin: '10px 0' }}>
              {[1, 2, 3, 4, 5].map(rating => (
                <button
                  key={rating}
                  onClick={() => updateFeedback('usefulness', rating)}
                  style={{
                    padding: '8px 16px',
                    background: feedback.usefulness === rating ? 'var(--button-primary)' : 'var(--background-secondary)',
                    color: feedback.usefulness === rating ? 'white' : 'var(--text-primary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  {rating}
                </button>
              ))}
              <span style={{ marginLeft: '10px' }}>({feedback.usefulness === 1 ? 'Not useful' : feedback.usefulness === 5 ? 'Very useful' : ''})</span>
            </div>
          </div>
          
          <div className="feedback-question" style={{ margin: '20px 0' }}>
            <label htmlFor="comments">Additional comments or suggestions:</label>
            <textarea
              id="comments"
              value={feedback.comments}
              onChange={(e) => updateFeedback('comments', e.target.value)}
              rows={4}
              style={{
                width: '100%',
                padding: '10px',
                margin: '10px 0',
                borderRadius: '4px',
                border: '1px solid var(--border-color)',
                background: 'var(--background-secondary)',
                color: 'var(--text-primary)'
              }}
            />
          </div>
          
          <div className="actions" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button
              onClick={() => {
                runAllTests();
              }}
              style={{
                padding: '10px 20px',
                background: 'var(--background-secondary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Run Tests Again
            </button>
            
            <button
              onClick={submitFeedback}
              style={{
                padding: '10px 20px',
                background: 'var(--success-color)',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Submit Feedback
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
