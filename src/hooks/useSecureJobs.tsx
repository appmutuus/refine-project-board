import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

interface Job {
  id: string;
  creator_id: string;
  title: string;
  description: string;
  job_type: 'good_deeds' | 'kein_bock';
  budget?: number;
  karma_reward?: number;
  category: string;
  location: string;
  latitude?: number;
  longitude?: number;
  status: string;
  estimated_duration?: number;
  due_date?: string;
  images?: string[];
  requirements?: string[];
  created_at: string;
  updated_at: string;
}

interface JobApplication {
  id: string;
  job_id: string;
  applicant_id: string;
  message: string;
  status: string;
  created_at: string;
  profiles?: {
    first_name?: string;
    last_name?: string;
    rating?: number;
  };
}

interface JobTicket {
  id: string;
  job_id: string;
  applicant_id: string;
  status: string;
  payment_released: boolean;
  karma_awarded: boolean;
  completed_at?: string;
  created_at: string;
}

export function useSecureJobs() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [myJobs, setMyJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [tickets, setTickets] = useState<JobTicket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchJobs();
      fetchMyJobs();
      fetchApplications();
      fetchTickets();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs((data || []) as Job[]);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast({
        title: "Fehler",
        description: "Jobs konnten nicht geladen werden.",
        variant: "destructive",
      });
    }
  };

  const fetchMyJobs = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMyJobs((data || []) as Job[]);
    } catch (error) {
      console.error('Error fetching my jobs:', error);
    }
  };

  const fetchApplications = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .eq('applicant_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications((data || []) as JobApplication[]);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const fetchTickets = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('job_tickets')
        .select('*')
        .eq('applicant_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const createJob = async (jobData: Omit<Job, 'id' | 'creator_id' | 'created_at' | 'updated_at' | 'status'>) => {
    if (!user) {
      toast({
        title: "Fehler",
        description: "Sie müssen angemeldet sein, um einen Job zu erstellen.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('jobs')
        .insert([{
          ...jobData,
          creator_id: user.id,
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Job erstellt",
        description: "Ihr Job wurde erfolgreich veröffentlicht!",
      });

      await fetchJobs();
      await fetchMyJobs();
      return data;
    } catch (error: any) {
      console.error('Error creating job:', error);
      toast({
        title: "Fehler",
        description: error.message || "Job konnte nicht erstellt werden.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const applyForJob = async (jobId: string, message: string = '') => {
    if (!user) {
      toast({
        title: "Fehler", 
        description: "Sie müssen angemeldet sein, um sich zu bewerben.",
        variant: "destructive",
      });
      return false;
    }

    try {
      const { error } = await supabase
        .from('job_applications')
        .insert([{
          job_id: jobId,
          applicant_id: user.id,
          message,
        }]);

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "Bereits beworben",
            description: "Sie haben sich bereits für diesen Job beworben.",
            variant: "destructive",
          });
          return false;
        }
        throw error;
      }

      toast({
        title: "Bewerbung gesendet",
        description: "Ihre Bewerbung wurde erfolgreich eingereicht!",
      });

      await fetchApplications();
      return true;
    } catch (error: any) {
      console.error('Error applying for job:', error);
      toast({
        title: "Fehler",
        description: error.message || "Bewerbung konnte nicht gesendet werden.",
        variant: "destructive",
      });
      return false;
    }
  };

  const fetchApplicationsForJob = async (jobId: string): Promise<JobApplication[]> => {
    try {
      const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .eq('job_id', jobId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as JobApplication[];
    } catch (error) {
      console.error('Error fetching job applications:', error);
      return [];
    }
  };

  const acceptApplication = async (jobId: string, applicationId: string, applicantId: string) => {
    if (!user) return false;

    try {
      // Start transaction by updating job status and creating ticket
      const { error: jobError } = await supabase
        .from('jobs')
        .update({ 
          status: 'in_progress',
          updated_at: new Date().toISOString()
        })
        .eq('id', jobId)
        .eq('creator_id', user.id);

      if (jobError) throw jobError;

      // Accept the application
      const { error: appError } = await supabase
        .from('job_applications')
        .update({ status: 'accepted' })
        .eq('id', applicationId);

      if (appError) throw appError;

      // Reject other applications
      const { error: rejectError } = await supabase
        .from('job_applications')
        .update({ status: 'rejected' })
        .eq('job_id', jobId)
        .neq('id', applicationId);

      if (rejectError) throw rejectError;

      // Create job ticket
      const { error: ticketError } = await supabase
        .from('job_tickets')
        .insert([{
          job_id: jobId,
          applicant_id: applicantId,
          status: 'active'
        }]);

      if (ticketError) throw ticketError;

      toast({
        title: "Bewerber akzeptiert",
        description: "Der Job wurde zugewiesen und ein Ticket erstellt.",
      });

      await fetchMyJobs();
      return true;
    } catch (error: any) {
      console.error('Error accepting application:', error);
      toast({
        title: "Fehler",
        description: error.message || "Bewerbung konnte nicht akzeptiert werden.",
        variant: "destructive",
      });
      return false;
    }
  };

  const completeJob = async (ticketId: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('job_tickets')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', ticketId);

      if (error) throw error;

      toast({
        title: "Job abgeschlossen",
        description: "Der Job wurde als abgeschlossen markiert.",
      });

      await fetchTickets();
      return true;
    } catch (error: any) {
      console.error('Error completing job:', error);
      toast({
        title: "Fehler", 
        description: error.message || "Job konnte nicht abgeschlossen werden.",
        variant: "destructive",
      });
      return false;
    }
  };

  const submitRating = async (jobId: string, ratedUserId: string, score: number, comment: string = '') => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('ratings')
        .insert([{
          job_id: jobId,
          rater_id: user.id,
          rated_id: ratedUserId,
          score,
          comment
        }]);

      if (error) throw error;

      // Update user's average rating
      await supabase.rpc('update_user_rating', { user_id: ratedUserId });

      toast({
        title: "Bewertung abgegeben",
        description: "Ihre Bewertung wurde gespeichert.",
      });

      return true;
    } catch (error: any) {
      console.error('Error submitting rating:', error);
      toast({
        title: "Fehler",
        description: error.message || "Bewertung konnte nicht gespeichert werden.",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    jobs,
    myJobs,
    applications,
    tickets,
    loading,
    createJob,
    applyForJob,
    fetchApplicationsForJob,
    acceptApplication,
    completeJob,
    submitRating,
    refetch: () => {
      fetchJobs();
      fetchMyJobs();
      fetchApplications();
      fetchTickets();
    }
  };
}