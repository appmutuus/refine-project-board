import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useSecureJobs } from '@/hooks/useSecureJobs';
import { useAuth } from '@/hooks/useAuth';
import { MapPin, Clock, Euro, Heart, Briefcase, Star, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const JobSystem = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'browse' | 'create' | 'my-jobs'>('browse');
  const [loading, setLoading] = useState(false);

  // Job creation form
  const [newJob, setNewJob] = useState({
    title: '',
    description: '',
    category: '',
    job_type: 'good_deeds' as 'good_deeds' | 'kein_bock',
    budget: 0,
    karma_reward: 10,
    location: ''
  });

  const {
    jobs,
    myJobs,
    applications: myApplications,
    tickets,
    loading: hookLoading,
    createJob,
    applyForJob,
    fetchApplicationsForJob,
    acceptApplication,
    completeJob,
    submitRating,
    refetch
  } = useSecureJobs();

  const [applications, setApplications] = useState<Record<string, any[]>>({});

  useEffect(() => {
    if (user && myJobs.length > 0) {
      loadApplicationsForMyJobs();
    }
  }, [user, myJobs]);

  const loadApplicationsForMyJobs = async () => {
    for (const job of myJobs) {
      try {
        const appData = await fetchApplicationsForJob(job.id);
        setApplications(prev => ({
          ...prev,
          [job.id]: appData
        }));
      } catch (error) {
        console.error('Error loading applications for job:', job.id, error);
      }
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await createJob(newJob);
      if (result) {
        toast({
          title: "Job erstellt!",
          description: "Ihr Job wurde erfolgreich veröffentlicht",
        });
        setNewJob({
          title: '',
          description: '',
          category: '',
          job_type: 'good_deeds',
          budget: 0,
          karma_reward: 10,
          location: ''
        });
        refetch();
        setActiveTab('my-jobs');
      }
    } catch (error: any) {
      // Error handling is already done in the hook
    }
    setLoading(false);
  };

  const handleApplyToJob = async (jobId: string, message: string = '') => {
    const success = await applyForJob(jobId, message);
    if (success) {
      refetch();
    }
  };

  const handleAcceptApplication = async (jobId: string, applicationId: string, applicantId: string) => {
    const success = await acceptApplication(jobId, applicationId, applicantId);
    if (success) {
      refetch();
      loadApplicationsForMyJobs();
    }
  };

  const JobCard = ({ job, showApplications = false, isOwn = false }: { 
    job: any; 
    showApplications?: boolean; 
    isOwn?: boolean;
  }) => (
    <Card className="bg-card border-border hover:border-primary/50 transition-colors">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground">{job.title}</CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant={job.job_type === 'good_deeds' ? 'default' : 'secondary'}>
                {job.job_type === 'good_deeds' ? (
                  <>
                    <Heart className="w-3 h-3 mr-1" />
                    Good Deed
                  </>
                ) : (
                  <>
                    <Briefcase className="w-3 h-3 mr-1" />
                    Bezahlt
                  </>
                )}
              </Badge>
              <Badge variant="outline">{job.category}</Badge>
            </div>
          </div>
          <div className="text-right">
            {job.job_type === 'kein_bock' && job.budget && (
              <div className="flex items-center text-green-600 font-bold">
                <Euro className="w-4 h-4 mr-1" />
                {job.budget}
              </div>
            )}
            <div className="flex items-center text-yellow-600 text-sm">
              <Star className="w-3 h-3 mr-1" />
              {job.karma_reward} Karma
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{job.description}</p>
        
        <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            {job.location}
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {new Date(job.created_at).toLocaleDateString('de-DE')}
          </div>
          {job.profiles && (
            <div className="flex items-center">
              <User className="w-4 h-4 mr-1" />
              {job.profiles.first_name} ({job.profiles.rating.toFixed(1)} ⭐)
            </div>
          )}
        </div>

        {!isOwn && job.status === 'open' && (
          <Button 
            onClick={() => handleApplyToJob(job.id)}
            className="w-full"
            disabled={loading}
          >
            Jetzt bewerben
          </Button>
        )}

        {showApplications && applications[job.id] && (
          <div className="mt-4 pt-4 border-t">
            <h4 className="font-semibold mb-2">Bewerbungen ({applications[job.id].length})</h4>
            {applications[job.id].map((app) => (
              <div key={app.id} className="flex justify-between items-center p-2 border rounded mb-2">
                <div>
                  <span className="font-medium">
                    {app.profiles.first_name} {app.profiles.last_name}
                  </span>
                  <span className="text-sm text-muted-foreground ml-2">
                    ({app.profiles.rating.toFixed(1)} ⭐)
                  </span>
                  {app.message && (
                    <p className="text-sm mt-1">{app.message}</p>
                  )}
                </div>
                {app.status === 'pending' && (
                  <Button 
                    size="sm" 
                    onClick={() => handleAcceptApplication(job.id, app.id, app.applicant_id)}
                  >
                    Akzeptieren
                  </Button>
                )}
                {app.status !== 'pending' && (
                  <Badge variant={app.status === 'accepted' ? 'default' : 'destructive'}>
                    {app.status === 'accepted' ? 'Akzeptiert' : 'Abgelehnt'}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto p-6">
      {/* Navigation */}
      <div className="flex gap-2 mb-6">
        {['browse', 'create', 'my-jobs'].map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? 'default' : 'outline'}
            onClick={() => setActiveTab(tab as any)}
          >
            {tab === 'browse' && 'Jobs durchsuchen'}
            {tab === 'create' && 'Job erstellen'}
            {tab === 'my-jobs' && 'Meine Jobs'}
          </Button>
        ))}
      </div>

      {/* Browse Jobs */}
      {activeTab === 'browse' && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Verfügbare Jobs</h2>
          {(loading || hookLoading) ? (
            <div>Lädt...</div>
          ) : jobs.length === 0 ? (
            <p className="text-muted-foreground">Keine Jobs verfügbar.</p>
          ) : (
            jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))
          )}
        </div>
      )}

      {/* Create Job */}
      {activeTab === 'create' && (
        <Card>
          <CardHeader>
            <CardTitle>Neuen Job erstellen</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateJob} className="space-y-4">
              <div>
                <Label htmlFor="title">Titel</Label>
                <Input
                  id="title"
                  value={newJob.title}
                  onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Beschreibung</Label>
                <Textarea
                  id="description"
                  value={newJob.description}
                  onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Kategorie</Label>
                  <Select
                    value={newJob.category}
                    onValueChange={(value) => setNewJob({ ...newJob, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Kategorie wählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hausarbeit">Hausarbeit</SelectItem>
                      <SelectItem value="garten">Garten</SelectItem>
                      <SelectItem value="transport">Transport</SelectItem>
                      <SelectItem value="handwerk">Handwerk</SelectItem>
                      <SelectItem value="betreuung">Betreuung</SelectItem>
                      <SelectItem value="sonstiges">Sonstiges</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="job_type">Job-Typ</Label>
                  <Select
                    value={newJob.job_type}
                    onValueChange={(value: 'good_deeds' | 'kein_bock') => 
                      setNewJob({ ...newJob, job_type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="good_deeds">Good Deed (kostenlos)</SelectItem>
                      <SelectItem value="kein_bock">Bezahlter Job</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {newJob.job_type === 'kein_bock' && (
                  <div>
                    <Label htmlFor="budget">Budget (€)</Label>
                    <Input
                      id="budget"
                      type="number"
                      min="0"
                      value={newJob.budget}
                      onChange={(e) => setNewJob({ ...newJob, budget: Number(e.target.value) })}
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="karma_reward">Karma-Belohnung</Label>
                  <Input
                    id="karma_reward"
                    type="number"
                    min="1"
                    value={newJob.karma_reward}
                    onChange={(e) => setNewJob({ ...newJob, karma_reward: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location">Standort</Label>
                <Input
                  id="location"
                  value={newJob.location}
                  onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                  required
                />
              </div>

              <Button type="submit" disabled={loading}>
                {loading ? 'Erstelle...' : 'Job erstellen'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* My Jobs */}
      {activeTab === 'my-jobs' && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Meine Jobs</h2>
          {myJobs.length === 0 ? (
            <p className="text-muted-foreground">Sie haben noch keine Jobs erstellt.</p>
          ) : (
            myJobs.map((job) => (
              <JobCard 
                key={job.id} 
                job={job} 
                showApplications={true} 
                isOwn={true}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
};