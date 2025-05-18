-- Gamification Schema
CREATE TABLE IF NOT EXISTS achievement_types (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS achievements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  points INTEGER DEFAULT 0,
  badge_url TEXT,
  requirement_type TEXT NOT NULL, -- 'single_action', 'multiple_actions', 'milestone', 'custom'
  requirement_count INTEGER DEFAULT 1,
  requirement_data TEXT, -- JSON string with specific requirements
  is_hidden BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (type_id) REFERENCES achievement_types(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_achievements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  achievement_id INTEGER NOT NULL,
  progress INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE,
  UNIQUE(user_id, achievement_id)
);

CREATE TABLE IF NOT EXISTS point_types (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_points (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  point_type_id INTEGER NOT NULL,
  balance INTEGER DEFAULT 0,
  lifetime_points INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (point_type_id) REFERENCES point_types(id) ON DELETE CASCADE,
  UNIQUE(user_id, point_type_id)
);

CREATE TABLE IF NOT EXISTS point_transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  point_type_id INTEGER NOT NULL,
  amount INTEGER NOT NULL,
  balance_after INTEGER NOT NULL,
  transaction_type TEXT NOT NULL, -- 'earn', 'spend', 'expire', 'adjust'
  reference_type TEXT, -- 'achievement', 'course_completion', 'purchase', etc.
  reference_id INTEGER, -- ID of the related entity
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (point_type_id) REFERENCES point_types(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS levels (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  points_required INTEGER NOT NULL,
  level_number INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_levels (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  level_id INTEGER NOT NULL,
  achieved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (level_id) REFERENCES levels(id) ON DELETE CASCADE,
  UNIQUE(user_id, level_id)
);

CREATE TABLE IF NOT EXISTS badges (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  requirement_type TEXT NOT NULL, -- 'achievement', 'level', 'points', 'custom'
  requirement_data TEXT, -- JSON string with specific requirements
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_badges (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  badge_id INTEGER NOT NULL,
  awarded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_displayed BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (badge_id) REFERENCES badges(id) ON DELETE CASCADE,
  UNIQUE(user_id, badge_id)
);

CREATE TABLE IF NOT EXISTS leaderboards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL, -- 'points', 'achievements', 'custom'
  point_type_id INTEGER, -- If type is 'points'
  reset_frequency TEXT, -- 'never', 'daily', 'weekly', 'monthly', 'yearly'
  last_reset_at TIMESTAMP,
  next_reset_at TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (point_type_id) REFERENCES point_types(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS leaderboard_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  leaderboard_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  score INTEGER NOT NULL,
  rank INTEGER,
  last_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (leaderboard_id) REFERENCES leaderboards(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(leaderboard_id, user_id)
);

CREATE TABLE IF NOT EXISTS challenges (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  requirement_type TEXT NOT NULL, -- 'points', 'achievements', 'custom'
  requirement_data TEXT, -- JSON string with specific requirements
  reward_type TEXT NOT NULL, -- 'points', 'badge', 'achievement', 'custom'
  reward_data TEXT, -- JSON string with specific rewards
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_challenges (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  challenge_id INTEGER NOT NULL,
  progress INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  reward_claimed BOOLEAN DEFAULT FALSE,
  reward_claimed_at TIMESTAMP,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON DELETE CASCADE,
  UNIQUE(user_id, challenge_id)
);

-- Quests/Missions
CREATE TABLE IF NOT EXISTS quests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  is_repeatable BOOLEAN DEFAULT FALSE,
  cooldown_period INTEGER, -- in hours, for repeatable quests
  is_sequential BOOLEAN DEFAULT TRUE, -- whether steps must be completed in order
  reward_type TEXT NOT NULL, -- 'points', 'badge', 'achievement', 'custom'
  reward_data TEXT, -- JSON string with specific rewards
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS quest_steps (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  quest_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  requirement_type TEXT NOT NULL, -- 'action', 'achievement', 'points', 'custom'
  requirement_data TEXT, -- JSON string with specific requirements
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (quest_id) REFERENCES quests(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS user_quests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  quest_id INTEGER NOT NULL,
  current_step_id INTEGER,
  progress INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  reward_claimed BOOLEAN DEFAULT FALSE,
  reward_claimed_at TIMESTAMP,
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_completed_at TIMESTAMP, -- For repeatable quests
  completion_count INTEGER DEFAULT 0, -- For repeatable quests
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (quest_id) REFERENCES quests(id) ON DELETE CASCADE,
  FOREIGN KEY (current_step_id) REFERENCES quest_steps(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS user_quest_steps (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_quest_id INTEGER NOT NULL,
  step_id INTEGER NOT NULL,
  progress INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  FOREIGN KEY (user_quest_id) REFERENCES user_quests(id) ON DELETE CASCADE,
  FOREIGN KEY (step_id) REFERENCES quest_steps(id) ON DELETE CASCADE,
  UNIQUE(user_quest_id, step_id)
);
