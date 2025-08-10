
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

// Cache for profile data
let profileCache: { [userId: string]: { profile: Profile; timestamp: number } } = {};
const CACHE_DURATION = 60000; // 1 minute

interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  location: string | null;
  bio: string | null;
  is_verified: boolean;
  karma_points: number;
  total_earned: number;
  cash_points: number;
  rank: 'starter' | 'community' | 'erfahren' | 'vertrauensperson' | 'vorbild';
  good_deeds_completed: number;
  streak_days: number;
  last_active: string;
  created_at: string;
  updated_at: string;
}

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      if (!user) return;

      // Check cache first
      const cached = profileCache[user.id];
      if (cached && (Date.now() - cached.timestamp) < CACHE_DURATION) {
        setProfile(cached.profile);
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setProfile(data);
        // Update cache
        profileCache[user.id] = { profile: data, timestamp: Date.now() };
      } else {
        // Create profile if it doesn't exist
        const newProfile = {
          id: user.id,
          first_name: user.user_metadata?.first_name || null,
          last_name: user.user_metadata?.last_name || null,
          avatar_url: user.user_metadata?.avatar_url || null,
        };

        const { data: createdProfile, error: createError } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .single();

        if (createError) throw createError;
        setProfile(createdProfile);
        // Update cache
        profileCache[user.id] = { profile: createdProfile, timestamp: Date.now() };
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      // Update cache
      profileCache[user.id] = { profile: data, timestamp: Date.now() };
      return data;
    } catch (error: any) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const getUserLevel = async () => {
    try {
      if (!user) return 1;

      const { data, error } = await supabase
        .rpc('calculate_user_level', { user_id: user.id });

      if (error) throw error;
      return data || 1;
    } catch (error: any) {
      console.error('Error calculating user level:', error);
      return 1;
    }
  };

  return {
    profile,
    loading,
    updateProfile,
    getUserLevel,
    fetchProfile,
  };
}
