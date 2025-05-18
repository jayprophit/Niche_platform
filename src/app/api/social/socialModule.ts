// Fetch posts with pagination, filtering, and search
async getPosts({ page = 1, pageSize = 10, search = '', filter = {} }) {
  const database = this.services.database;
  const query: any = { ...filter };
  if (search) {
    query.content = { $regex: search, $options: 'i' }; // MongoDB-style search
  }
  const skip = (page - 1) * pageSize;
  const posts = await database.find('socialPosts', query, { skip, limit: pageSize, sort: { createdAt: -1 } });
  const total = await database.count('socialPosts', query);
  return { posts, total, page, pageSize };
}
