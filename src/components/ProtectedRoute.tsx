import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function ProtectedRoute() {
  const location = useLocation();
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

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // If user needs onboarding and is not on the onboarding page, redirect there
  if (needsOnboarding && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  // If user doesn't need onboarding and is on the onboarding page, redirect to dashboard
  if (!needsOnboarding && location.pathname === '/onboarding') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
