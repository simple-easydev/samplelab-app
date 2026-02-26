import { Navigate, Outlet, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

/**
 * ProtectedRoute Component
 * 
 * Handles authentication and onboarding flow:
 * 1. Shows loading state while checking auth
 * 2. Redirects to login if not authenticated
 * 3. Enforces onboarding completion before accessing protected routes
 * 4. Prevents completed users from accessing onboarding page again
 * 5. Allows dashboard access when returning from Stripe checkout
 */
export default function ProtectedRoute() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { session, isLoading, needsOnboarding } = useAuth();

  // Check if returning from Stripe checkout
  const hasStripeSession = searchParams.has('session_id');

  console.log({ hasStripeSession })

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

  // Allow dashboard access when returning from Stripe (needs to complete onboarding process)
  if (hasStripeSession && location.pathname === '/dashboard') {
    console.log('🔓 Allowing dashboard access for Stripe return (session_id present)');
    return <Outlet />;
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
