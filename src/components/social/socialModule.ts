import { EcommerceModule } from '../../ecommerce/ecommerceModule';
import { ElearningModule } from '../../elearning/elearningModule';
// ...other imports as needed...
import { emitSocialEvent } from '../../server/realtime';

export class SocialModule {
  services: any;

  // Fetch posts with pagination, filtering, and search
  async getPosts({ page = 1, pageSize = 10, search = '', filter = {} }: any) {
    const database = this.services.database;
    const query: any = { ...filter };
  
    if (search) {
      query.content = { $regex: search, $options: 'i' }; // MongoDB-style search
    }
  
    const skip = (page - 1) * pageSize;
    const posts = await database.find('socialPosts', query, { 
      skip, 
      limit: pageSize, 
      sort: { createdAt: -1 } 
    });
  
    const total = await database.count('socialPosts', query);
  
    return { 
      posts, 
      total, 
      page, 
      pageSize,
      hasMore: total > page * pageSize
    };
  }

  private async deleteUserSocialData(userId: string): Promise<void> {
    const database = this.services.database;

    // Delete user's posts
    await database.deleteMany('socialPosts', { authorId: userId });

    // Delete user's profile
    await database.deleteOne('socialProfiles', { userId });

    // Remove user from groups
    await database.deleteMany('socialGroupMembers', { userId });

    // Remove user from event attendees
    await database.deleteMany('socialEventAttendees', { userId });

    // Delete user's messages
    await database.deleteMany('socialMessages', { senderId: userId });
  }

  // Example: Get users the current user follows
  async getFollowing(userId: string): Promise<{ followedId: string }[]> {
    const database = this.services.database;
    return database.find('socialFollows', { followerId: userId });
  }

  // AI content filtering (integrated with AI moderation service)
  private async filterContent(content: string): Promise<boolean> {
    // Example: integrate with external AI moderation service
    // return await this.services.aiModerationService.checkContent(content);
    // For now, allow all content
    return true;
  }

  // Messaging helpers
  private async saveMessage(message: any, sender: any, recipient: any) {
    const database = this.services.database;
    await database.insertOne('socialMessages', {
      ...message,
      senderId: sender.id,
      recipientId: recipient.id,
      createdAt: new Date(),
    });
  }

  private async saveGroupMessage(message: any, sender: any, groupId: string) {
    const database = this.services.database;
    await database.insertOne('socialGroupMessages', {
      ...message,
      senderId: sender.id,
      groupId,
      createdAt: new Date(),
    });
  }

  private async sendMessageNotification(message: any, sender: any, recipient: any) {
    // Integrate with notification system
    if (this.services.notificationService) {
      await this.services.notificationService.send({
        type: 'message',
        senderId: sender.id,
        recipientId: recipient.id,
        message,
      });
    }
  }

  private async sendGroupMessageNotification(message: any, sender: any, member: any, groupId: string) {
    // Integrate with notification system
    if (this.services.notificationService) {
      await this.services.notificationService.send({
        type: 'groupMessage',
        senderId: sender.id,
        recipientId: member.id,
        groupId,
        message,
      });
    }
  }

  private async getGroupMembers(groupId: string): Promise<any[]> {
    const database = this.services.database;
    return database.find('socialGroupMembers', { groupId });
  }

  // Activity logging
  private async createPurchaseActivity(data: any) {
    // Connect with e-commerce module
    // Log purchase activity to social feed
    // Example: await this.services.ecommerceModule?.logPurchaseActivity(data);
    // TODO: Implement actual activity logging
  }

  private async createCourseCompletionActivity(data: any) {
    // Connect with e-learning module
    // Log course completion to social feed
    // Example: await this.services.elearningModule?.logCourseCompletion(data);
    // TODO: Implement actual activity logging
  }

  // --- New Social Features ---

  // Reactions (like, love, etc.)
  async addReaction(postId: string, userId: string, reactionType: string): Promise<void> {
    // Store the reaction
    await this.services.database.insertOne('socialReactions', {
      postId,
      userId,
      reactionType,
      timestamp: new Date()
    });

    // Get original post author for notification
    const post = await this.services.database.findOne('socialPosts', { id: postId });
    if (post && this.services.notificationService) {
      // Check if user wants to receive reaction notifications
      const shouldNotify = await this.services.notificationService.checkUserPreferences?.(post.authorId, 'reactions') ?? true;
      
      if (shouldNotify) {
        await this.services.notificationService.send({
          type: 'reaction',
          senderId: userId,
          recipientId: post.authorId,
          postId,
          reactionType
        });
      }
    }
    
    // Log the activity
    if (this.services.activityLogger) {
      await this.services.activityLogger.log('reaction', { postId, userId, reactionType });
    }
    
    // Emit real-time update
    emitSocialEvent('reactionUpdate', { postId, userId, reactionType });
    emitSocialEvent('feedUpdate');
  }

  // Sharing
  async sharePost(postId: string, userId: string, target: 'feed' | 'group', groupId?: string) {
    const database = this.services.database;
    const post = await database.findOne('socialPosts', { id: postId });
    if (!post) throw new Error('Post not found');
    // Create a new post entry as a share
    const sharedPost = {
      ...post,
      id: this.generateId(),
      sharedBy: userId,
      sharedAt: new Date(),
      originalPostId: postId,
      target,
      groupId: target === 'group' ? groupId : undefined,
    };
    await database.insertOne('socialPosts', sharedPost);
    // Notify original author
    if (post.authorId !== userId) {
      await this.services.notificationService?.send({
        type: 'share',
        senderId: userId,
        recipientId: post.authorId,
        postId,
      });
    }
  }

  // Reporting
  async reportContent(contentId: string, userId: string, reason: string) {
    const database = this.services.database;
    await database.insertOne('socialReports', {
      contentId,
      userId,
      reason,
      createdAt: new Date(),
      status: 'pending',
    });
    // Notify moderators (stub)
    await this.services.notificationService?.send({
      type: 'report',
      senderId: userId,
      contentId,
      reason,
      recipientRole: 'moderator',
    });
    // Optionally trigger AI moderation
    // await this.services.aiModerationService?.flagContent(contentId, reason);
  }


  // Utility for generating unique IDs (replace with a robust solution in production)
  private generateId(): string {
    return Math.random().toString(36).substr(2, 12);
  }
}

it('should paginate posts', async () => {
  mockServices.database.find.mockResolvedValue([/* ...posts */]);
  mockServices.database.count.mockResolvedValue(25);
  const result = await socialModule.getPosts({ page: 2, pageSize: 10 });
  expect(result.posts.length).toBeLessThanOrEqual(10);
  expect(result.page).toBe(2);
});
it('should search posts', async () => {
  mockServices.database.find.mockResolvedValue([/* ...filtered posts */]);
  const result = await socialModule.getPosts({ search: 'hello' });
  expect(mockServices.database.find).toHaveBeenCalledWith(
    'socialPosts',
    expect.objectContaining({ content: expect.any(Object) }),
    expect.any(Object)
  );
});
