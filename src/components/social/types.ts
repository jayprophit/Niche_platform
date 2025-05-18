export interface UserNotificationPreferences {
  // Social Interactions
  reactions: boolean;
  shares: boolean;
  comments: boolean;
  mentions: boolean;
  follows: boolean;
  
  // Content Management
  reports: boolean;
  contentApproved: boolean;
  contentRejected: boolean;
  
  // Messages
  messages: boolean;
  groupMessages: boolean;
  
  // Groups & Events
  groupInvites: boolean;
  groupUpdates: boolean;
  eventReminders: boolean;
  eventRSVP: boolean;
  
  // System & Security
  accountSecurity: boolean;
  platformUpdates: boolean;
}

export interface SocialModuleServices {
  database: any;
  notificationService?: {
    send: (notification: any) => Promise<void>;
    checkUserPreferences: (userId: string, type: string) => Promise<boolean>;
  };
  aiModerationService?: {
    checkContent: (content: string) => Promise<boolean>;
    flagContent: (content: string, reason: string) => Promise<void>;
  };
  activityLogger?: {
    log: (type: string, data: any) => Promise<void>;
  };
  ecommerceModule?: any;
  elearningModule?: any;
}
