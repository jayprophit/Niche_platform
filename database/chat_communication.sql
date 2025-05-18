-- Chat and Communication Schema
CREATE TABLE IF NOT EXISTS chat_rooms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL, -- 'public', 'private', 'direct', 'group'
  creator_id INTEGER NOT NULL,
  icon_url TEXT,
  banner_url TEXT,
  is_age_restricted BOOLEAN DEFAULT FALSE, -- For 13+ restriction
  min_age INTEGER DEFAULT 13, -- Minimum age requirement
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS chat_room_members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  room_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  role TEXT DEFAULT 'member', -- 'owner', 'admin', 'moderator', 'member'
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_read_at TIMESTAMP,
  is_muted BOOLEAN DEFAULT FALSE,
  muted_until TIMESTAMP,
  FOREIGN KEY (room_id) REFERENCES chat_rooms(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(room_id, user_id)
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  room_id INTEGER NOT NULL,
  sender_id INTEGER NOT NULL,
  content TEXT,
  media_urls TEXT, -- JSON array of media URLs
  is_pinned BOOLEAN DEFAULT FALSE,
  is_edited BOOLEAN DEFAULT FALSE,
  edited_at TIMESTAMP,
  reply_to_id INTEGER, -- For threaded replies
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (room_id) REFERENCES chat_rooms(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (reply_to_id) REFERENCES chat_messages(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS chat_message_reactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  message_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  reaction_type TEXT NOT NULL, -- 'like', 'love', 'haha', 'wow', 'sad', 'angry'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (message_id) REFERENCES chat_messages(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(message_id, user_id, reaction_type)
);

CREATE TABLE IF NOT EXISTS chat_read_status (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  room_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  last_read_message_id INTEGER,
  last_read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (room_id) REFERENCES chat_rooms(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (last_read_message_id) REFERENCES chat_messages(id) ON DELETE SET NULL,
  UNIQUE(room_id, user_id)
);

-- Voice and Video Calls
CREATE TABLE IF NOT EXISTS call_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  initiator_id INTEGER NOT NULL,
  room_id INTEGER, -- Optional, if call is associated with a chat room
  type TEXT NOT NULL, -- 'audio', 'video'
  status TEXT NOT NULL, -- 'initiated', 'ongoing', 'ended', 'missed', 'rejected'
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ended_at TIMESTAMP,
  duration INTEGER, -- in seconds
  FOREIGN KEY (initiator_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (room_id) REFERENCES chat_rooms(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS call_participants (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  call_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  joined_at TIMESTAMP,
  left_at TIMESTAMP,
  status TEXT NOT NULL, -- 'invited', 'joined', 'left', 'declined'
  FOREIGN KEY (call_id) REFERENCES call_sessions(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(call_id, user_id)
);

-- Chatbot and Q&A
CREATE TABLE IF NOT EXISTS chatbot_conversations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS chatbot_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  conversation_id INTEGER NOT NULL,
  sender_type TEXT NOT NULL, -- 'user', 'bot'
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversation_id) REFERENCES chatbot_conversations(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS qa_questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT, -- JSON array of tags
  status TEXT DEFAULT 'open', -- 'open', 'answered', 'closed'
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS qa_answers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  is_accepted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (question_id) REFERENCES qa_questions(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS qa_votes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entity_type TEXT NOT NULL, -- 'question', 'answer'
  entity_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  vote_type TEXT NOT NULL, -- 'up', 'down'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(entity_type, entity_id, user_id)
);
