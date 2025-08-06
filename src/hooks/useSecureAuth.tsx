import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  validateEmail, 
  validatePassword, 
  sanitizeInput, 
  validateName, 
  authRateLimiter 
} from '@/lib/validation';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  loginAttempts: number;
  isLocked: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData?: { first_name?: string; last_name?: string }) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function SecureAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('🔐 Secure auth state changed:', event, session?.user?.email || 'No user');

        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);

        if (event === 'SIGNED_IN' && session?.user) {
          console.log('✅ User signed in securely:', session.user.email);
          setLoginAttempts(0);
          setIsLocked(false);
          
          // Update user streak on login (defer with setTimeout to avoid deadlock)
          setTimeout(() => {
            updateUserStreak(session.user.id);
          }, 0);
        }

        if (event === 'SIGNED_OUT') {
          console.log('🚪 User signed out securely');
          setLoginAttempts(0);
          setIsLocked(false);
        }

        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (mounted) {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const updateUserStreak = async (userId: string) => {
    try {
      const { error } = await supabase.rpc('update_user_streak', {
        user_id: userId
      });
      if (error) {
        console.error('Error updating user streak:', error);
      }
    } catch (error) {
      console.error('Failed to update user streak:', error);
    }
  };

  const signIn = async (email: string, password: string) => {
    // Input validation
    const sanitizedEmail = sanitizeInput(email);
    if (!validateEmail(sanitizedEmail)) {
      throw new Error('Ungültige E-Mail-Adresse');
    }

    if (!password || password.length === 0) {
      throw new Error('Passwort ist erforderlich');
    }

    // Rate limiting
    const rateLimitKey = `signin_${sanitizedEmail}`;
    if (!authRateLimiter.isAllowed(rateLimitKey, 5, 15 * 60 * 1000)) { // 5 attempts per 15 minutes
      setIsLocked(true);
      throw new Error('Zu viele Anmeldeversuche. Bitte warten Sie 15 Minuten.');
    }

    try {
      setLoading(true);
      console.log('🔑 Attempting secure sign in for:', sanitizedEmail);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail.toLowerCase(),
        password: password,
      });

      if (error) {
        setLoginAttempts(prev => prev + 1);
        console.error('❌ Secure sign in error:', error.message);
        
        // Generic error message to prevent enumeration attacks
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Ungültige Anmeldedaten. Bitte überprüfen Sie Ihre E-Mail und Ihr Passwort.');
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
        setLoginAttempts(0);
        setIsLocked(false);
      }

      // Reset rate limiter on successful login
      authRateLimiter.reset(rateLimitKey);
      
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

  const signUp = async (email: string, password: string, userData: { first_name?: string; last_name?: string } = {}) => {
    // Input validation
    const sanitizedEmail = sanitizeInput(email);
    if (!validateEmail(sanitizedEmail)) {
      throw new Error('Ungültige E-Mail-Adresse');
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.errors[0]);
    }

    // Validate user data
    if (userData.first_name && !validateName(userData.first_name)) {
      throw new Error('Ungültiger Vorname');
    }
    if (userData.last_name && !validateName(userData.last_name)) {
      throw new Error('Ungültiger Nachname');
    }

    // Rate limiting
    const rateLimitKey = `signup_${sanitizedEmail}`;
    if (!authRateLimiter.isAllowed(rateLimitKey, 3, 60 * 60 * 1000)) { // 3 attempts per hour
      throw new Error('Zu viele Registrierungsversuche. Bitte warten Sie eine Stunde.');
    }

    try {
      setLoading(true);
      console.log('📝 Attempting secure sign up for:', sanitizedEmail);
      
      const { error } = await supabase.auth.signUp({
        email: sanitizedEmail.toLowerCase(),
        password,
        options: {
          data: {
            first_name: userData.first_name ? sanitizeInput(userData.first_name) : '',
            last_name: userData.last_name ? sanitizeInput(userData.last_name) : '',
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });
      
      if (error) {
        console.error('❌ Secure sign up error:', error.message);
        
        if (error.message.includes('User already registered')) {
          throw new Error('Ein Konto mit dieser E-Mail-Adresse existiert bereits.');
        } else if (error.message.includes('Password should be at least')) {
          throw new Error('Passwort entspricht nicht den Sicherheitsanforderungen.');
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
      setLoginAttempts(0);
      setIsLocked(false);

      toast({
        title: "Erfolgreich abgemeldet",
        description: "Bis bald!",
      });
    } catch (error: any) {
      toast({
        title: "Abmeldung fehlgeschlagen",
        description: "Ein Fehler ist aufgetreten.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    const sanitizedEmail = sanitizeInput(email);
    if (!validateEmail(sanitizedEmail)) {
      throw new Error('Ungültige E-Mail-Adresse');
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(sanitizedEmail, {
        redirectTo: `${window.location.origin}/`,
      });
      if (error) throw error;
      
      toast({
        title: "E-Mail gesendet",
        description: "Prüfen Sie Ihren Posteingang für den Passwort-Reset-Link.",
      });
    } catch (error: any) {
      toast({
        title: "Fehler beim Zurücksetzen",
        description: "Ein Fehler ist aufgetreten.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateProfile = async (data: any) => {
    try {
      if (!user) throw new Error('Kein Benutzer angemeldet');
      
      // Sanitize input data
      const sanitizedData = Object.keys(data).reduce((acc, key) => {
        if (typeof data[key] === 'string') {
          acc[key] = sanitizeInput(data[key]);
        } else {
          acc[key] = data[key];
        }
        return acc;
      }, {} as any);
      
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...sanitizedData,
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
        description: "Ein Fehler ist aufgetreten.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const value = {
    user,
    session,
    loading,
    loginAttempts,
    isLocked,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useSecureAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useSecureAuth must be used within a SecureAuthProvider');
  }
  return context;
}
