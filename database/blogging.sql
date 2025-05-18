-- Blogging Schema
CREATE TABLE IF NOT EXISTS blog_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  slug TEXT NOT NULL UNIQUE,
  parent_id INTEGER,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES blog_categories(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS blog_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  author_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  status TEXT DEFAULT 'draft', -- 'draft', 'published', 'archived'
  visibility TEXT DEFAULT 'public', -- 'public', 'private', 'members'
  slug TEXT NOT NULL UNIQUE,
  reading_time INTEGER, -- in minutes
  view_count INTEGER DEFAULT 0,
  allow_comments BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS blog_post_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES blog_categories(id) ON DELETE CASCADE,
  UNIQUE(post_id, category_id)
);

CREATE TABLE IF NOT EXISTS blog_tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blog_post_tags (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES blog_tags(id) ON DELETE CASCADE,
  UNIQUE(post_id, tag_id)
);

CREATE TABLE IF NOT EXISTS blog_comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  parent_comment_id INTEGER, -- For nested comments
  content TEXT NOT NULL,
  status TEXT DEFAULT 'approved', -- 'pending', 'approved', 'spam', 'trash'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_comment_id) REFERENCES blog_comments(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS blog_reactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  reaction_type TEXT NOT NULL, -- 'like', 'love', 'clap', 'insightful', 'curious'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(post_id, user_id, reaction_type)
);

CREATE TABLE IF NOT EXISTS blog_bookmarks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(post_id, user_id)
);

CREATE TABLE IF NOT EXISTS blog_series (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  author_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  cover_image TEXT,
  slug TEXT NOT NULL UNIQUE,
  status TEXT DEFAULT 'active', -- 'active', 'completed', 'archived'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS blog_series_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  series_id INTEGER NOT NULL,
  post_id INTEGER NOT NULL,
  order_index INTEGER NOT NULL,
  FOREIGN KEY (series_id) REFERENCES blog_series(id) ON DELETE CASCADE,
  FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE,
  UNIQUE(series_id, post_id)
);

-- For Medium-like features
CREATE TABLE IF NOT EXISTS blog_followers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  author_id INTEGER NOT NULL,
  follower_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(author_id, follower_id)
);

CREATE TABLE IF NOT EXISTS blog_publications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  cover_image TEXT,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blog_publication_editors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  publication_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  role TEXT NOT NULL, -- 'owner', 'editor', 'writer'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (publication_id) REFERENCES blog_publications(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(publication_id, user_id)
);

CREATE TABLE IF NOT EXISTS blog_publication_posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  publication_id INTEGER NOT NULL,
  post_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (publication_id) REFERENCES blog_publications(id) ON DELETE CASCADE,
  FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE,
  UNIQUE(publication_id, post_id)
);
