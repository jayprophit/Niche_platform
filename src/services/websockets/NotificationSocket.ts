/**
 * WebSocket service for real-time notifications
 */

import { Notification } from '../../components/ui/NotificationCenter';

// WebSocket event types
export type NotificationSocketEvent = 
  | { type: 'NOTIFICATION'; payload: Omit<Notification, 'id' | 'timestamp'> }
  | { type: 'READ_RECEIPT'; payload: { id: string } }
  | { type: 'CONNECTION_STATE'; payload: { state: 'connected' | 'disconnected' } };

// Callback type for socket event handlers
type NotificationCallback = (event: NotificationSocketEvent) => void;

// Configuration options
interface NotificationSocketOptions {
  reconnectAttempts?: number;
  reconnectDelay?: number;
  debug?: boolean;
}

export class NotificationSocket {
  private socket: WebSocket | null = null;
  private socketUrl: string;
  private callbacks: NotificationCallback[] = [];
  private reconnectAttempts: number;
  private reconnectDelay: number;
  private reconnectCount = 0;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private debug: boolean;

  constructor(
    socketUrl: string,
    options: NotificationSocketOptions = {}
  ) {
    this.socketUrl = socketUrl;
    
    // Use environment variables if available, otherwise use defaults or provided options
    this.reconnectAttempts = options.reconnectAttempts || 
      (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_WS_RECONNECT_ATTEMPTS ? 
        parseInt(process.env.NEXT_PUBLIC_WS_RECONNECT_ATTEMPTS) : 5);
    
    this.reconnectDelay = options.reconnectDelay || 
      (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_WS_RECONNECT_DELAY ? 
        parseInt(process.env.NEXT_PUBLIC_WS_RECONNECT_DELAY) : 3000);
    
    this.debug = options.debug || process.env.NODE_ENV === 'development';
    
    if (this.debug) {
      console.log(`[NotificationSocket] Initialized with URL: ${this.socketUrl}`);
      console.log(`[NotificationSocket] Reconnect attempts: ${this.reconnectAttempts}`);
      console.log(`[NotificationSocket] Reconnect delay: ${this.reconnectDelay}ms`);
    }
  }

  // Connect to the notification WebSocket
  public connect(): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.log('WebSocket already connected');
      return;
    }

    this.log(`Connecting to WebSocket at ${this.socketUrl}`);
    
    try {
      this.socket = new WebSocket(this.socketUrl);
      
      this.socket.onopen = () => {
        this.log('WebSocket connection established');
        this.reconnectCount = 0;
        this.notifyListeners({ 
          type: 'CONNECTION_STATE', 
          payload: { state: 'connected' } 
        });
      };

      this.socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleMessage(data);
        } catch (error) {
          this.log('Error parsing WebSocket message:', error);
        }
      };

      this.socket.onerror = (error) => {
        this.log('WebSocket error:', error);
      };

      this.socket.onclose = () => {
        this.log('WebSocket connection closed');
        this.notifyListeners({ 
          type: 'CONNECTION_STATE', 
          payload: { state: 'disconnected' } 
        });
        this.attemptReconnect();
      };
    } catch (error) {
      this.log('Error creating WebSocket connection:', error);
      this.attemptReconnect();
    }
  }

  // Reconnect to WebSocket after connection lost
  private attemptReconnect(): void {
    if (this.reconnectCount >= this.reconnectAttempts) {
      this.log('Max reconnect attempts reached');
      return;
    }

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    this.reconnectCount++;
    const delay = this.reconnectDelay * this.reconnectCount;
    
    this.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectCount})`);
    
    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }

  // Process incoming WebSocket messages
  private handleMessage(data: any): void {
    // Handle notification messages
    if (data.type === 'NOTIFICATION') {
      const notification: Omit<Notification, 'id' | 'timestamp'> = {
        message: data.message,
        type: data.notificationType || 'info',
        read: false,
        category: data.category,
      };
      
      this.notifyListeners({
        type: 'NOTIFICATION',
        payload: notification
      });
    }
    // Handle other message types...
  }

  // Add event listener for notification events
  public subscribe(callback: NotificationCallback): () => void {
    this.callbacks.push(callback);
    return () => {
      this.callbacks = this.callbacks.filter(cb => cb !== callback);
    };
  }

  // Send read receipt to the server
  public sendReadReceipt(notificationId: string): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ 
        type: 'READ_RECEIPT', 
        id: notificationId 
      }));
    }
  }

  // Send message to the server
  public send(message: any): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      this.log('Cannot send message, WebSocket not connected');
    }
  }

  // Disconnect from the WebSocket
  public disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  // Send notification events to all listeners
  private notifyListeners(event: NotificationSocketEvent): void {
    this.callbacks.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        this.log('Error in notification callback:', error);
      }
    });
  }

  // Debug logging
  private log(...args: any[]): void {
    if (this.debug) {
      console.log('[NotificationSocket]', ...args);
    }
  }
}
