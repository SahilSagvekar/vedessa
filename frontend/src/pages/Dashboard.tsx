import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import CustomerDashboard from './CustomerDashboard';
import Admin from './Admin';

/**
 * Dashboard Router
 * 
 * This component automatically routes users to the appropriate dashboard
 * based on their role:
 * - Admins → AdminDashboard
 * - Customers → CustomerDashboard
 * - Not logged in → Redirect to login
 */
const Dashboard = () => {
  const { user, isAdmin, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  // useEffect(() => {
  //   // Redirect to login if not authenticated
  //   if (!loading && !isAuthenticated) {
  //     navigate('/login');
  //   }
  // }, [isAuthenticated, loading, navigate]);

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show nothing if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  // Route to appropriate dashboard based on role
  if (isAdmin) {
    return <Admin />;
  }

  return <CustomerDashboard />;
};

export default Dashboard;