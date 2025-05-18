/**
 * Service for collecting and submitting notification system user feedback
 */

import { TestFeedback } from '../../components/ui/NotificationUserTesting';

// API endpoint for submitting feedback
const FEEDBACK_API_URL = `${process.env.NEXT_PUBLIC_API_URL || 'https://api.nicheplatform.example'}/feedback/notifications`;

/**
 * Submit notification system user feedback to the server
 */
export const submitNotificationFeedback = async (feedback: TestFeedback): Promise<{ success: boolean; message: string }> => {
  try {
    // Add metadata to the feedback
    const enhancedFeedback = {
      ...feedback,
      timestamp: new Date().toISOString(),
      userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
      screenSize: typeof window !== 'undefined' ? {
        width: window.innerWidth,
        height: window.innerHeight
      } : { width: 0, height: 0 }
    };
    
    // In development mode, just log the feedback
    if (process.env.NODE_ENV === 'development') {
      console.log('[DEV MODE] Notification feedback:', enhancedFeedback);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return {
        success: true,
        message: 'Feedback collected successfully (development mode)'
      };
    }
    
    // Submit to the API
    const response = await fetch(FEEDBACK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(enhancedFeedback)
    });
    
    // Handle API response
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    return {
      success: true,
      message: data.message || 'Feedback submitted successfully'
    };
  } catch (error) {
    console.error('Error submitting notification feedback:', error);
    
    // Store feedback locally if API submission fails
    storeLocalFeedback(feedback);
    
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to submit feedback'
    };
  }
};

/**
 * Fallback: Store feedback locally if API submission fails
 */
const storeLocalFeedback = (feedback: TestFeedback): void => {
  try {
    // Get existing stored feedback
    const storedFeedbackString = localStorage.getItem('notification_feedback');
    const storedFeedback = storedFeedbackString ? JSON.parse(storedFeedbackString) : [];
    
    // Add new feedback with timestamp
    storedFeedback.push({
      ...feedback,
      timestamp: new Date().toISOString()
    });
    
    // Store updated feedback list
    localStorage.setItem('notification_feedback', JSON.stringify(storedFeedback));
    
    console.log('Feedback stored locally for later submission');
  } catch (error) {
    console.error('Failed to store feedback locally:', error);
  }
};

/**
 * Check if there's any locally stored feedback that needs to be submitted
 * Call this on app startup to sync any pending feedback
 */
export const syncPendingFeedback = async (): Promise<void> => {
  try {
    if (typeof window === 'undefined') return;
    
    const storedFeedbackString = localStorage.getItem('notification_feedback');
    if (!storedFeedbackString) return;
    
    const storedFeedback = JSON.parse(storedFeedbackString);
    if (!Array.isArray(storedFeedback) || storedFeedback.length === 0) return;
    
    console.log(`Found ${storedFeedback.length} pending feedback submissions. Attempting to sync...`);
    
    // Submit each feedback item
    const results = await Promise.allSettled(
      storedFeedback.map(feedback => submitNotificationFeedback(feedback))
    );
    
    // Count successes
    const successCount = results.filter(result => 
      result.status === 'fulfilled' && result.value.success
    ).length;
    
    console.log(`Successfully synced ${successCount} of ${storedFeedback.length} feedback items`);
    
    // Clear successfully submitted feedback
    if (successCount > 0) {
      const remainingFeedback = storedFeedback.filter((_, index) => {
        const result = results[index];
        return !(result.status === 'fulfilled' && result.value.success);
      });
      
      localStorage.setItem('notification_feedback', JSON.stringify(remainingFeedback));
    }
  } catch (error) {
    console.error('Error syncing pending feedback:', error);
  }
};