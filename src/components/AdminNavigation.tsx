
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Home, 
  MessageSquare, 
  CreditCard, 
  AlertTriangle, 
  BarChart3, 
  Users, 
  Settings, 
  Shield,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export const AdminNavigation = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold">Mutuus Admin</h2>
        <p className="text-gray-400 text-sm">Dashboard 2.0</p>
      </div>

      <nav className="space-y-2">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-white hover:bg-gray-800"
          onClick={() => navigate('/dashboard')}
        >
          <Home className="w-4 h-4 mr-2" />
          Hauptdashboard
        </Button>

        <Button 
          variant="ghost" 
          className="w-full justify-start text-white hover:bg-gray-800"
          onClick={() => navigate('/admin')}
        >
          <Shield className="w-4 h-4 mr-2" />
          Admin Panel
        </Button>

        <div className="py-2">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Module</p>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start text-gray-300 hover:bg-gray-800"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Support
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start text-gray-300 hover:bg-gray-800"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Zahlungen
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start text-gray-300 hover:bg-gray-800"
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Fehler
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start text-gray-300 hover:bg-gray-800"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start text-gray-300 hover:bg-gray-800"
          >
            <Users className="w-4 h-4 mr-2" />
            CRM
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start text-gray-300 hover:bg-gray-800"
          >
            <Settings className="w-4 h-4 mr-2" />
            Technik
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start text-gray-300 hover:bg-gray-800"
          >
            <Shield className="w-4 h-4 mr-2" />
            Rollen
          </Button>
        </div>

        <div className="pt-4 border-t border-gray-700">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-400 hover:bg-red-900/20"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Abmelden
          </Button>
        </div>
      </nav>
    </div>
  );
};
