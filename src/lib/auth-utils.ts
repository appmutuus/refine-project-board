import { supabase } from '@/integrations/supabase/client';

export const checkAuthStatus = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Auth status check error:', error);
      return { user: null, session: null, error };
    }
    
    return { 
      user: session?.user || null, 
      session: session || null, 
      error: null 
    };
  } catch (error) {
    console.error('Auth status check failed:', error);
    return { user: null, session: null, error };
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password: password,
    });

    if (error) {
      throw error;
    }

    return {
      user: data.user ?? null,
      session: data.session ?? null,
      error: null
    };
  } catch (error) {
    console.error('Sign in error:', error);
    return { user: null, session: null, error };
  }
};

export const signUpWithEmail = async (
  email: string, 
  password: string, 
  userData: { first_name?: string; last_name?: string } = {}
) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password: password,
      options: {
        data: userData,
      },
    });
    
    if (error) {
      throw error;
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Sign up error:', error);
    return { data: null, error };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      throw error;
    }
    
    return { error: null };
  } catch (error) {
    console.error('Sign out error:', error);
    return { error };
  }
};

export const resetPassword = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/`,
    });
    
    if (error) {
      throw error;
    }
    
    return { error: null };
  } catch (error) {
    console.error('Reset password error:', error);
    return { error };
  }
};
