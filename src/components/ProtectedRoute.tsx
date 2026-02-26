import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

/**
 * ProtectedRoute Component
 * 
 * Handles authentication and onboarding flow:
 * 1. Shows loading state while checking auth
 * 2. Redirects to login if not authenticated
 * 3. Enforces onboarding completion before accessing protected routes
 * 4. Prevents completed users from accessing onboarding page again
 */
export default function ProtectedRoute() {
  const location = useLocation();
  const { session, isLoading, needsOnboarding } = useAuth();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Force users who haven't completed onboarding to the onboarding page
  if (needsOnboarding && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  // Redirect users who completed onboarding away from onboarding page
  // This prevents users from accessing onboarding page after completion
  if (!needsOnboarding && location.pathname === '/onboarding') {
    return <Navigate to="/dashboard" replace />;
  }

  // User is authenticated and has completed onboarding (or is on onboarding page)
  return <Outlet />;
}
