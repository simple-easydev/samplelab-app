import { Navigate, Outlet, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';

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

  const hasStripeSession = searchParams.has('session_id');

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
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (hasStripeSession && location.pathname === '/dashboard') {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <Outlet />
      </div>
    );
  }

  if (needsOnboarding && location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }

  if (!needsOnboarding && location.pathname === '/onboarding') {
    return <Navigate to="/dashboard" replace />;
  }

  const showNavbar = location.pathname === '/dashboard';

  return (
    <div className="min-h-screen flex flex-col">
      {showNavbar && <Navbar />}
      <Outlet />
    </div>
  );
}
