import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Cache for session data to prevent excessive requests
let sessionCache: { session: Session | null; timestamp: number } | null = null;
const CACHE_DURATION = 30000; // 30 seconds

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData?: any) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;
    let authStateChangeTimeout: NodeJS.Timeout;
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('🔐 Auth state changed:', event, session?.user?.email || 'No user');

        if (!mounted) return;

        // Debounce auth state changes to prevent rapid updates
        clearTimeout(authStateChangeTimeout);
        authStateChangeTimeout = setTimeout(() => {
          // Update cache
          sessionCache = { session, timestamp: Date.now() };
        // Only update state when we have a session or the user explicitly signed out.
        if (session) {
          setSession(session);
          setUser(session.user);

          // Create/update profile only on sign in
          if (event === 'SIGNED_IN') {
            console.log('✅ User signed in:', session.user.email);

            // Use setTimeout to prevent blocking auth flow
            setTimeout(() => {
              supabase
                .from('profiles')
                .upsert({
                  id: session.user.id,
                  first_name: session.user.user_metadata?.first_name || null,
                  last_name: session.user.user_metadata?.last_name || null,
                  avatar_url: session.user.user_metadata?.avatar_url || null,
                  updated_at: new Date().toISOString(),
                 }, {
                   onConflict: 'id'
                 })
                 .then(({ error }) => {
                   if (error) {
                     console.error('Profile upsert error:', error);
                   }
                 });
            }, 500); // Increased delay to reduce rapid requests
          }
        } else if (event === 'SIGNED_OUT') {
          // Explicit sign out
          console.log('🚪 User signed out');
          setSession(null);
          setUser(null);
        }

          setLoading(false);
        }, 100); // Debounce auth state changes
      }
    );

    // Check for existing session
    const checkSession = async () => {
      if (mounted) {
        // Use cached session if available and not expired
        if (sessionCache && (Date.now() - sessionCache.timestamp) < CACHE_DURATION) {
          console.log('🔄 Using cached session');
          setSession(sessionCache.session);
          setUser(sessionCache.session?.user ?? null);
          setLoading(false);
          return;
        }

        try {
          const { data: { session }, error } = await supabase.auth.getSession();
          console.log('🔄 Initial session check:', session?.user?.email || 'No session');
          if (error) {
            console.error('Session check error:', error);
          }
          setSession(session);
          setUser(session?.user ?? null);
          // Update cache
          sessionCache = { session, timestamp: Date.now() };
        } catch (error) {
          console.error('Session check failed:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    checkSession();

    return () => {
      mounted = false;
      clearTimeout(authStateChangeTimeout);
      subscription.unsubscribe();
    };
  }, []);


  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log('🔑 Attempting sign in for:', email);
      
      // Basic validation
      if (!email || !password) {
        throw new Error('E-Mail und Passwort sind erforderlich');
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password,
      });

      console.log('📞 Sign in response:', data, error);

      if (error) {
        console.error('❌ Sign in error:', error);
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Ungültige E-Mail oder Passwort. Bitte überprüfen Sie Ihre Eingaben.');
        } else if (error.message.includes('Email not confirmed')) {
          throw new Error('Bitte bestätigen Sie Ihre E-Mail-Adresse vor der Anmeldung.');
        } else if (error.message.includes('Too many requests')) {
          throw new Error('Zu viele Anmeldeversuche. Bitte warten Sie einen Moment.');
        }
        throw new Error('Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.');
      }

      if (data?.session) {
        setSession(data.session);
        setUser(data.session.user);
      }

      toast({
        title: "Erfolgreich angemeldet",
        description: "Willkommen zurück!",
      });
    } catch (error: any) {
      toast({
        title: "Anmeldung fehlgeschlagen",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData = {}) => {
    try {
      setLoading(true);
      console.log('📝 Attempting sign up for:', email);
      
      // Basic validation
      if (!email || !password) {
        throw new Error('E-Mail und Passwort sind erforderlich');
      }
      
      if (password.length < 6) {
        throw new Error('Passwort muss mindestens 6 Zeichen lang sein');
      }
      
      const { error } = await supabase.auth.signUp({
        email: email.trim().toLowerCase(),
        password,
        options: {
          data: userData,
          emailRedirectTo: `${window.location.origin}/#signin`,
        },
      });
      
      if (error) {
        console.error('❌ Sign up error:', error);
        if (error.message.includes('User already registered')) {
          throw new Error('Ein Konto mit dieser E-Mail-Adresse existiert bereits.');
        } else if (error.message.includes('Password should be at least')) {
          throw new Error('Passwort muss mindestens 6 Zeichen lang sein.');
        } else if (error.message.includes('Unable to validate email address')) {
          throw new Error('Ungültige E-Mail-Adresse.');
        }
        throw new Error('Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.');
      }
      
      toast({
        title: "Registrierung erfolgreich",
        description: "Sie können sich jetzt anmelden!",
      });
    } catch (error: any) {
      toast({
        title: "Registrierung fehlgeschlagen",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setSession(null);
      setUser(null);
      toast({
        title: "Erfolgreich abgemeldet",
        description: "Bis bald!",
      });
    } catch (error: any) {
      toast({
        title: "Abmeldung fehlgeschlagen",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      if (!email) {
        throw new Error('E-Mail-Adresse ist erforderlich');
      }
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/#signin`,
      });
      if (error) throw error;
      toast({
        title: "E-Mail gesendet",
        description: "Prüfen Sie Ihren Posteingang für den Passwort-Reset-Link.",
      });
    } catch (error: any) {
      toast({
        title: "Fehler beim Zurücksetzen",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateProfile = async (data: any) => {
    try {
      if (!user) throw new Error('Kein Benutzer angemeldet');
      
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...data,
          updated_at: new Date().toISOString(),
        });
      
      if (error) throw error;
      
      toast({
        title: "Profil aktualisiert",
        description: "Ihre Änderungen wurden gespeichert.",
      });
    } catch (error: any) {
      toast({
        title: "Aktualisierung fehlgeschlagen",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
