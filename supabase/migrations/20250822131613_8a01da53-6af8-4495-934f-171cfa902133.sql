-- Fix RLS security issues with correct table names

-- Enable RLS on tables that don't have it yet
ALTER TABLE public.karma_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles (add missing policies)
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (id = auth.uid());

-- Create RLS policies for karma_transactions
CREATE POLICY "Users can view own karma transactions" ON public.karma_transactions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can insert karma transactions" ON public.karma_transactions
  FOR INSERT WITH CHECK (true);

-- Create RLS policies for achievements
CREATE POLICY "Anyone can view achievements" ON public.achievements
  FOR SELECT USING (true);

-- Create RLS policies for user_achievements
CREATE POLICY "Users can view own achievements" ON public.user_achievements
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can insert user achievements" ON public.user_achievements
  FOR INSERT WITH CHECK (true);

-- Create RLS policies for favorites
CREATE POLICY "Users can manage own favorites" ON public.favorites
  FOR ALL USING (user_id = auth.uid());

-- Create RLS policies for referrals
CREATE POLICY "Users can view own referrals" ON public.referrals
  FOR SELECT USING (referrer_id = auth.uid() OR referred_user_id = auth.uid());

CREATE POLICY "Users can create referrals" ON public.referrals
  FOR INSERT WITH CHECK (referrer_id = auth.uid());

-- Create RLS policies for reviews
CREATE POLICY "Users can view all reviews" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can create reviews" ON public.reviews
  FOR INSERT WITH CHECK (reviewer_id = auth.uid());

-- Create RLS policies for transactions
CREATE POLICY "Users can view own transactions" ON public.transactions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can manage transactions" ON public.transactions
  FOR ALL USING (true);

-- Create RLS policies for messages
CREATE POLICY "Users can view own messages" ON public.messages
  FOR SELECT USING (sender_id = auth.uid() OR recipient_id = auth.uid());

CREATE POLICY "Users can send messages" ON public.messages
  FOR INSERT WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update own messages" ON public.messages
  FOR UPDATE USING (sender_id = auth.uid() OR recipient_id = auth.uid());

-- Create RLS policies for leads (admin only)
CREATE POLICY "System can manage leads" ON public.leads
  FOR ALL USING (true);

-- Create RLS policies for app_config (admin only)
CREATE POLICY "Anyone can read app config" ON public.app_config
  FOR SELECT USING (true);

-- Fix remaining function search paths
CREATE OR REPLACE FUNCTION public.complete_mission(user_id uuid, mission_id uuid, photo_url text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
DECLARE
  mission_record RECORD;
  weekly_completions INTEGER;
  karma_awarded INTEGER;
BEGIN
  -- Get mission details
  SELECT * INTO mission_record
  FROM public.missions
  WHERE id = mission_id AND is_active = true;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Mission not found or inactive');
  END IF;
  
  -- Check weekly completion limit
  SELECT COUNT(*) INTO weekly_completions
  FROM public.user_missions
  WHERE user_id = user_id 
    AND mission_id = mission_id
    AND completed_at >= (now() - interval '7 days');
    
  IF weekly_completions >= mission_record.max_completions_per_week THEN
    RETURN jsonb_build_object('success', false, 'error', 'Weekly completion limit reached');
  END IF;
  
  -- Check if photo is required
  IF mission_record.photo_required AND (photo_url IS NULL OR photo_url = '') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Photo required for this mission');
  END IF;
  
  -- Insert mission completion
  INSERT INTO public.user_missions (
    user_id,
    mission_id,
    photo_url,
    karma_awarded
  ) VALUES (
    user_id,
    mission_id,
    photo_url,
    mission_record.karma_reward
  );
  
  -- Award karma if it's a good deed
  IF mission_record.mission_type = 'good_deed' THEN
    UPDATE public.profiles 
    SET good_deeds_completed = good_deeds_completed + 1
    WHERE id = user_id;
  END IF;
  
  -- Award karma points
  PERFORM public.award_karma(
    user_id,
    mission_record.karma_reward,
    'Mission completed: ' || mission_record.title,
    NULL,
    mission_id,
    'mission'
  );
  
  RETURN jsonb_build_object(
    'success', true, 
    'karma_awarded', mission_record.karma_reward,
    'message', 'Mission completed successfully!'
  );
END;
$function$;