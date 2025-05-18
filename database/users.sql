-- Users Schema
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  bio TEXT,
  profile_image TEXT,
  cover_image TEXT,
  location TEXT,
  website TEXT,
  phone TEXT,
  date_of_birth TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  role TEXT DEFAULT 'user' -- 'user', 'admin', 'moderator', etc.
);

-- User Authentication
CREATE TABLE IF NOT EXISTS auth_tokens (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  token TEXT NOT NULL UNIQUE,
  token_type TEXT NOT NULL, -- 'access', 'refresh', 'reset', etc.
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- User Connections (Friends/Followers)
CREATE TABLE IF NOT EXISTS user_connections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  connected_user_id INTEGER NOT NULL,
  connection_type TEXT NOT NULL, -- 'friend', 'follow', 'block', etc.
  status TEXT NOT NULL, -- 'pending', 'accepted', 'rejected', etc.
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (connected_user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, connected_user_id, connection_type)
);

-- User Preferences
CREATE TABLE IF NOT EXISTS user_preferences (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL UNIQUE,
  notification_settings TEXT, -- JSON string of notification preferences
  privacy_settings TEXT, -- JSON string of privacy preferences
  theme_preference TEXT DEFAULT 'light',
  language_preference TEXT DEFAULT 'en',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- User Activity Log
CREATE TABLE IF NOT EXISTS user_activity (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  activity_type TEXT NOT NULL, -- 'login', 'post', 'purchase', 'course_completion', etc.
  activity_data TEXT, -- JSON string with activity details
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
