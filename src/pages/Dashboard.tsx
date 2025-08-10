
import React, { useState, useEffect } from 'react';
import { Plus, Calendar, FolderOpen, Star, Award, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CreateProjectModal } from '@/components/CreateProjectModal';
import { DashboardHeader } from '@/components/DashboardHeader';
import { KarmaDisplay } from '@/components/KarmaDisplay';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useTutorial } from '@/hooks/useTutorial';
import { useJobs } from '@/hooks/useJobs';
import { useKarma } from '@/hooks/useKarma';

const Dashboard = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { getTotalXP, getCompletedLessonsCount } = useTutorial();
  const { jobs, myJobs } = useJobs();
  const { userStats } = useKarma();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  // Prevent multiple renders while data is loading
  useEffect(() => {
    if (user && profile && jobs.length >= 0 && myJobs.length >= 0) {
      setDataLoaded(true);
    }
  }, [user, profile, jobs, myJobs]);

  const handleCreateProject = (projectData: any) => {
    console.log('Creating project:', projectData);
    setIsCreateModalOpen(false);
  };

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      active: "bg-green-500 hover:bg-green-600 text-white glow-green",
      archived: "bg-gray-600 hover:bg-gray-700 text-white"
    };
    
    return (
      <Badge className={statusStyles[status as keyof typeof statusStyles] || statusStyles.active}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Show loading state while data is being fetched
  if (!dataLoaded) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Laden...</div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-900">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8">
        {/* Dashboard Title and Welcome */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 scroll-fade-in">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 text-glow">
              Willkommen zurück, {profile?.first_name || user?.email}!
            </h1>
            <p className="text-gray-400">Hier ist Ihr persönliches Dashboard</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gray-800 border-gray-700 card-futuristic hover-lift glow-blue scroll-slide-left delay-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Verfügbare Jobs</p>
                  <p className="text-3xl font-bold text-white text-glow">
                    {jobs.length}
                  </p>
                </div>
                <div className="bg-blue-600 p-3 rounded-full floating glow-blue">
                  <FolderOpen className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 card-futuristic hover-lift glow-green scroll-slide-left delay-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Meine Jobs</p>
                  <p className="text-3xl font-bold text-white text-glow-green">{myJobs.length}</p>
                </div>
                <div className="bg-green-600 p-3 rounded-full floating glow-green">
                  <Star className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 card-futuristic hover-lift glow-orange scroll-slide-left delay-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Karma</p>
                  <p className="text-3xl font-bold text-white">{profile?.karma_points || 0}</p>
                </div>
                <div className="bg-orange-600 p-3 rounded-full floating glow-orange pulse-glow">
                  <span className="text-white text-xl">🔥</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 card-futuristic hover-lift glow-purple scroll-slide-left delay-400">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-400">Verdienst</p>
                  <p className="text-3xl font-bold text-white text-glow-purple">
                    {profile?.total_earned?.toFixed(2) || '0.00'}€
                  </p>
                </div>
                <div className="bg-purple-600 p-3 rounded-full floating glow-purple">
                  <span className="text-white text-xl">💰</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700 card-futuristic hover-lift glow-blue scroll-scale-in delay-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-white leading-tight hover-glow">
                Campus Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Lektionen abgeschlossen</span>
                  <span className="text-white font-medium">{getCompletedLessonsCount()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Gesamt XP</span>
                  <span className="text-yellow-400 font-medium">{getTotalXP()}</span>
                </div>
                <Button 
                  onClick={() => window.location.href = '/tutorial'} 
                  className="w-full btn-futuristic glow-blue hover-lift"
                >
                  Campus besuchen
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 card-futuristic hover-lift glow-green scroll-scale-in delay-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-white leading-tight hover-glow">
                Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-orange-400 floating">
                    {userStats?.streak_days || 0}
                  </div>
                  <div className="text-gray-400">Tage in Folge</div>
                </div>
                <p className="text-sm text-gray-400 text-center">
                  Bleiben Sie aktiv, um Ihre Streak zu halten!
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 card-futuristic hover-lift glow-purple scroll-scale-in delay-300">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-white leading-tight hover-glow">
                Schnellaktionen
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button 
                  onClick={() => window.location.href = '/jobs'} 
                  variant="outline" 
                  className="w-full btn-futuristic hover-lift"
                >
                  Jobs durchsuchen
                </Button>
                <Button 
                  onClick={() => window.location.href = '/missions'} 
                  variant="outline" 
                  className="w-full btn-futuristic hover-lift"
                >
                  Missionen
                </Button>
                <Button 
                  onClick={() => window.location.href = '/map'} 
                  variant="outline" 
                  className="w-full btn-futuristic hover-lift"
                >
                  Karte öffnen
                </Button>
                <Button 
                  onClick={() => window.location.href = '/profile'} 
                  variant="outline" 
                  className="w-full btn-futuristic hover-lift"
                >
                  Profil bearbeiten
                </Button>
                <Button 
                  onClick={() => window.location.href = '/admin'} 
                  variant="outline" 
                  className="w-full btn-futuristic hover-lift"
                >
                  Admin Panel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-gray-800 border-gray-700 card-futuristic hover-lift glow-blue scroll-fade-in delay-400">
          <CardHeader>
            <CardTitle className="text-white text-glow">Letzte Aktivitäten</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-gray-700 rounded-lg hover-lift">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-white font-medium">Willkommen bei Mutuus!</p>
                  <p className="text-gray-400 text-sm">Erkunden Sie die App und verdienen Sie Ihre ersten Punkte</p>
                </div>
                <span className="text-gray-400 text-sm">Heute</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
