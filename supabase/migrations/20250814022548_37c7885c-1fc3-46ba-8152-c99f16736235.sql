-- Add columns to existing profiles table for job system
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS karma_points INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS rating DECIMAL(3,2) DEFAULT 5.0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  job_type VARCHAR(20) CHECK (job_type IN ('good_deeds', 'kein_bock')),
  budget DECIMAL(10,2),
  karma_reward INTEGER DEFAULT 10,
  category VARCHAR(50),
  location TEXT NOT NULL,
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'canceled')),
  estimated_duration INTEGER, -- in minutes
  due_date DATE,
  images TEXT[],
  requirements TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Applications table
CREATE TABLE IF NOT EXISTS job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  applicant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(job_id, applicant_id) -- Prevent duplicate applications
);

-- Job tickets for tracking work
CREATE TABLE IF NOT EXISTS job_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  applicant_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'disputed')),
  payment_released BOOLEAN DEFAULT FALSE,
  karma_awarded BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ratings system
CREATE TABLE IF NOT EXISTS ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  rater_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rated_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payment tracking
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  stripe_payment_id TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Verification documents
CREATE TABLE IF NOT EXISTS verifications (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  document_type VARCHAR(50) NOT NULL,
  document_url TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, document_type)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_jobs_creator ON jobs(creator_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_category ON jobs(category);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(location);
CREATE INDEX IF NOT EXISTS idx_applications_job ON job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_applicant ON job_applications(applicant_id);
CREATE INDEX IF NOT EXISTS idx_ratings_rated ON ratings(rated_id);
CREATE INDEX IF NOT EXISTS idx_tickets_job ON job_tickets(job_id);

-- RLS Policies
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE verifications ENABLE ROW LEVEL SECURITY;

-- Jobs policies
CREATE POLICY "Users can view open jobs and own jobs" ON jobs
  FOR SELECT USING (status = 'open' OR creator_id = auth.uid());

CREATE POLICY "Users can create jobs" ON jobs
  FOR INSERT WITH CHECK (creator_id = auth.uid());

CREATE POLICY "Users can update own jobs" ON jobs
  FOR UPDATE USING (creator_id = auth.uid());

-- Applications policies
CREATE POLICY "Users can view applications for own jobs or own applications" ON job_applications
  FOR SELECT USING (
    applicant_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM jobs WHERE jobs.id = job_applications.job_id AND jobs.creator_id = auth.uid())
  );

CREATE POLICY "Users can create applications" ON job_applications
  FOR INSERT WITH CHECK (applicant_id = auth.uid());

-- Tickets policies
CREATE POLICY "Users can view own tickets" ON job_tickets
  FOR SELECT USING (
    applicant_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM jobs WHERE jobs.id = job_tickets.job_id AND jobs.creator_id = auth.uid())
  );

CREATE POLICY "Users can update own tickets" ON job_tickets
  FOR UPDATE USING (
    applicant_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM jobs WHERE jobs.id = job_tickets.job_id AND jobs.creator_id = auth.uid())
  );

-- Ratings policies
CREATE POLICY "Users can view ratings" ON ratings
  FOR SELECT USING (true);

CREATE POLICY "Users can create ratings for completed jobs" ON ratings
  FOR INSERT WITH CHECK (
    rater_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM job_tickets jt 
      JOIN jobs j ON jt.job_id = j.id 
      WHERE j.id = ratings.job_id 
      AND jt.status = 'completed'
      AND (jt.applicant_id = auth.uid() OR j.creator_id = auth.uid())
    )
  );

-- Payments policies
CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM jobs j 
      WHERE j.id = payments.job_id 
      AND (j.creator_id = auth.uid() OR EXISTS (
        SELECT 1 FROM job_tickets jt 
        WHERE jt.job_id = j.id AND jt.applicant_id = auth.uid()
      ))
    )
  );

-- Verifications policies
CREATE POLICY "Users can view own verifications" ON verifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert own verifications" ON verifications
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- Function to update user rating
CREATE OR REPLACE FUNCTION update_user_rating(user_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE profiles 
  SET rating = (
    SELECT COALESCE(AVG(score), 5.0)
    FROM ratings 
    WHERE rated_id = user_id
  )
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;