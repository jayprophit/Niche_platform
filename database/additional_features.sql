-- External Platform Integration Schema
CREATE TABLE IF NOT EXISTS external_platforms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  platform_type TEXT NOT NULL, -- 'social_media', 'website', 'marketplace', etc.
  icon_url TEXT,
  base_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_external_links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  platform_id INTEGER NOT NULL,
  username TEXT,
  profile_url TEXT NOT NULL,
  display_name TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (platform_id) REFERENCES external_platforms(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS business_external_links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  business_id INTEGER NOT NULL,
  platform_id INTEGER NOT NULL,
  username TEXT,
  profile_url TEXT NOT NULL,
  display_name TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (business_id) REFERENCES business_profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (platform_id) REFERENCES external_platforms(id) ON DELETE CASCADE
);

-- Enhanced Product Features
CREATE TABLE IF NOT EXISTS product_technical_details (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL UNIQUE,
  materials TEXT, -- JSON array of materials used
  manufacturing_process TEXT,
  technical_specifications TEXT, -- JSON object with technical specs
  dimensions TEXT, -- JSON object with dimensions
  weight REAL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS product_files (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL,
  file_type TEXT NOT NULL, -- 'cad', 'circuit', 'audio', 'video', 'image', 'document', 'application'
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER, -- in bytes
  file_format TEXT,
  preview_url TEXT, -- For preview version if applicable
  is_downloadable BOOLEAN DEFAULT FALSE,
  requires_purchase BOOLEAN DEFAULT TRUE,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS product_interactive_media (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL,
  media_type TEXT NOT NULL, -- '3d_model', 'panorama', 'interactive_demo', 'audio_player', 'video_player'
  media_url TEXT NOT NULL,
  thumbnail_url TEXT,
  settings TEXT, -- JSON object with player/viewer settings
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Business and Organization Accounts
CREATE TABLE IF NOT EXISTS business_profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL, -- Owner/admin user
  name TEXT NOT NULL,
  business_type TEXT NOT NULL, -- 'company', 'agency', 'educational', 'government', 'nonprofit'
  description TEXT,
  logo_url TEXT,
  banner_url TEXT,
  website TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  tax_id TEXT,
  registration_number TEXT,
  founding_date TEXT,
  industry TEXT,
  size TEXT, -- 'small', 'medium', 'large', 'enterprise'
  verified BOOLEAN DEFAULT FALSE,
  subscription_tier TEXT DEFAULT 'basic', -- 'basic', 'professional', 'enterprise'
  subscription_status TEXT DEFAULT 'active', -- 'active', 'trial', 'expired', 'cancelled'
  subscription_expiry TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS business_members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  business_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  role TEXT NOT NULL, -- 'owner', 'admin', 'manager', 'member', 'employee'
  title TEXT,
  department TEXT,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  invited_by INTEGER,
  status TEXT DEFAULT 'active', -- 'active', 'pending', 'inactive'
  FOREIGN KEY (business_id) REFERENCES business_profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (invited_by) REFERENCES users(id) ON DELETE SET NULL,
  UNIQUE(business_id, user_id)
);

CREATE TABLE IF NOT EXISTS business_reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  business_id INTEGER NOT NULL,
  reviewer_id INTEGER NOT NULL,
  rating INTEGER NOT NULL, -- 1-5
  title TEXT,
  content TEXT,
  is_verified_interaction BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (business_id) REFERENCES business_profiles(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Job Marketplace
CREATE TABLE IF NOT EXISTS job_listings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  business_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  job_type TEXT NOT NULL, -- 'full_time', 'part_time', 'contract', 'freelance', 'internship'
  location TEXT,
  is_remote BOOLEAN DEFAULT FALSE,
  salary_min REAL,
  salary_max REAL,
  salary_currency TEXT DEFAULT 'USD',
  salary_period TEXT DEFAULT 'yearly', -- 'hourly', 'daily', 'weekly', 'monthly', 'yearly'
  required_skills TEXT, -- JSON array of required skills
  required_experience TEXT,
  required_education TEXT,
  required_certificates TEXT, -- JSON array of required certificates
  application_url TEXT,
  contact_email TEXT,
  status TEXT DEFAULT 'open', -- 'open', 'closed', 'filled', 'draft'
  posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  FOREIGN KEY (business_id) REFERENCES business_profiles(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS job_applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  job_id INTEGER NOT NULL,
  applicant_id INTEGER NOT NULL,
  resume_id INTEGER,
  cover_letter TEXT,
  status TEXT DEFAULT 'submitted', -- 'submitted', 'reviewing', 'interviewed', 'offered', 'accepted', 'rejected'
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (job_id) REFERENCES job_listings(id) ON DELETE CASCADE,
  FOREIGN KEY (applicant_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (resume_id) REFERENCES user_resumes(id) ON DELETE SET NULL,
  UNIQUE(job_id, applicant_id)
);

-- Cross-Platform Settings
CREATE TABLE IF NOT EXISTS platform_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  platform_type TEXT NOT NULL, -- 'web', 'desktop', 'mobile', 'tablet', 'wearable', 'iot'
  settings TEXT NOT NULL, -- JSON object with platform-specific settings
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(platform_type)
);

CREATE TABLE IF NOT EXISTS user_platform_preferences (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  platform_type TEXT NOT NULL, -- 'web', 'desktop', 'mobile', 'tablet', 'wearable', 'iot'
  preferences TEXT NOT NULL, -- JSON object with user's platform-specific preferences
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_id, platform_type)
);

-- Age Verification and Consent
CREATE TABLE IF NOT EXISTS user_age_verification (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL UNIQUE,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_method TEXT, -- 'self_declaration', 'id_document', 'guardian_consent', 'payment_method'
  verification_data TEXT, -- JSON object with verification details
  verified_at TIMESTAMP,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS guardian_consents (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  guardian_name TEXT NOT NULL,
  guardian_email TEXT NOT NULL,
  guardian_phone TEXT,
  relationship TEXT NOT NULL, -- 'parent', 'legal_guardian', 'other'
  consent_type TEXT NOT NULL, -- 'full', 'restricted', 'purchase_only'
  is_verified BOOLEAN DEFAULT FALSE,
  verification_method TEXT,
  consent_given_at TIMESTAMP,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS purchase_approvals (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  guardian_id INTEGER NOT NULL,
  product_id INTEGER,
  course_id INTEGER,
  amount REAL,
  currency TEXT DEFAULT 'USD',
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'expired'
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  responded_at TIMESTAMP,
  expires_at TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (guardian_id) REFERENCES guardian_consents(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL
);
