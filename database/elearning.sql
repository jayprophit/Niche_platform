-- E-learning Schema
CREATE TABLE IF NOT EXISTS course_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  parent_id INTEGER,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES course_categories(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  instructor_id INTEGER NOT NULL,
  category_id INTEGER,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  price REAL NOT NULL,
  sale_price REAL,
  currency TEXT DEFAULT 'USD',
  level TEXT, -- 'beginner', 'intermediate', 'advanced'
  language TEXT DEFAULT 'en',
  thumbnail_url TEXT,
  preview_video_url TEXT,
  duration INTEGER, -- in minutes
  requirements TEXT,
  what_you_learn TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (category_id) REFERENCES course_categories(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS course_sections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS course_lessons (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  section_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content_type TEXT NOT NULL, -- 'video', 'text', 'quiz', 'assignment'
  content_url TEXT,
  content_text TEXT,
  duration INTEGER, -- in minutes
  is_free_preview BOOLEAN DEFAULT FALSE,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (section_id) REFERENCES course_sections(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS course_enrollments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expiry_date TIMESTAMP,
  progress_percentage REAL DEFAULT 0,
  is_completed BOOLEAN DEFAULT FALSE,
  completion_date TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(course_id, user_id)
);

CREATE TABLE IF NOT EXISTS lesson_progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lesson_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  progress_percentage REAL DEFAULT 0,
  last_position INTEGER DEFAULT 0, -- For videos, position in seconds
  completion_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lesson_id) REFERENCES course_lessons(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(lesson_id, user_id)
);

CREATE TABLE IF NOT EXISTS course_reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  rating INTEGER NOT NULL, -- 1-5
  title TEXT,
  content TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(course_id, user_id)
);

CREATE TABLE IF NOT EXISTS quizzes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lesson_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  time_limit INTEGER, -- in minutes, NULL for no limit
  passing_score INTEGER NOT NULL, -- percentage
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lesson_id) REFERENCES course_lessons(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS quiz_questions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  quiz_id INTEGER NOT NULL,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL, -- 'multiple_choice', 'true_false', 'matching', 'fill_blank', 'essay'
  points INTEGER DEFAULT 1,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS quiz_answers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  question_id INTEGER NOT NULL,
  answer_text TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT FALSE,
  explanation TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (question_id) REFERENCES quiz_questions(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS quiz_attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  quiz_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  score INTEGER,
  passed BOOLEAN,
  start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  end_time TIMESTAMP,
  FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS quiz_responses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  attempt_id INTEGER NOT NULL,
  question_id INTEGER NOT NULL,
  answer_id INTEGER,
  text_response TEXT,
  is_correct BOOLEAN,
  points_awarded INTEGER DEFAULT 0,
  FOREIGN KEY (attempt_id) REFERENCES quiz_attempts(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES quiz_questions(id) ON DELETE CASCADE,
  FOREIGN KEY (answer_id) REFERENCES quiz_answers(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS certificates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  certificate_number TEXT NOT NULL UNIQUE,
  issue_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expiry_date TIMESTAMP,
  pdf_url TEXT,
  is_verified BOOLEAN DEFAULT TRUE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(course_id, user_id)
);

-- For job marketplace integration
CREATE TABLE IF NOT EXISTS user_resumes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL UNIQUE,
  title TEXT,
  summary TEXT,
  skills TEXT, -- JSON array of skills
  experience TEXT, -- JSON array of work experience
  education TEXT, -- JSON array of education
  certificates TEXT, -- JSON array of certificate IDs
  languages TEXT, -- JSON array of languages
  is_public BOOLEAN DEFAULT FALSE,
  opt_out_job_search BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
