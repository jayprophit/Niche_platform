import { SocialModule } from '../../../src/components/social/socialModule';

describe('SocialModule', () => {
  let socialModule: SocialModule;
  let mockServices: any;

  beforeEach(() => {
    mockServices = {
      database: {
        insertOne: jest.fn(),
        findOne: jest.fn(),
        find: jest.fn(),
        count: jest.fn()
      },
      notificationService: { send: jest.fn() },
      aiModerationService: { checkContent: jest.fn(), flagContent: jest.fn() },
      ecommerceModule: { logPurchaseActivity: jest.fn() },
      elearningModule: { logCourseCompletion: jest.fn() }
    };
    socialModule = new SocialModule();
    socialModule.services = mockServices;
  });

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
});
