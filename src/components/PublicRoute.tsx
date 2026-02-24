import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function PublicRoute() {
  const { session, isLoading, needsOnboarding } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (session) {
    // Redirect to onboarding if needed, otherwise to dashboard
    return <Navigate to={needsOnboarding ? "/onboarding" : "/dashboard"} replace />;
  }

  return <Outlet />;
}
